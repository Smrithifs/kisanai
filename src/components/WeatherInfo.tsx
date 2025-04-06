
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LanguageSelector from './LanguageSelector';
import { ApiService } from '@/services/api';
import { useToast } from "@/hooks/use-toast";

interface WeatherData {
  weather: {
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  name: string;
}

const WeatherInfo: React.FC = () => {
  const [city, setCity] = useState('');
  const [language, setLanguage] = useState('kn');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        description: "Failed to get weather data. Please check the city name and try again.",
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
        <CardTitle className="text-2xl">Weather Information</CardTitle>
        <CardDescription className="text-kisan-light opacity-90">
          Get weather updates for your location
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
            <h3 className="font-medium text-lg mb-2">Weather in {weatherData.name}:</h3>
            <div className="p-4 bg-kisan-gray rounded-lg">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center">
                  {weatherData.weather[0].icon && (
                    <img
                      src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                      alt={weatherData.weather[0].description}
                      className="w-16 h-16"
                    />
                  )}
                  <div>
                    <p className="text-xl font-medium">{Math.round(weatherData.main.temp)}°C</p>
                    <p className="text-gray-600 capitalize">{weatherData.weather[0].description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 sm:mt-0">
                  <div>
                    <p className="text-sm text-gray-500">Feels Like</p>
                    <p className="font-medium">{Math.round(weatherData.main.feels_like)}°C</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Humidity</p>
                    <p className="font-medium">{weatherData.main.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Wind</p>
                    <p className="font-medium">{weatherData.wind.speed} m/s</p>
                  </div>
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
