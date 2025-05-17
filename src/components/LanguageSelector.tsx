import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Language, supportedLanguages } from '../utils/languages';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    closeDropdown();
  };

  React.useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) closeDropdown();
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown();
        }}
        type="button"
        className="inline-flex justify-between items-center w-full sm:w-64 px-4 py-2 text-sm font-medium bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
      >
        <div className="flex items-center">
          <img 
            src={selectedLanguage.logo} 
            alt={selectedLanguage.name} 
            className="w-5 h-5 mr-2"
          />
          {selectedLanguage.name}
          <span className="ml-2 text-xs text-gray-400">.{selectedLanguage.extension}</span>
        </div>
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 mt-1 w-full bg-gray-700 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 divide-y divide-gray-600 max-h-60 overflow-auto">
          <div className="py-1" onClick={(e) => e.stopPropagation()}>
            {supportedLanguages.map((language) => (
              <button
                key={language.id}
                onClick={() => handleLanguageSelect(language)}
                className={`${
                  selectedLanguage.id === language.id
                    ? 'bg-gray-600 text-white'
                    : 'text-gray-200 hover:bg-gray-600'
                } group flex items-center w-full px-4 py-2 text-sm`}
              >
                <img 
                  src={language.logo} 
                  alt={language.name} 
                  className="w-5 h-5 mr-2"
                />
                {language.name}
                <span className="ml-2 text-xs text-gray-400">.{language.extension}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;