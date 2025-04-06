
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoiceAssistant from '@/components/VoiceAssistant';
import TextQuestion from '@/components/TextQuestion';
import CropDetection from '@/components/CropDetection';
import WeatherInfo from '@/components/WeatherInfo';
import UserSettings from '@/components/UserSettings';
import { Leaf, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [activeTab, setActiveTab] = useState("voice");
  const [appLanguage, setAppLanguage] = useState("en");
  const isMobile = useIsMobile();

  const handleLanguageChange = (language: string) => {
    setAppLanguage(language);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-leaf-pattern bg-cover bg-center mix-blend-overlay" />
      
      <header className="bg-gradient-to-r from-green-700 to-green-600 text-white py-4 px-4 sm:px-6 shadow-lg relative z-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center">
                <Leaf className="h-7 w-7 mr-2" />
                <h1 className="text-xl sm:text-3xl font-bold">Kisan AI</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <UserSettings 
                selectedLanguage={appLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-6 py-4 sm:py-8">
        <motion.div 
          className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-green-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs 
            defaultValue="voice" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="bg-gradient-to-r from-green-700/90 to-green-600/90 backdrop-blur-sm p-2 sm:p-4">
              <TabsList className={`grid ${isMobile ? 'grid-cols-2 gap-1' : 'grid-cols-4'} w-full bg-white/20 backdrop-blur-sm rounded-lg`}>
                <TabsTrigger value="voice" className="py-2 text-white data-[state=active]:bg-white data-[state=active]:text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" x2="12" y1="19" y2="22"></line>
                  </svg>
                  <span className={isMobile ? "text-xs" : ""}>Voice</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="py-2 text-white data-[state=active]:bg-white data-[state=active]:text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span className={isMobile ? "text-xs" : ""}>Ask AI</span>
                </TabsTrigger>
                {isMobile && activeTab !== "voice" && activeTab !== "text" ? null : (
                  <TabsTrigger value="crop" className="py-2 text-white data-[state=active]:bg-white data-[state=active]:text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19c-1.9 0-3.47-1.5-5-2.96V15a7 7 0 0 1 10 0v1.04C15.47 17.5 13.9 19 12 19Z"></path>
                      <path d="M12 19c1.32 0 2.5-5.37 2.5-12S13.32 7 12 7 9.5 0.37 9.5 7s1.18 12 2.5 12Z"></path>
                      <path d="M12 19c-1.9 0-3.47-1.5-5-2.96V15a7 7 0 0 1 10 0v1.04C15.47 17.5 13.9 19 12 19Z"></path>
                    </svg>
                    <span className={isMobile ? "text-xs" : ""}>Crop</span>
                  </TabsTrigger>
                )}
                {isMobile && activeTab !== "voice" && activeTab !== "text" ? null : (
                  <TabsTrigger value="weather" className="py-2 text-white data-[state=active]:bg-white data-[state=active]:text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                    </svg>
                    <span className={isMobile ? "text-xs" : ""}>Weather</span>
                  </TabsTrigger>
                )}
                {isMobile && (activeTab === "crop" || activeTab === "weather") && (
                  <>
                    <TabsTrigger value="crop" className="py-2 text-white data-[state=active]:bg-white data-[state=active]:text-green-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19c-1.9 0-3.47-1.5-5-2.96V15a7 7 0 0 1 10 0v1.04C15.47 17.5 13.9 19 12 19Z"></path>
                        <path d="M12 19c1.32 0 2.5-5.37 2.5-12S13.32 7 12 7 9.5 0.37 9.5 7s1.18 12 2.5 12Z"></path>
                        <path d="M12 19c-1.9 0-3.47-1.5-5-2.96V15a7 7 0 0 1 10 0v1.04C15.47 17.5 13.9 19 12 19Z"></path>
                      </svg>
                      <span className={isMobile ? "text-xs" : ""}>Crop</span>
                    </TabsTrigger>
                    <TabsTrigger value="weather" className="py-2 text-white data-[state=active]:bg-white data-[state=active]:text-green-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                      </svg>
                      <span className={isMobile ? "text-xs" : ""}>Weather</span>
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
            </div>

            <div className="p-3 sm:p-6">
              <TabsContent value="voice" className="mt-1 sm:mt-2 focus:outline-none">
                <VoiceAssistant defaultLanguage={appLanguage} />
              </TabsContent>
              
              <TabsContent value="text" className="mt-1 sm:mt-2 focus:outline-none">
                <TextQuestion defaultLanguage={appLanguage} />
              </TabsContent>
              
              <TabsContent value="crop" className="mt-1 sm:mt-2 focus:outline-none">
                <CropDetection />
              </TabsContent>
              
              <TabsContent value="weather" className="mt-1 sm:mt-2 focus:outline-none">
                <WeatherInfo defaultLanguage={appLanguage} />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </main>

      <footer className="bg-gradient-to-r from-green-800 to-green-700 text-white py-4 px-4 sm:px-6 mt-8 sm:mt-12">
        <div className="container mx-auto text-center">
          <p className="text-sm">Kisan AI - Digital buddy for farmers © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
