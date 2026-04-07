import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import TurndownService from 'turndown';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

type EditorMode = 'basic' | 'markdown' | 'html';

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [mode, setMode] = useState<EditorMode>('basic');
  const [localValue, setLocalValue] = useState(value);
  const editorRef = useRef<HTMLDivElement>(null);
  const turndownService = new TurndownService({ headingStyle: 'atx' });

  // Sync external value when it changes (e.g., initial load)
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
      if (mode === 'basic' && editorRef.current) {
        editorRef.current.innerHTML = DOMPurify.sanitize(value, { 
          ADD_ATTR: ['target', 'class', 'style'], 
          ADD_TAGS: ['iframe', 'style'] 
        });
      }
    }
  }, [value]);

  const handleModeChange = (newMode: EditorMode) => {
    if (mode === newMode) return;

    let currentHtml = localValue;

    // If we are leaving basic mode, grab the latest HTML from contentEditable
    if (mode === 'basic' && editorRef.current) {
      currentHtml = editorRef.current.innerHTML;
    }

    // If we are leaving markdown mode, convert markdown to HTML
    if (mode === 'markdown') {
      currentHtml = marked.parse(localValue) as string;
    }

    // Now we have the current state as HTML.
    // Convert to the target mode's format.
    if (newMode === 'basic') {
      setLocalValue(currentHtml);
      if (editorRef.current) {
        editorRef.current.innerHTML = DOMPurify.sanitize(currentHtml, { 
          ADD_ATTR: ['target', 'class', 'style'], 
          ADD_TAGS: ['iframe', 'style'] 
        });
      }
    } else if (newMode === 'markdown') {
      const markdown = turndownService.turndown(currentHtml);
      setLocalValue(markdown);
    } else if (newMode === 'html') {
      setLocalValue(currentHtml);
    }

    setMode(newMode);
  };

  const handleBasicInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setLocalValue(html);
      onChange(html);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    if (mode === 'markdown') {
      onChange(marked.parse(val) as string);
    } else {
      onChange(val); // HTML mode
    }
  };

  const execCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    handleBasicInput();
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between bg-gray-50 border-b border-gray-200 p-2 gap-2">
        <div className="flex items-center gap-1">
          {mode === 'basic' && (
            <>
              <button type="button" onClick={() => execCommand('bold')} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="Bold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg>
              </button>
              <button type="button" onClick={() => execCommand('italic')} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="Italic">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </button>
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              <button type="button" onClick={() => execCommand('formatBlock', 'H2')} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded font-bold text-sm" title="Heading 2">H2</button>
              <button type="button" onClick={() => execCommand('formatBlock', 'H3')} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded font-bold text-sm" title="Heading 3">H3</button>
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="Bullet List">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="Numbered List">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h14M7 12h14M7 16h14M3 8h.01M3 12h.01M3 16h.01" /></svg>
              </button>
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              <button type="button" onClick={() => execCommand('justifyLeft')} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="Align Left">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
              </button>
              <button type="button" onClick={() => execCommand('justifyCenter')} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="Align Center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <button type="button" onClick={() => execCommand('justifyRight')} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="Align Right">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M13 18h7" /></svg>
              </button>
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              <button type="button" onClick={() => {
                const url = prompt('Enter link URL:');
                if (url) execCommand('createLink', url);
              }} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded" title="Link">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              </button>
            </>
          )}
        </div>
        <div className="flex bg-gray-200 rounded p-0.5">
          <button type="button" onClick={() => handleModeChange('basic')} className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${mode === 'basic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>기본모드</button>
          <button type="button" onClick={() => handleModeChange('markdown')} className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${mode === 'markdown' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>마크다운</button>
          <button type="button" onClick={() => handleModeChange('html')} className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${mode === 'html' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>HTML</button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 min-h-[500px] relative">
        {mode === 'basic' ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleBasicInput}
            className="absolute inset-0 p-4 prose prose-sm max-w-none focus:outline-none overflow-y-auto"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(localValue, { 
                ADD_ATTR: ['target', 'class', 'style'], 
                ADD_TAGS: ['iframe', 'style'] 
              }) 
            }}
          />
        ) : (
          <textarea
            value={localValue}
            onChange={handleTextareaChange}
            className="absolute inset-0 w-full h-full p-4 resize-none focus:outline-none font-mono text-sm text-gray-800 bg-gray-50"
            placeholder={mode === 'markdown' ? '마크다운으로 작성하세요...' : 'HTML 코드를 입력하세요...'}
          />
        )}
      </div>
    </div>
  );
}
