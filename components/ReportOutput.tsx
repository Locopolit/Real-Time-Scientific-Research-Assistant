import React, { useMemo } from 'react';

interface ReportOutputProps {
  report: string;
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const formattedContent = useMemo(() => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-cyan-300 mt-4 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-cyan-400 mt-6 mb-3 border-b border-cyan-800 pb-2">{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-extrabold text-white mt-2 mb-4">{line.substring(2)}</h1>;
        }
        if (line.startsWith('* ')) {
          return <li key={index} className="ml-6 list-disc text-gray-300">{line.substring(2)}</li>;
        }
        if (line.trim() === '') {
            return <br key={index} />;
        }
        return <p key={index} className="text-gray-300 leading-relaxed my-2">{line}</p>;
      })
      .reduce((acc, el, index) => {
        // FIX: The original logic had a type error because the accumulator could contain strings.
        // This refactored logic correctly groups consecutive <li> elements into a single <ul>
        // and uses the correct type for the accumulator.
        if (React.isValidElement(el) && el.type === 'li') {
          const lastElement = acc.length > 0 ? acc[acc.length - 1] : null;
          // If the last element was a UL, append this LI to it.
          if (lastElement && React.isValidElement(lastElement) && lastElement.type === 'ul') {
            const children = Array.isArray(lastElement.props.children)
              ? [...lastElement.props.children, el]
              : [lastElement.props.children, el];
            acc[acc.length - 1] = <ul key={lastElement.key}>{children}</ul>;
          } else {
            // Otherwise, create a new UL for this LI.
            acc.push(<ul key={`ul-${index}`} className="my-3">{el}</ul>);
          }
        } else {
          acc.push(el);
        }
        return acc;
      }, [] as JSX.Element[]);
  }, [content]);

  return <>{formattedContent}</>;
};

export const ReportOutput: React.FC<ReportOutputProps> = ({ report }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-6">Synthesized Research Report</h2>
      <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-cyan-400">
        <MarkdownRenderer content={report} />
      </div>
    </div>
  );
};
