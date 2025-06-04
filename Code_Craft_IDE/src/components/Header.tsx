import React, { useRef } from 'react';
import { Play, Trash2, Moon, Sun, Save, FileCode, Share2, Upload } from 'lucide-react';
import { Language, supportedLanguages } from '../utils/languages';
import LanguageSelector from './LanguageSelector';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface HeaderProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  onRunCode: () => void;
  onClearTerminal: () => void;
  onSaveCode: () => void;
  onShareCode: () => void;
  onFileUpload: (content: string, language: Language) => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  selectedLanguage,
  onLanguageChange,
  onRunCode,
  onClearTerminal,
  onSaveCode,
  onShareCode,
  onFileUpload,
  isLoading
}) => {
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Determine language from file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      const language = supportedLanguages.find((lang: Language) => lang.extension === extension) || selectedLanguage;
      onFileUpload(content, language);
    };
    reader.readAsText(file);
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const headerVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.header 
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className={`flex items-center justify-between px-6 py-3 
        ${theme === 'dark' 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700/50' 
          : 'bg-gradient-to-r from-white to-gray-50 border-gray-200/50'
        } 
        border-b shadow-lg transition-colors duration-300`}
    >
      <motion.div 
        className="flex items-center"
        whileHover={{ scale: 1.02 }}
      >
        <FileCode className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
        <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} hidden sm:block`}>
          CodeCraft
        </h1>
      </motion.div>

      <div className="flex-1 mx-8">
        <LanguageSelector 
          selectedLanguage={selectedLanguage} 
          onLanguageChange={onLanguageChange} 
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".js,.ts,.py,.java,.cpp,.cs,.c,.html"
            className="hidden"
            aria-label="Upload code file"
            title="Upload code file"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            aria-label="Open file"
            title="Open file"
          >
            <Upload className="h-4 w-4" />
            <span>Open File</span>
          </motion.button>
        </div>

        <motion.button 
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className={`p-2.5 rounded-md ${
            isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : theme === 'dark'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                : 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600'
          } text-white transition-all duration-300 flex items-center text-sm shadow-md`}
          onClick={onRunCode}
          disabled={isLoading}
          title={isLoading ? "Initializing Python..." : "Run Code"}
        >
          <Play className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">
            {isLoading ? 'Initializing...' : 'Run'}
          </span>
        </motion.button>
        
        <motion.button 
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className={`p-2.5 rounded-md ${
            theme === 'dark'
              ? 'bg-white/10 hover:bg-white/20'
              : 'bg-gray-100 hover:bg-gray-200'
          } transition-all duration-300 flex items-center text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          } shadow-md`}
          onClick={onClearTerminal}
          title="Clear Terminal"
        >
          <Trash2 className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Clear</span>
        </motion.button>
        
        <motion.button 
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className={`p-2.5 rounded-md ${
            theme === 'dark'
              ? 'bg-white/10 hover:bg-white/20'
              : 'bg-gray-100 hover:bg-gray-200'
          } transition-all duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          } shadow-md`}
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </motion.button>
        
        <motion.button 
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className={`p-2.5 rounded-md ${
            theme === 'dark'
              ? 'bg-white/10 hover:bg-white/20'
              : 'bg-gray-100 hover:bg-gray-200'
          } transition-all duration-300 hidden sm:flex items-center text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          } shadow-md`}
          onClick={onSaveCode}
          title="Save Code"
        >
          <Save className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Save</span>
        </motion.button>
        
        <motion.button 
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className={`p-2.5 rounded-md ${
            theme === 'dark'
              ? 'bg-white/10 hover:bg-white/20'
              : 'bg-gray-100 hover:bg-gray-200'
          } transition-all duration-300 hidden sm:flex items-center text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          } shadow-md`}
          onClick={onShareCode}
          title="Share Code"
        >
          <Share2 className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Share</span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;