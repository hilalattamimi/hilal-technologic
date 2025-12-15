'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface BlogContentProps {
  content: string
}

export default function BlogContent({ content }: BlogContentProps) {
  // Check if content is HTML (from Rich Text Editor) or Markdown
  const isHTML = content.trim().startsWith('<') && content.includes('</') 

  if (isHTML) {
    return (
      <article 
        className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-violet-400 prose-strong:text-foreground prose-code:text-violet-300 prose-code:bg-violet-950/50 prose-code:px-1 prose-code:rounded prose-pre:bg-zinc-900 prose-blockquote:border-violet-500 prose-blockquote:text-muted-foreground prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  return (
    <article className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-violet-400 prose-strong:text-foreground prose-code:text-violet-300 prose-code:bg-violet-950/50 prose-code:px-1 prose-code:rounded prose-pre:bg-zinc-900 prose-blockquote:border-violet-500 prose-blockquote:text-muted-foreground prose-img:rounded-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-foreground mt-8 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-foreground mt-6 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-foreground mt-5 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-violet-400 hover:text-violet-300 underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-violet-500 pl-4 italic text-muted-foreground my-4">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-violet-950/50 text-violet-300 px-1.5 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto my-4">
              {children}
            </pre>
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="rounded-lg max-w-full my-4" />
          ),
          hr: () => <hr className="border-border my-8" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 bg-card text-foreground font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2 text-muted-foreground">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
