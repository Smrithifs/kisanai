
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoiceAssistant from '@/components/VoiceAssistant';
import TextQuestion from '@/components/TextQuestion';
import CropDetection from '@/components/CropDetection';
import WeatherInfo from '@/components/WeatherInfo';

const Index = () => {
  const [activeTab, setActiveTab] = useState("voice");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-kisan-gray">
      <header className="bg-kisan-primary text-white py-4 px-4 sm:px-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 mr-3" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                <path d="M21 12a9 9 0 0 0-9-9v9h9z" />
                <circle cx="12" cy="12" r="4" />
              </svg>
              <h1 className="text-2xl sm:text-3xl font-bold">Kisan AI</h1>
            </div>
            <p className="hidden sm:block text-kisan-light opacity-90">Your Digital Farming Assistant</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs 
            defaultValue="voice" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-6">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-2xl">
                <TabsTrigger value="voice" className="py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" x2="12" y1="19" y2="22"></line>
                  </svg>
                  Voice
                </TabsTrigger>
                <TabsTrigger value="text" className="py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Ask AI
                </TabsTrigger>
                <TabsTrigger value="crop" className="py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19c-1.9 0-3.47-1.5-5-2.96V15a7 7 0 0 1 10 0v1.04C15.47 17.5 13.9 19 12 19Z"></path>
                    <path d="M12 19c1.32 0 2.5-5.37 2.5-12S13.32 7 12 7 9.5 0.37 9.5 7s1.18 12 2.5 12Z"></path>
                    <path d="M12 19c-1.9 0-3.47-1.5-5-2.96V15a7 7 0 0 1 10 0v1.04C15.47 17.5 13.9 19 12 19Z"></path>
                  </svg>
                  Crop
                </TabsTrigger>
                <TabsTrigger value="weather" className="py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                  </svg>
                  Weather
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="voice" className="mt-2">
              <VoiceAssistant />
            </TabsContent>
            
            <TabsContent value="text" className="mt-2">
              <TextQuestion />
            </TabsContent>
            
            <TabsContent value="crop" className="mt-2">
              <CropDetection />
            </TabsContent>
            
            <TabsContent value="weather" className="mt-2">
              <WeatherInfo />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-kisan-dark text-white py-4 px-4 sm:px-6 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-sm">Kisan AI - Digital buddy for farmers © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
