from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import ConversationResponse, ConversationCreate
from app.models.models import Conversation, Bot, Message
from typing import List
from datetime import datetime

router = APIRouter()

@router.get("/conversations/{bot_id}", response_model=List[ConversationResponse])
async def get_conversations(bot_id: str, db: Session = Depends(get_db)):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    conversations = db.query(Conversation).filter(
        Conversation.bot_id == bot_id
    ).order_by(Conversation.created_at.desc()).all()
    
    return conversations

@router.get("/conversations", response_model=List[ConversationResponse])
async def get_all_conversations(db: Session = Depends(get_db)):
    conversations = db.query(Conversation).order_by(Conversation.created_at.desc()).all()
    return conversations

@router.post("/conversations", response_model=ConversationResponse)
async def create_or_update_conversation(conversation: ConversationCreate, db: Session = Depends(get_db)):
    # Check if there's an existing conversation for this bot
    existing_conversation = db.query(Conversation).filter(
        Conversation.bot_id == conversation.bot_id
    ).order_by(Conversation.created_at.desc()).first()
    
    if existing_conversation:
        # Update existing conversation
        # Delete old messages
        db.query(Message).filter(Message.conversation_id == existing_conversation.id).delete()
        
        # Add new messages
        for msg_data in conversation.messages:
            message = Message(
                conversation_id=existing_conversation.id,
                role=msg_data.role,
                content=msg_data.content
            )
            db.add(message)
        
        existing_conversation.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_conversation)
        return existing_conversation
    else:
        # Create new conversation
        new_conversation = Conversation(
            bot_id=conversation.bot_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(new_conversation)
        db.commit()
        db.refresh(new_conversation)
        
        # Add messages
        for msg_data in conversation.messages:
            message = Message(
                conversation_id=new_conversation.id,
                role=msg_data.role,
                content=msg_data.content
            )
            db.add(message)
        
        db.commit()
        db.refresh(new_conversation)
        return new_conversation
