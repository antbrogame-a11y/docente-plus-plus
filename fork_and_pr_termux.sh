#!/usr/bin/env bash
set -euo pipefail

# Configurazione (modifica solo se necessario)
GITHUB_USER="${GITHUB_USER:-antoniocorsano-boop}"
UPSTREAM="${2:-antbrogame-a11y/docente-plus-plus}"
REPO_NAME="${UPSTREAM##*/}"
UPSTREAM_SSH="git@github.com:${UPSTREAM}.git"
FORK_SSH="git@github.com:${GITHUB_USER}/${REPO_NAME}.git"
BRANCH="${1:-test-ssh}"

echo "=== Fork & PR helper (Termux) ==="
echo "User: ${GITHUB_USER}"
echo "Upstream: ${UPSTREAM}"
echo "Repo: ${REPO_NAME}"
echo "Branch: ${BRANCH}"
echo

# 1) verifica siamo in una cartella git
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Errore: non sei in una cartella git. Entra nella clone del repo e rilancia lo script."
  exit 1
fi

# 2) prova a creare il fork (usa gh se presente, altrimenti apri il browser)
if command -v gh >/dev/null 2>&1; then
  echo "gh trovato: controllo se il fork esiste..."
  if gh repo view "${GITHUB_USER}/${REPO_NAME}" >/dev/null 2>&1; then
    echo "Fork già presente: ${GITHUB_USER}/${REPO_NAME}"
  else
    echo "Creo fork via gh..."
    gh repo fork "${UPSTREAM}" --clone=false
  fi
else
  echo "gh non installato: apro la pagina upstream per creare il fork manualmente."
  if command -v termux-open >/dev/null 2>&1; then
    termux-open "https://github.com/${UPSTREAM}"
  else
    echo "Apri nel browser: https://github.com/${UPSTREAM}"
  fi
  read -p "Dopo aver fatto il fork nel browser, premi INVIO per continuare..."
fi

# 3) imposta remotes: origin -> tuo fork, upstream -> originale
echo "Imposto origin su: ${FORK_SSH}"
git remote set-url origin "${FORK_SSH}"
git remote remove upstream 2>/dev/null || true
git remote add upstream "${UPSTREAM_SSH}" || true

echo
echo "Remotes attuali:"
git remote -v
echo

# 4) assicura che ssh-agent e la chiave siano caricati
echo "Avvio ssh-agent e provo a caricare la chiave ~/.ssh/id_ed25519 (se presente)..."
eval "$(ssh-agent -s)" >/dev/null
if ssh-add -l >/dev/null 2>&1; then
  echo "Chiavi già caricate nell'agent:"
  ssh-add -l
else
  if [ -f "${HOME}/.ssh/id_ed25519" ]; then
    ssh-add "${HOME}/.ssh/id_ed25519" >/dev/null 2>&1 || true
    echo "Chiave caricata (se richiesta la passphrase, inseriscila ora)."
  else
    echo "Nessuna chiave id_ed25519 trovata in ~/.ssh. Se non l'hai creata, esegui: ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519"
  fi
fi
echo

# 5) test SSH con GitHub
echo "Testo autenticazione SSH (ssh -T git@github.com)..."
SSH_OUT="$(ssh -T git@github.com 2>&1 || true)"
echo "${SSH_OUT}"
if echo "${SSH_OUT}" | grep -qi "successfully authenticated"; then
  echo "SSH autenticazione OK."
else
  echo
  echo "Attenzione: autenticazione SSH non confermata."
  echo "Se non hai aggiunto la chiave pubblica a GitHub, esegui: cat ~/.ssh/id_ed25519.pub e copia la chiave nella pagina GitHub -> Settings -> SSH and GPG keys -> New SSH key"
  read -p "Vuoi continuare comunque? (y/N) " yn
  case "${yn:-N}" in
    [Yy]*) echo "Procedo comunque." ;;
    *) echo "Esco. Aggiungi la chiave a GitHub e rilancia."; exit 1 ;;
  esac
fi
echo

# 6) checkout o creazione branch
if git rev-parse --verify "${BRANCH}" >/dev/null 2>&1; then
  echo "Passo al branch esistente: ${BRANCH}"
  git checkout "${BRANCH}"
else
  echo "Creo e passo al branch: ${BRANCH}"
  git checkout -b "${BRANCH}"
fi

# 7) push al fork (origin)
echo "Pusho il branch su origin (tuo fork)..."
git push -u origin "${BRANCH}"

# 8) apro la pagina compare per creare la PR
COMPARE_URL="https://github.com/${UPSTREAM}/compare/main...${GITHUB_USER}:${BRANCH}?expand=1"
echo
echo "Apri questa pagina per creare la PR:"
echo "${COMPARE_URL}"
if command -v termux-open >/dev/null 2>&1; then
  termux-open "${COMPARE_URL}" || true
fi

echo
echo "Fatto. Se vuoi che apra la PR automaticamente con gh, installa gh e rilancia con gh disponibile."
