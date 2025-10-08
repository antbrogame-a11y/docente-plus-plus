# Guida Componenti UI Restyling

## MainScreen.jsx
Gestisce la navigazione tra le tre sezioni principali tramite Material UI.

## OrarioGiornaliero.jsx
Placeholder per l’orario. Personalizza secondo la tua logica.

## ImpegniGiornalieri.jsx
Placeholder per gli impegni. Personalizza secondo la tua logica.

## Altro.jsx
Sezione adattiva: le voci si ordinano secondo l’uso reale dell’utente (localStorage, estendibile per backend).  
Ogni click incrementa il contatore d’uso, migliorando l’esperienza nel tempo.

### Estensioni
- Sincronizza le preferenze con backend
- Drag&drop per riordino manuale
- Preferiti, suggerimenti, ecc.

---

## Dipendenze

```bash
npm install @mui/material @mui/icons-material
```
(opzionale per drag&drop)
```bash
npm install react-beautiful-dnd
```
