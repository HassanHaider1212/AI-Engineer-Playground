from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser, StrOutputParser
from pydantic import BaseModel, Field
from typing import Literal
from langchain_core.runnables import RunnableBranch, RunnableLambda

load_dotenv()
model = ChatOpenAI()

class Feeback(BaseModel):
    sentiment: Literal["positive", "negative"] = Field(description="Sentiment of the feedback")

pydanticParser = PydanticOutputParser(pydantic_object = Feeback)
parser = StrOutputParser()

prompt1 = PromptTemplate(
    template = 'Classify the sentiment of the following feedback into positive or negative \n {feedback} \n {format_instructions}',
    input_variables = ["feedback"],
    partial_variables={"format_instructions": pydanticParser.get_format_instructions()}
)

classifierChain = prompt1 | model | pydanticParser
result = classifierChain.invoke({"feedback": "The is a terrible smartphone."})
print(result)

prompt2 = PromptTemplate(
    template = 'Write an appropriate response for the following positive feedback: {feedback}',
    input_variables = ["feedback"]
)

prompt3 = PromptTemplate(
    template = 'Write an appropriate response for the following negative feedback: {feedback}',
    input_variables = ["feedback"]
)

branchChain = RunnableBranch(
    (lambda x: x.sentiment == "positive", prompt2 | model | parser),
    (lambda x: x.sentiment == "negative", prompt3 | model | parser),
    RunnableLambda(lambda x: "could not classify the feedback")
)

chain = classifierChain | branchChain

result = chain.invoke({"feedback": "This is a terrible smartphone."})
print(result)

print(chain.get_graph().print_ascii())
