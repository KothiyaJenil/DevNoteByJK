import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  title,
  showLineNumbers = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] text-slate-100 shadow-xl transition-all hover:border-slate-700">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 py-2.5 text-xs font-medium text-slate-400">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-emerald-400" />
          <span className="font-mono font-semibold text-slate-200">{title || language.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded bg-slate-800/90 px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-400">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md border border-slate-700/60 bg-slate-800/70 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            title="Copy snippet"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="relative overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30">
                {showLineNumbers && (
                  <td className="w-10 select-none border-r border-slate-800/50 pr-4 text-right text-xs font-normal text-slate-600">
                    {idx + 1}
                  </td>
                )}
                <td className="pl-4 text-slate-200 whitespace-pre">
                  {highlightSyntax(line, language)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Clean lightweight syntax highlighter for JS/TS/SQL/HTML/Bash/Python
function highlightSyntax(line: string, lang: string): React.ReactNode {
  if (!line) return ' ';

  // Match comments first
  if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }

  // General tokenization rule
  const words = line.split(/(\s+|[(){}[\];,.<>=:+\-*/!&|])/);

  const keywords = new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'import', 'export', 'from',
    'async', 'await', 'try', 'catch', 'throw', 'new', 'class', 'module', 'exports', 'require',
    'def', 'class', 'self', 'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'public',
    'private', 'interface', 'type', 'enum', 'extends', 'implements', 'typeof', 'instanceof'
  ]);

  const builtins = new Set([
    'req', 'res', 'next', 'express', 'Router', 'z', 'mongoose', 'Schema', 'User', 'jwt',
    'bcrypt', 'console', 'process', 'Promise', 'Array', 'Object', 'String', 'Boolean', 'Number'
  ]);

  return (
    <>
      {words.map((token, i) => {
        if (keywords.has(token)) {
          return <span key={i} className="text-purple-400 font-semibold">{token}</span>;
        }
        if (builtins.has(token)) {
          return <span key={i} className="text-cyan-300 font-medium">{token}</span>;
        }
        if (/^['"`].*['"`]$/.test(token) || (token.startsWith("'") || token.startsWith('"') || token.startsWith('`'))) {
          return <span key={i} className="text-emerald-300">{token}</span>;
        }
        if (/^\d+$/.test(token)) {
          return <span key={i} className="text-amber-400">{token}</span>;
        }
        if (token.startsWith('//') || token.startsWith('/*')) {
          return <span key={i} className="text-slate-500 italic">{token}</span>;
        }
        return <span key={i}>{token}</span>;
      })}
    </>
  );
}
