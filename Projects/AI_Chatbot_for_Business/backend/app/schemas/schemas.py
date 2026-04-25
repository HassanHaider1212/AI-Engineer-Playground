from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class ChatRequest(BaseModel):
    message: str
    bot_id: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    sources: Optional[List[str]] = None

class BotCreate(BaseModel):
    name: str
    description: Optional[str] = None

class BotResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    created_at: datetime
    is_trained: bool
    
    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: int
    bot_id: str
    filename: str
    file_type: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True

class LeadCreate(BaseModel):
    bot_id: str
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    message: Optional[str] = None

class LeadResponse(BaseModel):
    id: int
    bot_id: str
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    message: Optional[str]
    captured_at: datetime
    
    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    timestamp: datetime
    
    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    role: str
    content: str

class ConversationCreate(BaseModel):
    bot_id: str
    messages: List[MessageCreate]

class ConversationResponse(BaseModel):
    id: int
    bot_id: str
    session_id: Optional[str] = None
    created_at: datetime
    messages: List[MessageResponse]
    
    class Config:
        from_attributes = True
