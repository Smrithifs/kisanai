
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LanguageSelector from './LanguageSelector';
import { ApiService, getLanguageName } from '@/services/api';
import { useToast } from "@/hooks/use-toast";
import { CloudRain, Wind, Thermometer, Droplets } from "lucide-react";

interface WeatherInfoProps {
  defaultLanguage?: string;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ defaultLanguage = 'kn' }) => {
  const [city, setCity] = useState('');
  const [language, setLanguage] = useState(defaultLanguage);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Update language when defaultLanguage prop changes
  useEffect(() => {
    setLanguage(defaultLanguage);
  }, [defaultLanguage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!city.trim()) {
      toast({
        title: "Empty City Name",
        description: "Please enter a city name",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await ApiService.getWeather(city, language);
      setWeatherData(data);
    } catch (error) {
      console.error("Error getting weather:", error);
      toast({
        title: "Error",
        description: "Failed to get weather data. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl">Weather Information</CardTitle>
        <CardDescription className="text-white opacity-90">
          Get current weather for any location in your language
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
              City Name
            </label>
            <Input
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          
          <div className="flex justify-center">
            <Button 
              type="submit" 
              className="px-8 py-6 text-lg w-full md:w-auto"
              disabled={isLoading || !city.trim()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Getting Weather...
                </div>
              ) : (
                "Get Weather"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      
      {weatherData && (
        <CardFooter className="flex-col items-start pt-2 pb-6">
          <div className="mt-4 w-full">
            <div className="bg-green-50 rounded-lg p-6 border border-green-100">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="mr-4">
                    <img 
                      src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
                      alt={weatherData.weather[0].description}
                      className="w-16 h-16"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{weatherData.name}</h3>
                    <p className="text-gray-600 capitalize">{weatherData.weather[0].description}</p>
                  </div>
                </div>
                <div className="text-3xl font-bold">
                  {Math.round(weatherData.main.temp)}°C
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <Thermometer className="w-6 h-6 text-orange-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Feels Like</p>
                    <p className="font-medium">{Math.round(weatherData.main.feels_like)}°C</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <Droplets className="w-6 h-6 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Humidity</p>
                    <p className="font-medium">{weatherData.main.humidity}%</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <Wind className="w-6 h-6 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Wind Speed</p>
                    <p className="font-medium">{weatherData.wind.speed} m/s</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <CloudRain className="w-6 h-6 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Pressure</p>
                    <p className="font-medium">{weatherData.main.pressure} hPa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default WeatherInfo;
