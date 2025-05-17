import React, { useEffect, useState, useRef } from 'react';
import { Play, Trash2, Moon, Sun, Save, FileCode, Share2 } from 'lucide-react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { Language } from '../utils/languages';
import LanguageSelector from './LanguageSelector';
import { useTheme } from '../contexts/ThemeContext';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

interface HeaderProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  onRunCode: () => void;
  onClearTerminal: () => void;
  onSaveCode: () => void;
  onShareCode: () => void;
}

const Header: React.FC<HeaderProps> = ({
  selectedLanguage,
  onLanguageChange,
  onRunCode,
  onClearTerminal,
  onSaveCode,
  onShareCode
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
          className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition flex items-center text-sm"
          onClick={() => onRunCode()}
          title="Run Code"
        >
          <Play className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Run</span>
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

interface TerminalPaneProps {
  output: string;
}

const TerminalPane: React.FC<TerminalPaneProps> = ({ output }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const lastOutputRef = useRef<string>('');

  // Initialize terminal
  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const term = new Terminal({
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
        selection: 'rgba(255, 255, 255, 0.3)',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#ffffff'
      },
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      convertEol: true,
      rows: 20,
      cols: 80,
      scrollback: 1000,
      tabStopWidth: 4,
      windowsMode: false
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    // Configure terminal container
    if (terminalRef.current) {
      terminalRef.current.style.display = 'block';
      terminalRef.current.style.height = '100%';
      terminalRef.current.style.width = '100%';
      terminalRef.current.style.padding = '8px';
    }

    // Open terminal in container
    term.open(terminalRef.current!);

    // Initial setup
    requestAnimationFrame(() => {
      fitAddon.fit();
      term.write('\x1b[2J\x1b[H'); // Clear screen
      term.write('\x1b[1;1H'); // Move cursor to top
      term.write('\x1b[38;2;180;180;180m$ \x1b[0m'); // Gray prompt
    });

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Handle window resize
    const handleResize = () => {
      requestAnimationFrame(() => {
        fitAddon.fit();
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      xtermRef.current = null;
    };
  }, []);

  // Handle output changes
  useEffect(() => {
    if (!xtermRef.current || !output || output === lastOutputRef.current) return;

    const term = xtermRef.current;
    lastOutputRef.current = output;

    // Clear terminal and reset cursor
    term.write('\x1b[2J\x1b[H\x1b[1;1H');

    // Process and write output
    const lines = output.split('\n');
    
    lines.forEach((line) => {
      if (!line.trim()) {
        term.writeln('');
        return;
      }

      let coloredLine = line
        // Timestamps
        .replace(/\[(.*?)\]/g, '\x1b[36m[$1]\x1b[0m')
        // Errors
        .replace(/Error:(.*)/g, '\x1b[31mError:$1\x1b[0m')
        // Success messages
        .replace(/(completed successfully|success)/gi, '\x1b[32m$1\x1b[0m')
        // Running messages
        .replace(/(Running.*code\.\.\.)/g, '\x1b[33m$1\x1b[0m');

      term.writeln(coloredLine);
    });

    // Add prompt at the end
    term.write('\x1b[38;2;180;180;180m$ \x1b[0m');

    // Keep cursor at the top
    term.scrollToTop();

    // Make sure terminal is properly sized
    if (fitAddonRef.current) {
      requestAnimationFrame(() => {
        fitAddonRef.current?.fit();
      });
    }
  }, [output]);

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700 text-sm flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="h-4 w-4" />
          <span>Terminal</span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative bg-[#1e1e1e]">
        <div ref={terminalRef} className="absolute inset-0" />
      </div>
    </div>
  );
};

export default TerminalPane;