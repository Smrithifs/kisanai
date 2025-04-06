
import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings, User, Languages, Moon, Sun } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/services/api";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface UserSettingsProps {
  selectedLanguage: string;
  onLanguageChange: (value: string) => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ 
  selectedLanguage, 
  onLanguageChange 
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800 border-l border-green-100">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-center mb-6">Settings</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="flex flex-col items-center justify-center">
            <Avatar className="h-24 w-24 border-2 border-green-500">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-green-600 to-green-400 text-white text-xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <h3 className="mt-4 text-xl font-medium">Farmer</h3>
            <p className="text-sm text-gray-500">Local Farmer</p>
          </div>

          <Separator className="bg-green-100" />
          
          {/* Language Selection */}
          <div>
            <div className="flex items-center mb-4">
              <Languages className="mr-2 h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium">App Language</h3>
            </div>
            
            <RadioGroup 
              value={selectedLanguage} 
              onValueChange={onLanguageChange}
              className="flex flex-col space-y-2"
            >
              {SUPPORTED_LANGUAGES.map((language) => (
                <div key={language.code} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={language.code} 
                    id={`language-${language.code}`}
                    className="border-green-500 text-green-600"
                  />
                  <Label 
                    htmlFor={`language-${language.code}`}
                    className="cursor-pointer"
                  >
                    {language.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <Separator className="bg-green-100" />

          {/* Dark Mode Toggle */}
          <div>
            <div className="flex items-center mb-4">
              {isDarkMode ? 
                <Moon className="mr-2 h-5 w-5 text-green-600" /> : 
                <Sun className="mr-2 h-5 w-5 text-green-600" />
              }
              <h3 className="text-lg font-medium">Theme</h3>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-green-200"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </Button>
          </div>
          
          <Separator className="bg-green-100" />
          
          {/* App Info */}
          <div className="text-center text-sm text-gray-500">
            <p>Kisan AI v1.0.0</p>
            <p className="mt-1">Digital buddy for farmers</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserSettings;
