# 🤖 AI Chatbot for Business - Production SaaS

> **AI chatbot that answers customer queries and captures leads automatically**

A complete, production-ready AI chatbot SaaS built with FastAPI, React, LangChain, and RAG (Retrieval-Augmented Generation). This is not just a demo - it's a sellable product designed for real businesses.

## 🎯 What Makes This Special

This chatbot doesn't just use ChatGPT - it uses **RAG (Retrieval-Augmented Generation)** to answer questions based on YOUR business data:
- Upload PDFs (pricing sheets, FAQs, product docs)
- Add website URLs
- Train the bot on your specific knowledge base
- Get accurate, context-aware responses

## ✨ Core Features (MVP)

### 1. **Chat with Business Data (RAG)**
- Customer asks: "What are your prices?"
- AI answers based on uploaded documents
- Uses Chroma vector database for semantic search
- Powered by OpenAI GPT-3.5-turbo

### 2. **Knowledge Upload**
- Upload PDF documents
- Paste website URLs (auto-extracts content)
- Automatic text chunking and embedding
- Train bot with one click

### 3. **Embeddable Chat Widget**
- Beautiful, modern chat interface
- Floating button like Intercom
- One-line integration: `<script src="..."></script>`
- Mobile responsive
- Customizable branding

### 4. **Automatic Lead Capture**
- AI detects purchase intent
- Asks for name, email, phone
- Stores leads in database
- View all leads in dashboard

### 5. **Chat History**
- Save all conversations
- View message history
- Track customer interactions
- Session management

## 🏗️ Architecture

```
User → FastAPI → LangChain → Chroma Vector DB → OpenAI → Response
         ↓
    PostgreSQL (users, chats, leads)
```

### Tech Stack

**Backend:**
- FastAPI (API layer)
- LangChain (RAG + chains)
- OpenAI API (GPT-3.5-turbo)
- Chroma (vector database)
- PostgreSQL (relational data)
- SQLAlchemy (ORM)

**Frontend:**
- React 18
- Vite (build tool)
- TailwindCSS (styling)
- Lucide Icons
- React Router
- Axios

**Deployment:**
- Backend: Railway / Render
- Frontend: Vercel
- Database: PostgreSQL (managed)

## 🚀 Quick Start

### Prerequisites
- **Python 3.9 or 3.11** (Python 3.13 has compatibility issues with this stack)
- Node.js 18+
- PostgreSQL (or use SQLite for development)
- OpenAI API Key

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment with Python 3.9:**
```bash
py -3.9 -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On Linux/Mac
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add:
```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./chatbot.db  # Use SQLite for development
# DATABASE_URL=postgresql://user:password@localhost:5432/chatbot_db  # Use PostgreSQL for production
SECRET_KEY=your_secret_key_here_generate_with_openssl_rand_hex_32
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

5. **Run the server:**
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Note:** SQLite is used by default for development. For production, switch to PostgreSQL by changing `DATABASE_URL` in `.env`.

API will be available at: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

4. **Run development server:**
```bash
npm run dev
```

Dashboard will be available at: `http://localhost:3000`

## 📖 How to Use

### 1. Create a Bot
- Go to dashboard
- Click "Create Bot"
- Enter name and description

### 2. Upload Knowledge
- Open bot details
- Upload PDF files or add website URLs
- Click "Train Bot"
- Wait for training to complete

### 3. Embed Widget
- Copy the widget code
- Paste before `</body>` tag in your website:

```html
<script>
  window.chatbotConfig = {
    botId: 'your-bot-id',
    apiUrl: 'http://localhost:8000/api'
  };
</script>
<script src="http://localhost:3000/widget.js"></script>
```

### 4. View Leads & Conversations
- Check "Leads" page for captured customer info
- View "Conversations" for chat history

## 🎨 Widget Customization

The chat widget is fully customizable. Edit `frontend/public/widget.js` to change:
- Colors and branding
- Button position
- Header text
- Avatar styles

## 📊 API Endpoints

### Bots
- `POST /api/bots` - Create bot
- `GET /api/bots` - List all bots
- `GET /api/bots/{bot_id}` - Get bot details
- `DELETE /api/bots/{bot_id}` - Delete bot

