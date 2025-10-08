# 🚀 Quick Start Integration Example

This file provides a quick example of how to integrate the Material UI components into your Docente++ app.

## Option 1: Standalone React App (Recommended for Testing)

### Step 1: Install Dependencies

```bash
npm install react react-dom @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install -D vite @vitejs/plugin-react
```

### Step 2: Create Vite Config

Create `vite.config.js` in the project root:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  build: {
    outDir: 'dist'
  }
});
```

### Step 3: Create Entry Point

Create `src/index.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import MainScreen from './components/MainScreen';

const root = ReactDOM.createRoot(document.getElementById('app-root'));
root.render(
  <React.StrictMode>
    <MainScreen />
  </React.StrictMode>
);
```

### Step 4: Create HTML Page

Create `app.html` (or modify existing `index.html`):

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#4a90e2">
  <title>Docente++ - Material UI</title>
  <style>
    /* Reset default styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', 'Roboto', sans-serif;
    }
  </style>
</head>
<body>
  <div id="app-root"></div>
  <script type="module" src="/src/index.jsx"></script>
</body>
</html>
```

### Step 5: Update package.json

Add scripts to `package.json`:

```json
{
  "name": "docente-plus-plus",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

### Step 6: Run Development Server

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## Option 2: Hybrid Integration with Existing App

If you want to keep the existing vanilla JS app and add React components alongside:

### Step 1: Add React Mount Point to index.html

```html
<!-- In your existing index.html, add: -->
<div id="react-app-root" style="display:none;"></div>

<!-- Before closing </body> tag: -->
<script type="module" src="/src/index.jsx"></script>
```

### Step 2: Conditional Rendering in app.js

Add to your existing `app.js`:

```javascript
// Import React rendering (if using bundler)
import ReactDOM from 'react-dom/client';
import MainScreen from './src/components/MainScreen';

class DocentePlusPlus {
  // ... existing code ...

  // Add method to show React interface
  showReactInterface() {
    // Hide vanilla JS interface
    document.getElementById('app-container').style.display = 'none';
    
    // Show React interface
    const reactRoot = document.getElementById('react-app-root');
    reactRoot.style.display = 'block';
    
    // Mount React components
    if (!this.reactMounted) {
      const root = ReactDOM.createRoot(reactRoot);
      root.render(<MainScreen />);
      this.reactMounted = true;
    }
  }

  // Call this after successful login or from a menu
  afterLogin() {
    // ... existing login logic ...
    this.showReactInterface();
  }
}
```

### Step 3: Add Toggle Button

Add a button in your existing interface:

```html
<button onclick="app.showReactInterface()">
  🎨 Nuova Interfaccia Material UI
</button>
```

---

## Option 3: Quick Test (No Build Tools)

For a quick test without setting up a bundler:

### Step 1: Use CDN Links

Create `test-mui.html`:

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Material UI Components</title>
  
  <!-- Babel Standalone for JSX -->
  <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- React & ReactDOM -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  
  <!-- Material UI (Note: This is simplified, production should use proper bundler) -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
  />
  
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Roboto', sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState } = React;
    
    // Simplified version for testing
    function TestApp() {
      const [value, setValue] = useState(0);
      
      return (
        <div style={{ padding: '20px' }}>
          <h1>Material UI Test</h1>
          <p>This is a simplified test. For production, use proper build setup.</p>
          
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setValue(0)}>Orario</button>
            <button onClick={() => setValue(1)}>Impegni</button>
            <button onClick={() => setValue(2)}>Altro</button>
          </div>
          
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5' }}>
            {value === 0 && <h2>Orario Giornaliero</h2>}
            {value === 1 && <h2>Impegni Giornalieri</h2>}
            {value === 2 && <h2>Altro</h2>}
          </div>
        </div>
      );
    }
    
    ReactDOM.createRoot(document.getElementById('root')).render(<TestApp />);
  </script>
</body>
</html>
```

**Note**: This CDN approach is only for quick testing. For production, use a proper bundler (Vite, Webpack, etc.).

---

## Testing the Components

### Test Usage-Based Ordering (Altro Component)

Once running, test the Altro component:

1. Navigate to the "Altro" section
2. Click different features multiple times
3. Observe the automatic reordering
4. Open DevTools → Application → Local Storage
5. Find the `altroUsage` key
6. Verify the JSON structure:
   ```json
   {
     "settings": 5,
     "stats": 3,
     "help": 1
   }
   ```
7. Refresh the page
8. Verify the order persists

### Test Responsive Design

1. Open DevTools (F12)
2. Click the device toolbar icon (Ctrl+Shift+M)
3. Test on different screen sizes:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1920px)
4. Verify:
   - Bottom navigation is accessible
   - Content is readable
   - No horizontal overflow

---

## Troubleshooting

### "React is not defined"

Make sure React is imported:
```jsx
import React from 'react';
```

### "@mui/material not found"

Install dependencies:
```bash
npm install @mui/material @emotion/react @emotion/styled
```

### "Unexpected token '<'"

You need a JSX transpiler. Use Vite or add Babel configuration.

### Vite dev server won't start

Check:
1. Node.js version is 16 or higher
2. `vite.config.js` exists
3. Dependencies are installed (`npm install`)

### Components don't show

Check:
1. `app-root` div exists in HTML
2. No JavaScript console errors
3. React is rendering: Add `console.log('React mounted')` in index.jsx

---

## Next Steps

1. ✅ Get the components running
2. ✅ Test all three sections (Orario, Impegni, Altro)
3. ✅ Verify localStorage usage tracking
4. 🔄 Connect real data from app.js
5. 🔄 Implement backend sync
6. 🔄 Add drag-and-drop ordering
7. 🔄 Deploy to production

---

## Resources

- **Component Documentation**: `src/components/README.md`
- **Validation Checklist**: `src/components/checklist.md`
- **Material UI Docs**: https://mui.com/
- **Vite Guide**: https://vitejs.dev/guide/
- **React Docs**: https://react.dev/

---

**Need Help?**

Check the README.md files or open an issue on GitHub.

Happy coding! 🚀
