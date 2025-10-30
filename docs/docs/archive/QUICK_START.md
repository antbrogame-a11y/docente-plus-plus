# Quick Start Guide: Document Import Module

## 🚀 Quick Start (5 Minutes)

### Step 1: Import Students from CSV

1. **Prepare your CSV file** with student data:
   ```csv
   nome,cognome,email,classe,data_nascita,onomastico
   Mario,Rossi,mario@example.com,3A,2005-03-15,San Mario - 19 Gennaio
   ```

2. **Open Docente++** and go to the "🤖 Importa/gestisci con IA" tab

3. **Upload the file**:
   - Click the upload area, or
   - Drag and drop your CSV file

4. **Review AI Classification** (if you have OpenRouter API key):
   - The system will automatically recognize it as "Anagrafica Studenti"
   - Shows confidence level
   - Provides suggestions

5. **Preview the data**:
   - Check the table shows correct information
   - Verify field mapping is accurate

6. **Confirm Import**:
   - Click "✅ Conferma Importazione"
   - See results: "3 new students, 2 duplicates updated"

7. **Go to Students tab** to see your imported students with all fields!

### Step 2: Record a Lesson

1. **Go to "🤖 Importa/gestisci con IA" tab**

2. **Scroll to "🎙️ Registrazione Audio Lezione"**

3. **Click "🎙️ Avvia Registrazione"**
   - Allow microphone access when prompted

4. **Teach your lesson** while recording
   - Timer shows elapsed time
   - Class and lesson are auto-associated

5. **Click "⏹️ Ferma Registrazione"** when done

6. **Manage your recording**:
   - Play it back
   - Download it (WebM format)
   - Delete it if needed

## 📋 CSV Format Quick Reference

### Minimum Required

```csv
nome,email,classe
Mario Rossi,mario@example.com,3A
```

### Recommended (Full Features)

```csv
nome,cognome,email,classe,data_nascita,onomastico,note
Mario,Rossi,mario@example.com,3A,2005-03-15,San Mario - 19 Gennaio,Studente eccellente
```

### Supported Column Names

| Field | Italian | English |
|-------|---------|---------|
| Name | nome | name |
| Surname | cognome | lastname |
| Email | email | email, e-mail |
| Class | classe | class |
| Birthdate | data_nascita | birthdate |
| Nameday | onomastico, santo | nameday |
| Notes | note | notes |

## 🎯 Common Use Cases

### Import Class Roster
1. Export from your school system as CSV
2. Upload to Docente++
3. Students automatically added with all info

### Add Birthday Information
1. Prepare CSV with names and birthdates
2. Import file
3. Existing students updated with birthdate (no duplicates created!)

### Record and Archive Lessons
1. Start recording at beginning of class
2. Teach normally
3. Stop at end
4. Download recording for your records

## ⚡ Pro Tips

- **Use Italian column names** for best recognition
- **Include birthdates** to enable birthday tracking
- **Add onomastico** for personalized notifications
- **Test with small file first** (2-3 students)
- **Download recordings** before closing browser
- **Use notes field** for special needs or important info

## 🐛 Troubleshooting

### File not uploading?
- Check file format (CSV, XLSX, TXT, JSON)
- Try smaller file
- Check browser console for errors

### Fields not mapping correctly?
- Use standard column names (see table above)
- Check CSV encoding (UTF-8 recommended)
- Verify no empty required fields

### AI not classifying?
- Configure OpenRouter API key in Settings
- Check internet connection
- Use manual classification as fallback

### Microphone not working?
- Click "Allow" when browser asks for permission
- Check browser settings (Privacy & Security)
- Verify microphone is plugged in

## 📖 More Information

- **Full Guide**: See `DOCUMENT_IMPORT_MODULE.md`
- **README**: See `../README.md` section "Guida all'Uso"
- **Technical Details**: See `IMPLEMENTATION_SUMMARY.md`

## 🆘 Need Help?

Open an issue on GitHub with:
- What you were trying to do
- What happened instead
- Screenshots if helpful
- Browser console errors (F12)

---

**Ready to import your first students? Let's go! 🚀**
