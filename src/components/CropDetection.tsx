
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApiService } from '@/services/api';
import { useToast } from "@/hooks/use-toast";

const CropDetection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detection, setDetection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset previous detection
      setDetection(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please select an image first",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await ApiService.detectCrop(selectedImage);
      setDetection(data.crop);
    } catch (error) {
      console.error("Error detecting crop:", error);
      toast({
        title: "Error",
        description: "Failed to detect crop. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-kisan-primary text-white rounded-t-lg">
        <CardTitle className="text-2xl">Crop Detection</CardTitle>
        <CardDescription className="text-kisan-light opacity-90">
          Upload a plant image to identify the crop
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={triggerFileInput}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={imagePreview} 
                    alt="Selected crop" 
                    className="max-h-64 max-w-full object-contain mb-3"
                  />
                  <p className="text-sm text-gray-500">Click to change image</p>
                </div>
              ) : (
                <div className="py-10">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 text-gray-400 mx-auto mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  <p className="text-lg font-medium">Click to upload image</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: JPG, PNG
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              type="submit" 
              className="px-8 py-6 text-lg w-full md:w-auto"
              disabled={isLoading || !selectedImage}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                "Detect Crop"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      
      {detection && (
        <CardFooter className="flex-col items-start pt-2 pb-6">
          <div className="mt-4 w-full">
            <h3 className="font-medium text-lg mb-2">Detection Result:</h3>
            <div className="p-4 bg-kisan-gray rounded-lg">
              {detection}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CropDetection;
