// TipTapEditor.tsx
import React, { Dispatch, SetStateAction } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface TipTapEditorProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return <div style={{display: 'flex', flexDirection: 'column'}}><EditorContent editor={editor} /></div>;
};

export default TipTapEditor;