# Development & Production Setup Guide
# Dynamic Hotel Pricing Management System

## 1. System Requirements
- Operating System: Windows 10/11, macOS, or Linux
- Python: 3.10.x or higher
- Node.js: v18.x, v20.x, or v22.x with npm
- Disk Space: ~500 MB (includes 119k dataset, ML binaries, and node_modules)

---

## 2. Step-by-Step Installation

### Step 1: Clone or Navigate to Directory
```bash
cd X:\dynamic-hotel-pricing
```

### Step 2: Set Up Python Dependencies
```bash
# Verify python environment
python --version

# Required packages (FastAPI, Scikit-learn, Pandas, NumPy, Scipy, Joblib, Pytest, Uvicorn)
pip install fastapi uvicorn scikit-learn pandas numpy scipy joblib pytest httpx
```

### Step 3: Download Dataset & Train Models
```bash
# 1. Download official benchmark dataset (119,390 records)
python ml/data/download_data.py

# 2. Execute full 5-Fold Cross-Validation, Model Training & Ensembling
python ml/training/train.py
```
This produces all fitted `.joblib` binaries and JSON metadata in `model_artifacts/`.

### Step 4: Start Backend API
```bash
# Start FastAPI server on port 8000
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
Swagger UI is live at: `http://127.0.0.1:8000/docs`

### Step 5: Start Frontend UI
```bash
cd X:\dynamic-hotel-pricing\frontend

# Install dependencies if not already present
npm install

# Start Vite preview or dev server
npm run dev
# or preview production build
node node_modules/vite/bin/vite.js preview --port 5173
```
Frontend is live at: `http://localhost:5173`

---

## 3. Running Automated Tests
```bash
# Run 20 Unit & Integration tests
python -m pytest tests/ -v

# Run 6 Playwright End-to-End browser tests (in Chrome)
npx playwright test
```
