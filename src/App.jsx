# Create Vite project
npm create vite@latest label-ecg -- --template react

# Navigate into it
cd label-ecg

# Install dependencies
npm install

# Install additional packages
npm install recharts lucide-react

# Start development server
npm run dev
```

Then just replace the contents of `src/App.jsx` with the ECG platform code.

---

## **Complete File Structure Should Look Like:**
```
label-ecg/
├── index.html          (ROOT, not in public/)
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   └── App.jsx         (ECG Platform code here)
└── node_modules/
