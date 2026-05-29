# ⚡ Quick Start Guide

## ⚠️ Prerequisites
- **Python 3.9 or 3.11** (Python 3.13 has compatibility issues)
- Node.js 18+
- OpenAI API key

## 1️⃣ Backend Setup (5 minutes)

```bash
cd backend
py -3.9 -m venv venv  # Use Python 3.9
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env`:
```
OPENAI_API_KEY=sk-your-key
DATABASE_URL=sqlite:///./chatbot.db
SECRET_KEY=any-random-string
CORS_ORIGINS=http://localhost:3000
```

Run:
```bash
python -m uvicorn app.main:app --reload
```

## 2️⃣ Frontend Setup (3 minutes)

```bash
cd frontend
npm install
npm run dev
```

## 3️⃣ Test It

1. Open http://localhost:3000
2. Create a bot
3. Upload a PDF
4. Train the bot
5. Get widget code
6. Done! 🎉

## 🚀 Deploy

**Backend:** Railway (see DEPLOYMENT.md)
**Frontend:** Vercel (see DEPLOYMENT.md)

Total time: 30 minutes to production
