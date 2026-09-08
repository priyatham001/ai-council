import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split content by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`space-y-3 leading-relaxed text-sm sm:text-base ${className}`}>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const firstLineEnd = part.indexOf('\n');
          const language = part.slice(3, firstLineEnd).trim() || 'code';
          const code = part.slice(firstLineEnd + 1, -3);
          return <CodeSnippet key={index} code={code} language={language} />;
        }

        // Render normal text blocks
        return <TextParagraphs key={index} rawText={part} />;
      })}
    </div>
  );
};

const CodeSnippet: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-zinc-700/60 bg-zinc-950 dark:bg-black text-zinc-100 font-mono text-xs sm:text-sm shadow-sm">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 text-xs">
        <span className="font-semibold uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-zinc-200 transition-colors px-1.5 py-0.5 rounded cursor-pointer"
          title="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto">
        <pre className="font-mono">{code}</pre>
      </div>
    </div>
  );
};

const TextParagraphs: React.FC<{ rawText: string }> = ({ rawText }) => {
  const lines = rawText.split('\n');

  // Check for markdown table groups
  const renderedElements: React.ReactNode[] = [];
  let tableBuffer: string[] = [];

  const flushTable = () => {
    if (tableBuffer.length >= 2) {
      const headerRow = tableBuffer[0]
        .split('|')
        .map((c) => c.trim())
        .filter((c, i, a) => !(i === 0 && c === '') && !(i === a.length - 1 && c === ''));
      const bodyRows = tableBuffer.slice(2).map((r) =>
        r
          .split('|')
          .map((c) => c.trim())
          .filter((c, i, a) => !(i === 0 && c === '') && !(i === a.length - 1 && c === ''))
      );

      renderedElements.push(
        <div key={`table-${renderedElements.length}`} className="my-3 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                {headerRow.map((h, i) => (
                  <th key={i} className="px-3 py-2 font-semibold text-zinc-900 dark:text-white">
                    {formatInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white/50 dark:bg-zinc-950/50">
              {bodyRows.map((row, ri) => (
                <tr key={ri} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                      {formatInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    tableBuffer = [];
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      tableBuffer.push(trimmed);
      continue;
    } else if (tableBuffer.length > 0) {
      flushTable();
    }

    if (!trimmed) {
      renderedElements.push(<div key={idx} className="h-1.5" />);
      continue;
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      renderedElements.push(
        <h4 key={idx} className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-3 mb-1">
          {formatInline(trimmed.replace('#### ', ''))}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith('### ')) {
      renderedElements.push(
        <h3 key={idx} className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-4 mb-1.5">
          {formatInline(trimmed.replace('### ', ''))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      renderedElements.push(
        <h2 key={idx} className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-5 mb-2">
          {formatInline(trimmed.replace('## ', ''))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith('# ')) {
      renderedElements.push(
        <h1 key={idx} className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-6 mb-2">
          {formatInline(trimmed.replace('# ', ''))}
        </h1>
      );
      continue;
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***') {
      renderedElements.push(<hr key={idx} className="my-4 border-zinc-200 dark:border-zinc-800" />);
      continue;
    }

    // Unordered list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const listText = trimmed.replace(/^[-*•]\s+/, '');
      renderedElements.push(
        <div key={idx} className="flex items-start gap-2 ml-2 my-1">
          <span className="text-blue-500 font-bold mt-0.5">•</span>
          <span className="text-zinc-800 dark:text-zinc-200">{formatInline(listText)}</span>
        </div>
      );
      continue;
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      renderedElements.push(
        <div key={idx} className="flex items-start gap-2 ml-2 my-1">
          <span className="font-semibold text-blue-500 dark:text-blue-400 shrink-0">{numMatch[1]}.</span>
          <span className="text-zinc-800 dark:text-zinc-200">{formatInline(numMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Regular paragraph
    renderedElements.push(
      <p key={idx} className="text-zinc-800 dark:text-zinc-200 my-1">
        {formatInline(line)}
      </p>
    );
  }

  if (tableBuffer.length > 0) {
    flushTable();
  }

  return <>{renderedElements}</>;
};

// Formats **bold**, *italic*, `code` inline
function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-zinc-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-zinc-700 dark:text-zinc-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-pink-600 dark:text-pink-400 font-mono text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
