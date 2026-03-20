from tempfile import template
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

load_dotenv()

model = ChatOpenAI()
# Define the model
# llm = HuggingFaceEndpoint(
#     repo_id="deepseek-ai/DeepSeek-V3.2",
#     task="text-generation"
# )

# model = ChatHuggingFace(llm=llm)
# OR
# llm = HuggingFaceEndpoint(
#     repo_id="deepseek-ai/DeepSeek-V3.2",
#     task="text-generation",
#     do_sample=False,
#     temperature=0.0,
# )
# model = llm

class Person(BaseModel):
    name: str = Field(description='Name of the person')
    age: int = Field(gt = 18 ,description='Age of the Person')
    city: str = Field(description='Name of the city, the person belongs to.')

parser = PydanticOutputParser(pydantic_object=Person)

template = PromptTemplate(
    template = 'Generate the name, age, city of a fictional {place} person \n {format_instructions}',
    input_variables=['place'],
    partial_variables={'format_instructions': parser.get_format_instructions()}
)

# prompt = template.invoke({'place':'pakistani'})
# print(prompt)

# result = model.invoke(prompt)
# parsedResult = parser.parse(result.content)
# print(parsedResult)

#CHAINING
chain = template | model | parser
result = chain.invoke({'place':'pakistani'})
print(result)

#NOTE: Pydantic Output Parser can enforce structured json + validation