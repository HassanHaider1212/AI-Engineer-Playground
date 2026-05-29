# 🚀 Deployment Guide

Complete guide to deploy your AI Chatbot SaaS to production.

## 📋 Pre-Deployment Checklist

- [ ] OpenAI API key with credits
- [ ] PostgreSQL database (Railway/Supabase/AWS RDS)
- [ ] Domain name (optional but recommended)
- [ ] Railway/Render account (backend)
- [ ] Vercel account (frontend)
- [ ] Environment variables documented

## 🎯 Deployment Options

### Option 1: Railway (Recommended for MVP)
**Pros:** Easy, one-click deploy, includes PostgreSQL
**Cost:** ~$20/month

### Option 2: Render
**Pros:** Free tier available, good for testing
**Cost:** Free tier, then $7/month

### Option 3: AWS/DigitalOcean
**Pros:** Full control, scalable
**Cost:** ~$30-50/month

## 🚂 Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project

### Step 2: Add PostgreSQL
1. Click "New" → "Database" → "PostgreSQL"
2. Railway will provision database
3. Copy `DATABASE_URL` from variables tab

### Step 3: Deploy Backend
1. Click "New" → "GitHub Repo"
2. Select your repository
3. Choose `backend` folder as root
4. Add environment variables:

```env
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...  (from step 2)
SECRET_KEY=generate-with-openssl-rand-hex-32
CORS_ORIGINS=https://your-frontend-domain.vercel.app
ENVIRONMENT=production
```

### Step 4: Configure Build
Railway auto-detects Python. If needed, add `railway.toml`:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

### Step 5: Deploy
- Railway will automatically deploy
- Get your backend URL: `https://your-app.railway.app`
- Test: `https://your-app.railway.app/health`

## ☁️ Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New" → "Project"

### Step 2: Import Repository
1. Select your GitHub repository
2. Choose `frontend` as root directory
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`

### Step 3: Environment Variables
Add in Vercel dashboard:

```env
VITE_API_URL=https://your-backend.railway.app/api
```

### Step 4: Deploy
- Click "Deploy"
- Vercel will build and deploy
- Get your URL: `https://your-app.vercel.app`

### Step 5: Update Backend CORS
Go back to Railway and update `CORS_ORIGINS`:
```env
CORS_ORIGINS=https://your-app.vercel.app
```

## 🐳 Docker Deployment (Alternative)

### Using Docker Compose (Local/VPS)

1. **Set environment variables:**
```bash
export OPENAI_API_KEY=sk-...
export SECRET_KEY=your-secret-key
```

2. **Start services:**
```bash
docker-compose up -d
```

3. **Check status:**
```bash
docker-compose ps
docker-compose logs -f backend
```

4. **Stop services:**
```bash
docker-compose down
```

### Deploy to DigitalOcean/AWS

1. **Create droplet/EC2 instance**
2. **Install Docker & Docker Compose**
3. **Clone repository**
4. **Set environment variables**
5. **Run docker-compose up -d**
6. **Configure nginx reverse proxy**
7. **Set up SSL with Let's Encrypt**

## 🔒 Production Security

### 1. Environment Variables
Never commit these to Git:
- `OPENAI_API_KEY`
- `SECRET_KEY`
- `DATABASE_URL`

### 2. CORS Configuration
Update `CORS_ORIGINS` to only include your frontend domain:
```env
CORS_ORIGINS=https://yourdomain.com
```

### 3. Rate Limiting
Add rate limiting in production (use FastAPI middleware):
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
```

### 4. HTTPS
- Railway/Vercel provide HTTPS automatically
- For custom domains, use Let's Encrypt

### 5. Database Backups
- Railway: Automatic backups
- Manual: Use `pg_dump` daily

## 📊 Monitoring

### Health Checks
- Backend: `GET /health`
- Database: Check connection in Railway dashboard

### Logging
- Railway: Built-in logs viewer
- Add Sentry for error tracking:
```bash
pip install sentry-sdk
```

### Performance
- Monitor API response times
- Track OpenAI API usage
- Watch database query performance

## 💰 Cost Estimation

### MVP (100 users, 10k messages/month)
- Railway (Backend + DB): $20/month
- Vercel (Frontend): Free
- OpenAI API: ~$30/month
- **Total: ~$50/month**

### Growth (1000 users, 100k messages/month)
- Railway Pro: $50/month
- Vercel Pro: $20/month
- OpenAI API: ~$300/month
- Pinecone (Vector DB): $70/month
- **Total: ~$440/month**

### Scale (10k users, 1M messages/month)
- AWS/DigitalOcean: $200/month
- Pinecone: $200/month
- OpenAI API: ~$3000/month
- CDN: $50/month
- **Total: ~$3450/month**

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Railway CLI deployment
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          # Vercel CLI deployment
```

## 🧪 Testing Production

### 1. Backend Health
```bash
curl https://your-backend.railway.app/health
```

### 2. Create Test Bot
```bash
curl -X POST https://your-backend.railway.app/api/bots \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Bot", "description": "Testing"}'
```

### 3. Test Chat
```bash
curl -X POST https://your-backend.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "bot_id": "your-bot-id"}'
```

### 4. Widget Integration
Add to test HTML file:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Widget</title>
</head>
<body>
  <h1>Test Page</h1>
  
  <script>
    window.chatbotConfig = {
      botId: 'your-bot-id',
      apiUrl: 'https://your-backend.railway.app/api'
    };
  </script>
  <script src="https://your-frontend.vercel.app/widget.js"></script>
</body>
</html>
```

## 🐛 Troubleshooting

### Backend Issues
- Check Railway logs
- Verify environment variables
- Test database connection
- Check OpenAI API credits

### Frontend Issues
- Check Vercel build logs
- Verify API URL is correct
- Check CORS configuration
- Test in incognito mode

### Widget Issues
- Check browser console
- Verify botId is correct
- Test API endpoint directly
- Check CORS headers

## 📈 Scaling Strategy

### Phase 1: MVP (0-100 users)
- Railway + Vercel
- Chroma (local vector DB)
- Single server

### Phase 2: Growth (100-1000 users)
- Add Redis caching
- Switch to Pinecone
- Optimize database queries
- Add CDN for widget

### Phase 3: Scale (1000+ users)
- Kubernetes/ECS
- Load balancer
- Read replicas
- Microservices architecture

## 🎯 Post-Deployment

### 1. Monitor Performance
- Set up uptime monitoring (UptimeRobot)
- Track API response times
- Monitor error rates

### 2. Backup Strategy
- Daily database backups
- Store in S3/Backblaze
- Test restore process monthly

### 3. Update Strategy
- Use staging environment
- Test updates before production
- Have rollback plan

### 4. Documentation
- Keep API docs updated
- Document deployment process
- Create runbooks for common issues

---

## 🚀 Quick Deploy Commands

### Railway (Backend)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

---

**Ready to deploy?** Follow this guide step-by-step and you'll have a production-ready AI chatbot SaaS live in under 30 minutes! 🎉
