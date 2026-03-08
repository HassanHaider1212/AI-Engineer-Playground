from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class Student(BaseModel):
    name: str
    age: Optional[int] = None
    email: EmailStr
    cgpa: float = Field (gt=0, lt=4, description="The CGPA of the student")

student = {
    "name": "John",
    "age": 20,
    "email": "john@example.com", # pydantic built in email validator
    "cgpa": 3.5 # pydantic built in field validator
}

new_student = Student(**student) # we can convert this pydantic object into a dictionary and json using the .model_dump() method
print(new_student)
