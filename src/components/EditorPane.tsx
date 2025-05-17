import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Language } from '../utils/languages';
import { useTheme } from '../contexts/ThemeContext';
import { useEditor } from '../contexts/EditorContext';

interface EditorPaneProps {
  language: Language;
  code: string;
  onChange: (value: string) => void;
}

const EditorPane: React.FC<EditorPaneProps> = ({ language, code, onChange }) => {
  const { theme } = useTheme();
  const { setEditorInstance } = useEditor();
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    setEditorInstance(editor);
  };

  // Update editor language when it changes
  useEffect(() => {
    if (editorRef.current) {
      const monacoLanguage = language.monacoLanguage || language.id;
      // @ts-ignore - monaco editor type issue
      editorRef.current.getModel().setValue(code);
    }
  }, [language]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 bg-gray-800 text-gray-300 border-b border-gray-700 text-sm flex justify-between items-center">
        <div className="flex items-center">
          <span 
            className="inline-block w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: language.color }}
          />
          <span>main.{language.extension}</span>
        </div>
        <div className="text-xs text-gray-400">
          {language.name} Editor
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language.monacoLanguage || language.id}
          value={code}
          onChange={(value) => onChange(value || '')}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 10 }
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
};

export default EditorPane;