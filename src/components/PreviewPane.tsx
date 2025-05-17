import React, { useMemo } from 'react';
import { Eye, RefreshCw, ExternalLink } from 'lucide-react';
import { Language } from '../utils/languages';

interface PreviewPaneProps {
  language: Language;
  code: string;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ language, code }) => {
  const canPreview = language.id === 'html' || language.id === 'javascript';
  
  const htmlPreview = useMemo(() => {
    if (!canPreview) return null;
    
    if (language.id === 'html') {
      return code;
    } else if (language.id === 'javascript') {
      return `
        <html>
          <head>
            <style>
              body {
                font-family: system-ui, sans-serif;
                padding: 20px;
                margin: 0;
                color: #1a1a1a;
                background: #ffffff;
              }
              @media (prefers-color-scheme: dark) {
                body {
                  color: #e5e5e5;
                  background: #1a1a1a;
                }
              }
              #output {
                border: 1px solid #ccc;
                padding: 10px;
                border-radius: 4px;
                background: #f5f5f5;
                color: #1a1a1a;
              }
            </style>
          </head>
          <body>
            <h3>JavaScript Output:</h3>
            <div id="output"></div>
            <script>
              const outputEl = document.getElementById('output');
              const log = console.log;
              console.log = function(...args) {
                log.apply(console, args);
                const text = args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
                ).join(' ');
                const p = document.createElement('p');
                p.style.margin = '5px 0';
                p.textContent = text;
                outputEl.appendChild(p);
              };
              
              try {
                (async function() {
                  ${code}
                })();
              } catch (error) {
                console.log('Error: ' + error.message);
              }
            </script>
          </body>
        </html>
      `;
    }
    
    return null;
  }, [language, code]);

  const [key, setKey] = React.useState(0);
  const refreshPreview = () => setKey(prev => prev + 1);

  const openInNewTab = () => {
    if (!htmlPreview) return;
    
    const blob = new Blob([htmlPreview], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    // Add title to the new window
    if (newWindow) {
      newWindow.document.title = `CodeCraft - ${language.name} Preview`;
    }
    
    // Cleanup URL after opening
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700 text-sm flex justify-between items-center">
        <div className="flex items-center">
          <Eye className="h-4 w-4 mr-2" />
          <span>Preview</span>
        </div>
        <div className="flex items-center space-x-2">
          {canPreview && (
            <>
              <button 
                onClick={refreshPreview}
                className="p-1.5 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition flex items-center"
                title="Refresh Preview"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button 
                onClick={openInNewTab}
                className="p-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition flex items-center space-x-1"
                title="Open in New Tab"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm">Open Preview</span>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 bg-white dark:bg-gray-950 overflow-auto">
        {canPreview ? (
          <iframe
            key={key}
            title="Preview"
            srcDoc={htmlPreview}
            className="w-full h-full border-none"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            <div className="text-center p-4">
              <Eye className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p>Preview not available for {language.name}</p>
              <p className="text-sm mt-1">Only HTML and JavaScript have preview support</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPane;