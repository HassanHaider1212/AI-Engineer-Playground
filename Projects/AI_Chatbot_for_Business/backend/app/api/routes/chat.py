from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import ChatRequest, ChatResponse
from app.models.models import Bot, Conversation, Message
from app.services.rag_service import rag_service
import uuid

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    bot = db.query(Bot).filter(Bot.id == request.bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    if not bot.is_trained:
        raise HTTPException(status_code=400, detail="Bot is not trained yet. Please upload documents and train the bot first.")
    
    session_id = request.session_id or str(uuid.uuid4())
    
    conversation = db.query(Conversation).filter(
        Conversation.bot_id == request.bot_id,
        Conversation.session_id == session_id
    ).first()
    
    if not conversation:
        conversation = Conversation(
            bot_id=request.bot_id,
            session_id=session_id
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    messages = db.query(Message).filter(
        Message.conversation_id == conversation.id
    ).order_by(Message.timestamp).all()
    
    chat_history = []
    for i in range(0, len(messages), 2):
        if i + 1 < len(messages):
            chat_history.append((messages[i].content, messages[i+1].content))
    
    result = rag_service.get_response(
        bot_id=request.bot_id,
        question=request.message,
        chat_history=chat_history
    )
    
    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=request.message
    )
    db.add(user_message)
    
    bot_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=result["answer"]
    )
    db.add(bot_message)
    
    db.commit()
    
    return ChatResponse(
        response=result["answer"],
        session_id=session_id,
        sources=result.get("sources")
    )
