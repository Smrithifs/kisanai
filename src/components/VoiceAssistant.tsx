
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSelector from './LanguageSelector';
import { ApiService, getLanguageName } from '@/services/api';
import { useToast } from "@/hooks/use-toast";

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('kn');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleListening = async () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      setIsLoading(true);
      await ApiService.startVoiceAssistant(language);
      setIsListening(true);
      
      toast({
        title: "Voice Assistant Started",
        description: `Now listening in ${getLanguageName(language)}. Say "stop" to end the session.`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error starting voice assistant:", error);
      toast({
        title: "Error",
        description: "Failed to start voice assistant. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-kisan-primary text-white rounded-t-lg">
        <CardTitle className="text-2xl">Voice Assistant</CardTitle>
        <CardDescription className="text-kisan-light opacity-90">
          Ask questions in your language and get spoken responses
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 pb-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select Language
            </label>
            <LanguageSelector
              value={language}
              onChange={setLanguage}
            />
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            {isListening ? (
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-kisan-primary opacity-20 animate-pulse"></div>
                <Mic size={64} className="text-kisan-primary animate-pulse-slow" />
              </div>
            ) : (
              <MicOff size={64} className="text-gray-400" />
            )}
            
            <p className="mt-4 text-lg font-medium text-center">
              {isListening 
                ? `Listening in ${getLanguageName(language)}...` 
                : "Click to start listening"}
            </p>
            <p className="text-sm text-gray-500 text-center mt-2">
              {isListening && "Say 'stop' to end the session"}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center pt-2 pb-6">
        <Button 
          className={`px-8 py-6 text-lg rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-kisan-primary hover:bg-kisan-dark'}`}
          onClick={toggleListening}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
              Loading...
            </div>
          ) : isListening ? (
            "Stop Listening"
          ) : (
            "Start Listening"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VoiceAssistant;