### Documents
- `POST /api/bots/{bot_id}/upload` - Upload PDF/TXT
- `POST /api/bots/{bot_id}/upload-url` - Add website URL
- `POST /api/bots/{bot_id}/train` - Train bot
- `GET /api/bots/{bot_id}/documents` - List documents

### Chat
- `POST /api/chat` - Send message

### Leads
- `POST /api/leads` - Create lead
- `GET /api/leads` - Get all leads
- `GET /api/leads/{bot_id}` - Get bot leads

### Conversations
- `GET /api/conversations` - Get all conversations
- `GET /api/conversations/{bot_id}` - Get bot conversations

## 🎯 Target Market

### Perfect For:
- **Clinics & Healthcare** - Answer patient questions, book appointments
- **Real Estate** - Property info, schedule viewings
- **eCommerce** - Product questions, order status
- **Consultants** - Service info, lead capture
- **SaaS Companies** - Product support, demos

### Value Proposition:
"Reduce support workload by 70% and increase lead capture by 3x with AI that knows your business"

## 💰 Monetization Strategy

### Pricing Tiers:
- **Starter**: $29/mo - 1 bot, 1000 messages
- **Business**: $99/mo - 5 bots, 10,000 messages
- **Enterprise**: $299/mo - Unlimited bots, 100,000 messages

### Revenue Streams:
1. Monthly subscriptions
2. Pay-per-message overage
3. White-label solutions
4. Custom integrations

## 🚢 Deployment

### Backend (Railway)
1. Create Railway account
2. Connect GitHub repo
3. Add environment variables
4. Deploy automatically

### Frontend (Vercel)
1. Create Vercel account
2. Import GitHub repo
3. Set build command: `npm run build`
4. Deploy

### Database
- Use Railway PostgreSQL
- Or Supabase
- Or AWS RDS

## 🔒 Security

- API key authentication (add JWT for production)
- CORS configuration
- SQL injection prevention (SQLAlchemy ORM)
- Input validation (Pydantic)
- Rate limiting (add in production)

## 📈 Scaling Considerations

### Current (MVP):
- Chroma (local vector DB)
- Single server
- PostgreSQL

### Scale to 1000+ users:
- Switch to Pinecone (managed vector DB)
- Add Redis for caching
- Load balancer
- CDN for widget
- Horizontal scaling

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure OpenAI API key is valid

### Frontend can't connect
- Check backend is running on port 8000
- Verify CORS_ORIGINS includes frontend URL
- Check browser console for errors

### Bot not responding
- Ensure bot is trained
- Check documents were uploaded successfully
- Verify OpenAI API key has credits

### Widget not loading
- Check widget.js is accessible
- Verify botId is correct
- Check browser console for errors

## 📝 Development Roadmap

### Phase 1 (MVP - Current)
- ✅ RAG implementation
- ✅ Document upload
- ✅ Chat widget
- ✅ Lead capture
- ✅ Admin dashboard

### Phase 2 (Next 4 weeks)
- [ ] User authentication
- [ ] Multi-tenancy
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Analytics dashboard

### Phase 3 (2-3 months)
- [ ] WhatsApp integration
- [ ] Slack integration
- [ ] Custom branding
- [ ] A/B testing
- [ ] Advanced analytics

### Phase 4 (3-6 months)
- [ ] Voice chat support
- [ ] Multi-language
- [ ] AI training interface
- [ ] Zapier integration
- [ ] Mobile apps

## 🤝 Contributing

This is a production SaaS project. For contributions:
1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For issues or questions:
- Check documentation
- Review API docs at `/docs`
- Open GitHub issue

## 🎓 Learning Resources

- [LangChain Documentation](https://python.langchain.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [RAG Explained](https://www.pinecone.io/learn/retrieval-augmented-generation/)

---

## 🎯 Remember: This is NOT a demo

This is a **production-ready SaaS** designed to:
- Reduce customer support workload
- Increase lead capture rates
- Provide 24/7 automated assistance
- Scale with your business

**Your goal:** Show clients this will reduce their workload & increase sales.

Built with ❤️ using FastAPI, React, LangChain, and OpenAI
