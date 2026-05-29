from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import LeadCreate, LeadResponse
from app.models.models import Lead, Bot
from typing import List

router = APIRouter()

@router.post("/leads", response_model=LeadResponse)
async def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    bot = db.query(Bot).filter(Bot.id == lead.bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    new_lead = Lead(
        bot_id=lead.bot_id,
        name=lead.name,
        email=lead.email,
        phone=lead.phone,
        message=lead.message
    )
    
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    
    return new_lead

@router.get("/leads/{bot_id}", response_model=List[LeadResponse])
async def get_leads(bot_id: str, db: Session = Depends(get_db)):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    leads = db.query(Lead).filter(Lead.bot_id == bot_id).order_by(Lead.captured_at.desc()).all()
    return leads

@router.get("/leads", response_model=List[LeadResponse])
async def get_all_leads(db: Session = Depends(get_db)):
    leads = db.query(Lead).order_by(Lead.captured_at.desc()).all()
    return leads
