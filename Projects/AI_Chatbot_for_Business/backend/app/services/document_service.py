from pypdf import PdfReader
from bs4 import BeautifulSoup
import requests
from typing import List
import os
import aiofiles

class DocumentService:
    
    @staticmethod
    async def extract_text_from_pdf(file_path: str) -> str:
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error extracting PDF text: {str(e)}")
    
    @staticmethod
    def extract_text_from_url(url: str) -> str:
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()
            
            text = soup.get_text(separator='\n', strip=True)
            
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            text = '\n'.join(lines)
            
            return text
        except Exception as e:
            raise Exception(f"Error extracting URL content: {str(e)}")
    
    @staticmethod
    async def extract_text_from_txt(file_path: str) -> str:
        try:
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
                text = await f.read()
            return text
        except Exception as e:
            raise Exception(f"Error reading text file: {str(e)}")
    
    @staticmethod
    async def save_upload_file(file, upload_dir: str, filename: str) -> str:
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, filename)
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        return file_path

document_service = DocumentService()
