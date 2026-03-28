from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

prompt1 = PromptTemplate(
    template = "Generate a detail report on {topic}",
    input_variables = ["topic"]
)

prompt2 = PromptTemplate(
    template = "Write a short 5 line summary of the following report: {report}",
    input_variables = ["report"]
)

model= ChatOpenAI()

parser = StrOutputParser()

chain = prompt1 | model | parser| prompt2 | model | parser

result = chain.invoke({"topic": "AI"})

print(result)

print(chain.get_graph().print_ascii())
