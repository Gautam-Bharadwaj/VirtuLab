import os
import sys
from dotenv import load_dotenv
from google import genai
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

load_dotenv("virtu-lab-backend/.env")
print("GEMINI_API_KEY:", repr(os.getenv("GEMINI_API_KEY")[:5] + "..."))

try:
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.7,
    )
    result = llm.invoke([HumanMessage(content="Say hi")])
    print("Result:", result.content)
except Exception as e:
    print("Error:", e)
