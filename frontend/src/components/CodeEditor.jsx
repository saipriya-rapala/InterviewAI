import { useRef } from "react";

// Keywords by language family
const KEYWORDS = new Set([
  "def", "class", "return", "if", "else", "elif", "for", "while", "in",
  "import", "from", "as", "try", "except", "finally", "with", "self",
  "function", "const", "let", "var", "public", "private", "protected",
  "static", "void", "int", "boolean", "bool", "char", "String", "float",
  "double", "new", "null", "true", "false", "None", "True", "False",
  "pass", "struct", "include", "vector", "std", "using", "namespace",
  "break", "continue", "switch", "case", "default", "yield", "async", "await"
]);

export function highlightLine(line, language) {
  if (!line && line !== "") return null;

  // 1. Detect comment start
  let commentIdx = -1;

  if (language === "Python") {
    const hash = line.indexOf("#");
    const slash = line.indexOf("//");
    if (hash !== -1 && slash !== -1) {
      commentIdx = Math.min(hash, slash);
    } else if (hash !== -1) {
      commentIdx = hash;
    } else if (slash !== -1) {
      commentIdx = slash;
    }
  } else {
    const slash = line.indexOf("//");
    const hash = line.indexOf("#");
    if (slash !== -1) {
      commentIdx = slash;
    } else if (hash !== -1) {
      commentIdx = hash;
    }
  }

  let codeText = line;
  let commentText = "";

  if (commentIdx !== -1) {
    codeText = line.substring(0, commentIdx);
    commentText = line.substring(commentIdx);
  }

  // Tokenize code portion
  const tokens = [];
  let i = 0;
  const len = codeText.length;

  while (i < len) {
    const char = codeText[i];

    // String literals
    if (char === '"' || char === "'" || char === "`") {
      const quote = char;
      let j = i + 1;
      while (j < len && codeText[j] !== quote) {
        if (codeText[j] === "\\" && j + 1 < len) j++;
        j++;
      }
      tokens.push({
        type: "string",
        text: codeText.substring(i, Math.min(len, j + 1))
      });
      i = j + 1;
      continue;
    }

    // Numbers
    if (/[0-9]/.test(char) && (i === 0 || /[^a-zA-Z0-9_]/.test(codeText[i - 1]))) {
      let j = i;
      while (j < len && /[0-9.]/.test(codeText[j])) j++;
      tokens.push({
        type: "number",
        text: codeText.substring(i, j)
      });
      i = j;
      continue;
    }

    // Word (keyword or identifier)
    if (/[a-zA-Z_]/.test(char)) {
      let j = i;
      while (j < len && /[a-zA-Z0-9_]/.test(codeText[j])) j++;
      const word = codeText.substring(i, j);
      tokens.push({
        type: KEYWORDS.has(word) ? "keyword" : "identifier",
        text: word
      });
      i = j;
      continue;
    }

    // Whitespace or symbols
    tokens.push({
      type: "symbol",
      text: char
    });
    i++;
  }

  return (
    <>
      {tokens.map((tok, tokIdx) => {
        if (tok.type === "keyword") {
          return (
            <span key={tokIdx} className="text-purple-400 font-semibold">
              {tok.text}
            </span>
          );
        }
        if (tok.type === "string") {
          return (
            <span key={tokIdx} className="text-amber-300">
              {tok.text}
            </span>
          );
        }
        if (tok.type === "number") {
          return (
            <span key={tokIdx} className="text-orange-300">
              {tok.text}
            </span>
          );
        }
        if (tok.type === "symbol") {
          return (
            <span key={tokIdx} className="text-slate-400">
              {tok.text}
            </span>
          );
        }
        // Identifier / code
        return (
          <span key={tokIdx} className="text-sky-200">
            {tok.text}
          </span>
        );
      })}

      {/* DISTINCT COMMENT COLOR */}
      {commentText && (
        <span className="text-emerald-400/90 italic font-mono font-medium">
          {commentText}
        </span>
      )}
    </>
  );
}

export default function CodeEditor({
  code,
  onChange,
  language = "Python",
  themeBg = "bg-[#0d1117]"
}) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);

  const lines = code.split("\n");

  const handleScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  return (
    <div className={`relative flex flex-1 min-h-[420px] ${themeBg} rounded-b-none overflow-hidden transition-colors duration-200`}>
      {/* Line Numbers Gutter */}
      <div className="select-none py-4 pl-3 pr-3 text-right bg-slate-950/40 border-r border-slate-800/80 font-mono text-xs leading-6 text-slate-600 shrink-0">
        {lines.map((_, idx) => (
          <div key={idx} className="h-6 leading-6">
            {idx + 1}
          </div>
        ))}
      </div>

      {/* Editor Body with Syntax Highlighted Overlay */}
      <div className="relative flex-1 h-full overflow-hidden">
        {/* Highlighted Syntax Layer (underneath) */}
        <pre
          ref={preRef}
          aria-hidden="true"
          className="absolute inset-0 m-0 p-4 font-mono text-xs sm:text-sm leading-6 whitespace-pre overflow-hidden pointer-events-none select-none text-sky-200"
        >
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="h-6 leading-6">
                {highlightLine(line, language)}
                {/* Ensure empty line keeps vertical height */}
                {line === "" && "\u00A0"}
              </div>
            ))}
          </code>
        </pre>

        {/* Real Transparent Editable Textarea (on top) */}
        <textarea
          ref={textareaRef}
          rows={Math.max(16, lines.length + 2)}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          spellCheck={false}
          placeholder="// Type your solution here..."
          className="absolute inset-0 w-full h-full m-0 p-4 bg-transparent text-transparent caret-white selection:bg-indigo-500/40 focus:outline-none font-mono text-xs sm:text-sm leading-6 whitespace-pre resize-none overflow-auto tracking-normal"
        />
      </div>
    </div>
  );
}
