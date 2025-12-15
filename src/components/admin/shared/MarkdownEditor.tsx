'use client'

import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
)

interface MarkdownEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  height?: number
}

export default function MarkdownEditor({
  content,
  onChange,
  placeholder = 'Write your content in Markdown...',
  height = 400,
}: MarkdownEditorProps) {
  return (
    <div data-color-mode="dark" className="markdown-editor-wrapper">
      <MDEditor
        value={content}
        onChange={(value) => onChange(value || '')}
        height={height}
        preview="live"
        textareaProps={{
          placeholder,
        }}
        visibleDragbar={false}
      />
      <style jsx global>{`
        .markdown-editor-wrapper .w-md-editor {
          background-color: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
        }
        .markdown-editor-wrapper .w-md-editor-toolbar {
          background-color: hsl(var(--card));
          border-bottom: 1px solid hsl(var(--border));
        }
        .markdown-editor-wrapper .w-md-editor-toolbar li > button {
          color: hsl(var(--foreground));
        }
        .markdown-editor-wrapper .w-md-editor-toolbar li > button:hover {
          background-color: hsl(var(--accent));
        }
        .markdown-editor-wrapper .w-md-editor-content {
          background-color: hsl(var(--background));
        }
        .markdown-editor-wrapper .w-md-editor-text-input {
          color: hsl(var(--foreground));
        }
        .markdown-editor-wrapper .w-md-editor-preview {
          background-color: hsl(var(--card));
        }
        .markdown-editor-wrapper .wmde-markdown {
          background-color: transparent;
          color: hsl(var(--foreground));
        }
        .markdown-editor-wrapper .wmde-markdown h1,
        .markdown-editor-wrapper .wmde-markdown h2,
        .markdown-editor-wrapper .wmde-markdown h3,
        .markdown-editor-wrapper .wmde-markdown h4,
        .markdown-editor-wrapper .wmde-markdown h5,
        .markdown-editor-wrapper .wmde-markdown h6 {
          color: hsl(var(--foreground));
          border-bottom-color: hsl(var(--border));
        }
        .markdown-editor-wrapper .wmde-markdown a {
          color: rgb(139 92 246);
        }
        .markdown-editor-wrapper .wmde-markdown code {
          background-color: hsl(var(--muted));
          color: rgb(196 181 253);
        }
        .markdown-editor-wrapper .wmde-markdown pre {
          background-color: rgb(24 24 27);
        }
        .markdown-editor-wrapper .wmde-markdown blockquote {
          border-left-color: rgb(139 92 246);
          color: hsl(var(--muted-foreground));
        }
        .markdown-editor-wrapper .wmde-markdown hr {
          background-color: hsl(var(--border));
        }
        .markdown-editor-wrapper .wmde-markdown table th,
        .markdown-editor-wrapper .wmde-markdown table td {
          border-color: hsl(var(--border));
        }
        .markdown-editor-wrapper .wmde-markdown table tr {
          background-color: transparent;
          border-top-color: hsl(var(--border));
        }
        .markdown-editor-wrapper .wmde-markdown table tr:nth-child(2n) {
          background-color: hsl(var(--muted) / 0.5);
        }
        .markdown-editor-wrapper .w-md-editor-bar {
          display: none;
        }
      `}</style>
    </div>
  )
}
