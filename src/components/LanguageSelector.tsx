
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES } from "@/services/api";
import { Languages } from 'lucide-react';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  value, 
  onChange,
  className = "",
  disabled = false
}) => {
  return (
    <div className={`w-full ${className}`}>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full flex items-center border-green-200 focus:ring-green-500">
          <Languages className="w-4 h-4 mr-2 text-green-600" />
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent className="bg-white border-green-100">
          {SUPPORTED_LANGUAGES.map((language) => (
            <SelectItem 
              key={language.code} 
              value={language.code}
              className="hover:bg-green-50 focus:bg-green-50"
            >
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
