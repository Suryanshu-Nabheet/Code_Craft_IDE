import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Language } from '../utils/languages';
import { useTheme } from '../contexts/ThemeContext';
import { useEditor } from '../contexts/EditorContext';
import { motion } from 'framer-motion';
import * as monaco from 'monaco-editor';

interface EditorPaneProps {
  language: Language;
  code: string;
  onChange: (value: string) => void;
}

const EditorPane: React.FC<EditorPaneProps> = ({ language, code, onChange }) => {
  const { theme } = useTheme();
  const { setEditorInstance } = useEditor();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    setEditorInstance(editor);

    // Disable zoom
    editor.onKeyDown((e) => {
      if ((e.ctrlKey || e.metaKey) && (e.code === 'Equal' || e.code === 'Minus')) {
        e.preventDefault();
      }
    });
  };

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

  return (
    <motion.div 
      className="h-full flex flex-col transition-colors duration-300"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="p-2 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 border-b border-gray-700/50 text-sm flex justify-between items-center shadow-md"
        variants={headerVariants}
      >
        <div className="flex items-center">
          <motion.span 
            className="inline-block w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: language.color }}
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
          />
          <span className="font-medium">main.{language.extension}</span>
        </div>
        <motion.div 
          className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-md"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {language.name} Editor
        </motion.div>
      </motion.div>
      <motion.div 
        className="flex-1 overflow-hidden transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
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
            padding: { top: 10 },
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            mouseWheelZoom: false
          }}
          onMount={handleEditorDidMount}
        />
      </motion.div>
    </motion.div>
  );
};

export default EditorPane;