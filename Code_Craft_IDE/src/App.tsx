import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EditorPane from './components/EditorPane';
import TerminalPane from './components/TerminalPane';
import PreviewPane from './components/PreviewPane';
import { Language, supportedLanguages } from './utils/languages';
import { ThemeProvider } from './contexts/ThemeContext';
import { EditorProvider } from './contexts/EditorContext';
import { loadPyodide, PyodideInterface } from "pyodide";

// Judge0 API configuration
const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = 'YOUR_RAPIDAPI_KEY'; // Replace with your RapidAPI key

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(supportedLanguages[0]);
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [horizontalLayout, setHorizontalLayout] = useState(window.innerWidth < 768);
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setHorizontalLayout(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function loadPython() {
      if (pyodide) return; // Skip if already loaded
      
      try {
        setIsLoading(true);
        setOutput('Initializing Python runtime...\n');
        
        const pyodideInstance = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.6/full/",  // Updated version
          stdout: (text) => setOutput(prev => prev + text + '\n'),
          stderr: (text) => setOutput(prev => prev + 'Error: ' + text + '\n')
        });
        
        setPyodide(pyodideInstance);
        setOutput(prev => prev + 'Python runtime initialized successfully.\n');
      } catch (error) {
        console.error("Failed to load Python runtime:", error);
        setOutput(prev => prev + `Failed to initialize Python runtime: ${error}\n`);
      } finally {
        setIsLoading(false);
      }
    }
    loadPython();
  }, []);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleRunCode = async () => {
    try {
      if (selectedLanguage.id === 'python') {
        if (!pyodide) {
          setOutput('Python runtime is still initializing. Please wait...\n');
          return;
        }
        
        if (isLoading) {
          setOutput('Please wait for Python runtime to finish loading...\n');
          return;
        }

        setOutput(`[${new Date().toLocaleTimeString()}] Running Python code...\n`);

        try {
          const result = await pyodide.runPythonAsync(code);
          if (result !== undefined && result !== null) {
            setOutput(prev => `${prev}${result}\n`);
          }
          setOutput(prev => `${prev}[${new Date().toLocaleTimeString()}] Execution completed successfully.\n`);
        } catch (error: any) {
          setOutput(prev => `${prev}Error: ${error.message}\n`);
        }
      } else if (selectedLanguage.id === 'javascript') {
        const logs: string[] = [];
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;

        // Override console methods
        console.log = (...args) => {
          const formattedArgs = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          logs.push(formattedArgs);
        };

        console.error = (...args) => {
          const formattedArgs = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          logs.push(`Error: ${formattedArgs}`);
        };

        try {
          // Execute code in a safe way
          const executeCode = new Function(`
            return (async () => {
              ${code}
            })();
          `);

          await executeCode();
          
          // Output all logs
          if (logs.length > 0) {
            setOutput(prev => `${prev}${logs.join('\n')}\n`);
          }
          
          setOutput(prev => `${prev}\n[${new Date().toLocaleTimeString()}] Execution completed successfully.\n`);
        } catch (error: any) {
          setOutput(prev => `${prev}Error: ${error.message}\n`);
        } finally {
          // Restore console methods
          console.log = originalConsoleLog;
          console.error = originalConsoleError;
        }
      }
    } catch (error: any) {
      setOutput(prev => `${prev}Error: ${error.message}\n`);
    }
  };

  const handleClearTerminal = () => {
    setOutput('');
  };

  const handleSaveCode = () => {
    try {
      // Create file content
      const fileContent = code;
      const fileName = `code.${selectedLanguage.extension}`;
      
      // Create a blob with the file content
      const blob = new Blob([fileContent], { type: 'text/plain' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setOutput(prev => `${prev}[${new Date().toLocaleTimeString()}] Code saved as ${fileName}\n`);
    } catch (error) {
      setOutput(prev => `${prev}Error saving code: ${error.message}\n`);
    }
  };

  const handleShareCode = () => {
    try {
      const shareData = {
        title: 'CodeCraft Editor Code',
        text: code,
        url: window.location.href
      };
      
      if (navigator.share && navigator.canShare(shareData)) {
        navigator.share(shareData)
          .then(() => setOutput(prev => `${prev}[${new Date().toLocaleTimeString()}] Code shared successfully.\n`))
          .catch(error => setOutput(prev => `${prev}Error sharing code: ${error.message}\n`));
      } else {
        navigator.clipboard.writeText(code)
          .then(() => setOutput(prev => `${prev}[${new Date().toLocaleTimeString()}] Code copied to clipboard.\n`))
          .catch(error => setOutput(prev => `${prev}Error copying code: ${error.message}\n`));
      }
    } catch (error) {
      setOutput(prev => `${prev}Error sharing code: ${error.message}\n`);
    }
  };

  const handleFileUpload = (content: string, language: Language) => {
    setCode(content);
    setSelectedLanguage(language);
    setOutput(prev => `${prev}Success: File loaded successfully.\n`);
  };

  return (
    <ThemeProvider>
      <EditorProvider>
        <div className="flex flex-col h-screen">
          <Header 
            selectedLanguage={selectedLanguage} 
            onLanguageChange={handleLanguageChange}
            onRunCode={handleRunCode}
            onClearTerminal={handleClearTerminal}
            onSaveCode={handleSaveCode}
            onShareCode={handleShareCode}
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
          />
          
          <div className="flex flex-1 overflow-hidden">
            {horizontalLayout ? (
              <div className="flex flex-col flex-1">
                <div className="flex-1 min-h-[30%] max-h-[70%]">
                  <EditorPane 
                    language={selectedLanguage} 
                    code={code} 
                    onChange={setCode} 
                  />
                </div>
                <div className="h-[25%] min-h-[15%] max-h-[40%]">
                  <TerminalPane output={output} />
                </div>
                <div className="h-[25%] min-h-[15%] max-h-[40%]">
                  <PreviewPane 
                    language={selectedLanguage} 
                    code={code}
                  />
                </div>
              </div>
            ) : (
              <div className="flex w-full">
                <div className="w-[50%] min-w-[30%] max-w-[70%]">
                  <EditorPane 
                    language={selectedLanguage} 
                    code={code} 
                    onChange={setCode} 
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="h-[50%] min-h-[30%] max-h-[70%]">
                    <PreviewPane 
                      language={selectedLanguage} 
                      code={code}
                    />
                  </div>
                  <div className="h-[50%] min-h-[30%] max-h-[70%]">
                    <TerminalPane output={output} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </EditorProvider>
    </ThemeProvider>
  );
}

export default App;