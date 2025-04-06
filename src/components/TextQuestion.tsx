
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import LanguageSelector from './LanguageSelector';
import { ApiService } from '@/services/api';
import { useToast } from "@/hooks/use-toast";

const TextQuestion: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('kn');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast({
        title: "Empty Question",
        description: "Please enter a question",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await ApiService.askQuestion(question, language);
      setResponse(data.response);
    } catch (error) {
      console.error("Error asking question:", error);
      toast({
        title: "Error",
        description: "Failed to get answer. Please try again.",
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
        <CardTitle className="text-2xl">Ask Questions</CardTitle>
        <CardDescription className="text-kisan-light opacity-90">
          Type your questions and get answers in your language
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select Language
            </label>
            <LanguageSelector
              value={language}
              onChange={setLanguage}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Your Question
            </label>
            <Textarea
              placeholder="Type your farming question here..."
              className="min-h-[100px] resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          
          <div className="flex justify-center">
            <Button 
              type="submit" 
              className="px-8 py-6 text-lg w-full md:w-auto"
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Getting Answer...
                </div>
              ) : (
                "Get Answer"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      
      {response && (
        <CardFooter className="flex-col items-start pt-2 pb-6">
          <div className="mt-4 w-full">
            <h3 className="font-medium text-lg mb-2">Answer:</h3>
            <div className="p-4 bg-kisan-gray rounded-lg whitespace-pre-wrap">
              {response}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TextQuestion;
