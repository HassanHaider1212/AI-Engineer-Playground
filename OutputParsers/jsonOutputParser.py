from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()

llm = HuggingFaceEndpoint(
    repo_id="deepseek-ai/DeepSeek-V3.2",
    task="text-generation"
)

model = ChatHuggingFace(llm=llm)

parser = JsonOutputParser()

template = PromptTemplate(
    template = 'Give me the name, age and city of a fictional person \n {format_instructions}',
    input_variables=[],
    partial_variables={"format_instructions": parser.get_format_instructions()}
)

prompt = template.format()
print(prompt)
print("--------------------------------")
result = model.invoke(prompt)
print(result)
print("--------------------------------")
parsed_result = parser.parse(result.content)
print(parsed_result)
print(type(parsed_result))
print("---------------CHAINING-----------------")

# Now, we will use chain
chain = template | model | parser
result = chain.invoke({})
print(result)
print(type(result))
print("--------------------------------")

# Problem: Con on json output parser is that we cannot enforce schema. Only give json output itself