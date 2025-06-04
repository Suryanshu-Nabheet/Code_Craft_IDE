import React, { useEffect, useState, useRef } from 'react';
import { Terminal as TerminalIcon, Loader2 } from 'lucide-react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import 'xterm/css/xterm.css';

interface TerminalPaneProps {
  output: string;
  isLoading?: boolean;
}

const TerminalPane: React.FC<TerminalPaneProps> = ({ output, isLoading = false }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const lastOutputRef = useRef<string>('');
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const { theme } = useTheme();

  // Initialize terminal
  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const term = new Terminal({
      theme: {
        background: theme === 'dark' ? '#1a1b26' : '#ffffff',
        foreground: theme === 'dark' ? '#a9b1d6' : '#1a1a1a',
        cursor: theme === 'dark' ? '#c0caf5' : '#1a1a1a',
        black: theme === 'dark' ? '#24283b' : '#000000',
        red: '#ff0000',
        green: '#00ff00',
        blue: '#0000ff',
        yellow: theme === 'dark' ? '#e0af68' : '#ffa500',
        magenta: theme === 'dark' ? '#bb9af7' : '#ff00ff',
        cyan: theme === 'dark' ? '#7dcfff' : '#00ffff',
        white: theme === 'dark' ? '#c0caf5' : '#ffffff',
        brightBlack: theme === 'dark' ? '#414868' : '#666666',
        brightRed: '#ff0000',
        brightGreen: '#00ff00',
        brightBlue: '#0000ff',
        brightYellow: theme === 'dark' ? '#e0af68' : '#ffa500',
        brightMagenta: theme === 'dark' ? '#bb9af7' : '#ff00ff',
        brightCyan: theme === 'dark' ? '#7dcfff' : '#00ffff',
        brightWhite: theme === 'dark' ? '#c0caf5' : '#ffffff'
      },
      fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
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
      setIsTerminalVisible(true);
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
  }, [theme]);

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

      const coloredLine = line
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Function to process output and add colors
  const processOutput = (text: string) => {
    // Split the text into lines
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Check for different types of lines
      if (line.includes('Error:')) {
        return <div key={index} className="text-red-500">{line}</div>;
      }
      if (line.includes('Success') || line.includes('completed successfully')) {
        return <div key={index} className="text-green-500">{line}</div>;
      }
      if (line.includes('Running') || line.includes('Initializing')) {
        return <div key={index} className="text-blue-500">{line}</div>;
      }
      if (line.includes('Warning:')) {
        return <div key={index} className="text-yellow-500">{line}</div>;
      }
      // Default color for other lines
      return <div key={index} className="text-gray-300">{line}</div>;
    });
  };

  return (
    <motion.div 
      className="h-full flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="p-2 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 border-b border-gray-700/50 text-sm flex justify-between items-center shadow-md"
        variants={headerVariants}
      >
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <TerminalIcon className="h-4 w-4 text-blue-400" />
          <span className="font-medium">Terminal</span>
          {isLoading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-4 w-4 text-blue-500" />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      <motion.div 
        className="flex-1 overflow-hidden relative transition-colors duration-300"
        style={{ backgroundColor: theme === 'dark' ? '#1a1b26' : '#ffffff' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isTerminalVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div ref={terminalRef} className="absolute inset-0">
          <div className="space-y-1">
            {processOutput(output)}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TerminalPane;