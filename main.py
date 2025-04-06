
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
import torch
from torchvision import transforms
from gtts import gTTS  # ✅ Import Google Text-to-Speech
import playsound  # ✅ Import for playing speech
import re

# Load environment variables
load_dotenv()

# Configure Google Gemini AI API
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("❌ Gemini API key not found! Set the GEMINI_API_KEY in .env")

genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel("gemini-1.5-pro")  # ✅ Correct model name

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Pre-trained Crop Detection Model (Using ResNet18)
try:
    crop_model = torch.hub.load("pytorch/vision:v0.10.0", "resnet18", pretrained=True)
    crop_model.eval()
except Exception as e:
    print(f"❌ Error loading crop detection model: {e}")
    crop_model = None

# Supported languages with TTS accents
SUPPORTED_LANGUAGES = {
    "en": "en",
    "hi": "hi",
    "ta": "ta",
    "kn": "kn",
    "te": "te",
    "mr": "mr"
}

# -------------------------
# 🎤 Speech Recognition
# -------------------------
def recognize_speech(language="kn-IN"):  # ✅ Default Kannada (Change as needed)
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("🎤 Listening... (Longer pause enabled)")
        recognizer.adjust_for_ambient_noise(source)
        try:
            audio = recognizer.listen(source, timeout=60, phrase_time_limit=45)  # ✅ Extended timeout
            text = recognizer.recognize_google(audio, language=language)
            print(f"✅ Recognized ({language}): {text}")
            return text
        except sr.UnknownValueError:
            print("❌ Couldn't understand speech")
            return None
        except sr.RequestError as e:
            print(f"❌ Speech recognition service error: {e}")
            return None

# -------------------------
# 📝 Clean Response Text
# -------------------------
def clean_response(text):
    text = re.sub(r'[*]', '', text)  # Remove asterisks
    text = re.sub(r'\s*,\s*', ', ', text)  # Clean up extra spaces
    return text.strip()

# -------------------------
# 🤖 AI Response Generator
# -------------------------
def generate_gemini_response(prompt):
    try:
        response = model.generate_content(prompt)
        return clean_response(response.text)
    except Exception as e:
        return f"❌ AI Error: {e}"

# -------------------------
# 🌍 Language Translation
# -------------------------
def translate_text(text, target_lang):
    if not text:
        return ""
    try:
        translated = GoogleTranslator(source="auto", target=target_lang).translate(text)
        return translated
    except Exception as e:
        print(f"❌ Translation Error: {e}")
        return text

# -------------------------
# 🗣 Google Text-to-Speech (gTTS)
# -------------------------
def speak_response(response, language="kn"):
    if not response:
        return

    if "stop" in response.lower():  # ✅ Stop if user says "stop"
        print("🛑 Stopped Talking!")
        return

    print(f"🗣 Speaking in {language}: {response}")

    try:
        tts = gTTS(text=response, lang=language, slow=False)
        tts.save("response.mp3")
        playsound.playsound("response.mp3")
    except Exception as e:
        print(f"❌ TTS Error: {e}")

# -------------------------
# 🎤 Real-Time Voice Assistant
# -------------------------
async def real_time_assistant(language="kn"):
    while True:
        user_input = recognize_speech(language)
        if user_input:
            translated_text = translate_text(user_input, "en")  # Translate to English
            ai_response = generate_gemini_response(translated_text)
            translated_response = translate_text(ai_response, language)  # ✅ Respond in the same language

            speak_response(translated_response, language)

            if "stop" in translated_response.lower():  # ✅ Stop if user says "stop"
                break

# -------------------------
# 🌿 Crop Detection
# -------------------------
def detect_crop(image):
    if crop_model is None:
        return "❌ Crop detection model not loaded."

    try:
        preprocess = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

        img = Image.open(BytesIO(image))
        img = img.convert('RGB')
        image_tensor = preprocess(img).unsqueeze(0)

        with torch.no_grad():
            output = crop_model(image_tensor)
            _, predicted = torch.max(output.data, 1)

        class_names = ["Crop A", "Crop B", "No Crop"]
        predicted_class = class_names[predicted[0]]

        return f"🌿 Crop detected: {predicted_class}"

    except Exception as e:
        return f"❌ Crop detection error: {e}"

# -------------------------
# 🌱 API Endpoints
# -------------------------

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
        raise HTTPException(status_code=500, detail=f"❌ Weather API Error: {e}")

# -------------------------
# 🚀 Run the App
# -------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
