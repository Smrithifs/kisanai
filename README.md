
# Kisan AI

A digital buddy for farmers that provides voice assistance, question answering, crop detection, and weather information in multiple Indian languages.

## Features

- Voice Assistant: Ask questions and get spoken responses in your language
- Text Questions: Type questions and get answers in your preferred language
- Crop Detection: Upload plant images to identify crops
- Weather Information: Get weather data for any location in your language

## Supported Languages

- English
- Hindi
- Tamil
- Kannada
- Telugu
- Marathi

## Setup Instructions

### Backend Setup

1. Install Python requirements:
   ```
   pip install -r requirements.txt
   ```

2. Set up environment variables in a `.env` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

3. Run the backend server:
   ```
   python main.py
   ```
   The server will run at http://127.0.0.1:8000

### Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Run the frontend development server:
   ```
   npm run dev
   ```

3. Open the app in your browser at the URL shown in the terminal

## API Endpoints

- `/ask` - Ask questions via text
- `/start_voice_assistant/{language}` - Start voice assistant in a specific language
- `/detect_crop` - Detect crop from uploaded image
- `/weather/{city_name}` - Get weather information for a city

## Technologies Used

- **Backend**: FastAPI, Python, SpeechRecognition, Google Gemini AI
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **AI/ML**: Google Gemini, ResNet18, Google Translator

