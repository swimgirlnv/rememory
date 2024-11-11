// src/components/TipTapEditor.tsx
import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Code from '@tiptap/extension-code';
import BulletList from '@tiptap/extension-bullet-list';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import '../styles/TipTapEditor.css';

interface TipTapEditorProps {
  onUpdate: (content: string) => void;
  initialContent?: string;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ onUpdate, initialContent = '<p>Start writing...</p>' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Strike,
      Code,
      BulletList,
      CodeBlock,
      Blockquote,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="rich-text-editor">
      <div className="toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()} 
                className={editor.isActive('bold') ? 'active' : ''}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} 
                className={editor.isActive('italic') ? 'active' : ''}>Italic</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} 
                className={editor.isActive('strike') ? 'active' : ''}>Strikethrough</button>
        <button onClick={() => editor.chain().focus().toggleCode().run()} 
                className={editor.isActive('code') ? 'active' : ''}>Code</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} 
                className={editor.isActive('bulletList') ? 'active' : ''}>Bullet List</button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
                className={editor.isActive('codeBlock') ? 'active' : ''}>Code Block</button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} 
                className={editor.isActive('blockquote') ? 'active' : ''}>Blockquote</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;