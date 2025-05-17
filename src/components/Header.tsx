import React from 'react';
import { Play, Trash2, Moon, Sun, Save, FileCode, Share2 } from 'lucide-react';
import { Language } from '../utils/languages';
import LanguageSelector from './LanguageSelector';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  onRunCode: () => void;
  onClearTerminal: () => void;
  onSaveCode: () => void;
  onShareCode: () => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  selectedLanguage,
  onLanguageChange,
  onRunCode,
  onClearTerminal,
  onSaveCode,
  onShareCode,
  isLoading
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <FileCode className="h-6 w-6 text-blue-500 dark:text-blue-400 mr-2" />
        <h1 className="text-xl font-semibold hidden sm:block">CodeCraft</h1>
      </div>

      <div className="flex-1 mx-4">
        <LanguageSelector 
          selectedLanguage={selectedLanguage} 
          onLanguageChange={onLanguageChange} 
        />
      </div>

      <div className="flex items-center space-x-2">
        <button 
          className={`p-2 rounded-md ${
            isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition flex items-center text-sm`}
          onClick={() => onRunCode()}
          disabled={isLoading}
          title={isLoading ? "Initializing Python..." : "Run Code"}
        >
          <Play className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">
            {isLoading ? 'Initializing...' : 'Run'}
          </span>
        </button>
        
        <button 
          className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center text-sm"
          onClick={onClearTerminal}
          title="Clear Terminal"
        >
          <Trash2 className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Clear</span>
        </button>
        
        <button 
          className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
        
        <button 
          className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition hidden sm:flex items-center text-sm"
          onClick={onSaveCode}
          title="Save Code"
        >
          <Save className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Save</span>
        </button>
        
        <button 
          className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition hidden sm:flex items-center text-sm"
          onClick={onShareCode}
          title="Share Code"
        >
          <Share2 className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </header>
  );
};

export default Header;