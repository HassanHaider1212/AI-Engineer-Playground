from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import BotCreate, BotResponse, DocumentResponse
from app.models.models import Bot, Document
from app.services.rag_service import rag_service
from app.services.document_service import document_service
from app.core.config import settings
from typing import List
import uuid
import os

router = APIRouter()

@router.post("/bots", response_model=BotResponse)
async def create_bot(bot: BotCreate, db: Session = Depends(get_db)):
    bot_id = str(uuid.uuid4())
    
    new_bot = Bot(
        id=bot_id,
        name=bot.name,
        description=bot.description
    )
    
    db.add(new_bot)
    db.commit()
    db.refresh(new_bot)
    
    return new_bot

@router.get("/bots", response_model=List[BotResponse])
async def get_bots(db: Session = Depends(get_db)):
    bots = db.query(Bot).all()
    return bots

@router.get("/bots/{bot_id}", response_model=BotResponse)
async def get_bot(bot_id: str, db: Session = Depends(get_db)):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    return bot

@router.delete("/bots/{bot_id}")
async def delete_bot(bot_id: str, db: Session = Depends(get_db)):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    rag_service.delete_vector_store(bot_id)
    
    db.delete(bot)
    db.commit()
    
    return {"message": "Bot deleted successfully"}

@router.post("/bots/{bot_id}/upload", response_model=DocumentResponse)
async def upload_document(
    bot_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    if file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large")
    
    allowed_types = ["application/pdf", "text/plain"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="File type not supported. Only PDF and TXT files are allowed.")
    
    upload_dir = os.path.join(settings.UPLOAD_DIR, bot_id)
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = await document_service.save_upload_file(file, upload_dir, filename)
    
    if file.content_type == "application/pdf":
        content = await document_service.extract_text_from_pdf(file_path)
        file_type = "pdf"
    else:
        content = await document_service.extract_text_from_txt(file_path)
        file_type = "txt"
    
    document = Document(
        bot_id=bot_id,
        filename=file.filename,
        file_type=file_type,
        file_path=file_path,
        content=content
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    bot.is_trained = False
    db.commit()
    
    return document

@router.post("/bots/{bot_id}/upload-url")
async def upload_url(
    bot_id: str,
    url: str = Form(...),
    db: Session = Depends(get_db)
):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    try:
        content = document_service.extract_text_from_url(url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    document = Document(
        bot_id=bot_id,
        filename=url,
        file_type="url",
        file_path=url,
        content=content
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    bot.is_trained = False
    db.commit()
    
    return document

@router.post("/bots/{bot_id}/train")
async def train_bot(bot_id: str, db: Session = Depends(get_db)):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    documents = db.query(Document).filter(Document.bot_id == bot_id).all()
    
    if not documents:
        raise HTTPException(status_code=400, detail="No documents found. Please upload documents first.")
    
    document_texts = [doc.content for doc in documents]
    
    try:
        rag_service.create_vector_store(bot_id, document_texts)
        
        bot.is_trained = True
        db.commit()
        
        return {"message": "Bot trained successfully", "document_count": len(documents)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@router.get("/bots/{bot_id}/documents", response_model=List[DocumentResponse])
async def get_documents(bot_id: str, db: Session = Depends(get_db)):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    documents = db.query(Document).filter(Document.bot_id == bot_id).all()
    return documents
