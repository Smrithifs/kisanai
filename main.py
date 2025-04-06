import asyncio
import os
import speech_recognition as sr
import uvicorn
import requests
import google.generativeai as genai
from deep_translator import GoogleTranslator
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from io import BytesIO
from PIL import Image
from gtts import gTTS
import playsound
import re

# Load environment variables
load_dotenv()

# Configure Google Gemini AI API
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("❌ Gemini API key not found! Set the GEMINI_API_KEY in .env")

genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel("gemini-1.5-pro")
vision_model = genai.GenerativeModel("gemini-1.5-flash")  # 🆕 Vision Model for Images

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supported languages for TTS
SUPPORTED_LANGUAGES = {
    "en": "en",
    "hi": "hi",
    "ta": "ta",
    "kn": "kn",
    "te": "te",
    "mr": "mr"
}

# 🎤 Speech Recognition
def recognize_speech(language="kn-IN"):
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("🎤 Listening...")
        recognizer.adjust_for_ambient_noise(source)
        try:
            audio = recognizer.listen(source, timeout=60, phrase_time_limit=45)
            text = recognizer.recognize_google(audio, language=language)
            print(f"✅ Recognized ({language}): {text}")
            return text
        except sr.UnknownValueError:
            print("❌ Couldn't understand speech")
            return None
        except sr.RequestError as e:
            print(f"❌ Speech recognition service error: {e}")
            return None

# 📝 Clean Response
def clean_response(text):
    text = re.sub(r'[*]', '', text)
    text = re.sub(r'\s*,\s*', ', ', text)
    return text.strip()

# 🤖 AI Response
def generate_gemini_response(prompt):
    try:
        response = model.generate_content(prompt)
        return clean_response(response.text)
    except Exception as e:
        return f"❌ AI Error: {e}"

# 🌍 Translation
def translate_text(text, target_lang):
    if not text:
        return ""
    try:
        translated = GoogleTranslator(source="auto", target=target_lang).translate(text)
        return translated
    except Exception as e:
        print(f"❌ Translation Error: {e}")
        return text

# 🗣 TTS (gTTS)
def speak_response(response, language="kn"):
    if not response:
        return
    if "stop" in response.lower():
        print("🛑 Stopped Talking!")
        return
    print(f"🗣 Speaking in {language}: {response}")
    try:
        tts = gTTS(text=response, lang=language, slow=False)
        tts.save("response.mp3")
        playsound.playsound("response.mp3")
    except Exception as e:
        print(f"❌ TTS Error: {e}")

# 🎤 Voice Assistant
async def real_time_assistant(language="kn"):
    while True:
        user_input = recognize_speech(language)
        if user_input:
            translated_text = translate_text(user_input, "en")
            ai_response = generate_gemini_response(translated_text)
            translated_response = translate_text(ai_response, language)
            speak_response(translated_response, language)
            if "stop" in translated_response.lower():
                break

# 🌿 Crop Detection (Updated with Gemini 1.5 Flash)
def detect_crop(image_bytes):
    try:
        response = vision_model.generate_content(
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {"text": "Analyze this crop image and tell if there is any disease or problem. If healthy, just say healthy."},
                        {"inline_data": {
                            "mime_type": "image/jpeg",
                            "data": image_bytes
                        }}
                    ]
                }
            ]
        )
        return clean_response(response.candidates[0].content.parts[0].text)
    except Exception as e:
        return f"❌ Crop detection error: {e}"

# 🌱 API Endpoints
@app.get("/")
async def home():
    return {"message": "🌱 Welcome to the Farmer AI App!"}

@app.post("/ask")
async def ask_question(question: str = Form(...), language: str = Form("kn")):
    translated_question = translate_text(question, "en")
    ai_response = generate_gemini_response(translated_question)
    translated_response = translate_text(ai_response, language)
    return {"response": translated_response}

@app.get("/start_voice_assistant/{language}")
async def start_voice_assistant(language: str):
    if language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail="❌ Language not supported")
    asyncio.create_task(real_time_assistant(language))
    return {"status": f"🎤 Voice assistant started in {language}"}

@app.post("/detect_crop")
async def detect_crop_api(file: UploadFile = File(...)):
    image_data = await file.read()
    result = detect_crop(image_data)
    return {"crop": result}

@app.get("/weather/{city_name}")
async def get_weather(city_name: str, language: str = "kn"):
    openweather_api_key = os.getenv("OPENWEATHER_API_KEY")
    if not openweather_api_key:
        raise HTTPException(status_code=500, detail="❌ OpenWeather API key missing!")
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={openweather_api_key}&units=metric"
        response = requests.get(url)
        response.raise_for_status()
        weather_data = response.json()
        description = translate_text(weather_data["weather"][0]["description"], language)
        weather_data["weather"][0]["description"] = description
        return weather_data
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"❌ Weather API Error: {str(e)}")
