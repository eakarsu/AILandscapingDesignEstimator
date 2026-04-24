import React from 'react';

function AIResponseDisplay({ content, title }) {
  if (!content) return null;

  // Parse the AI response into sections
  const formatContent = (text) => {
    const lines = text.split('\n');
    const sections = [];
    let currentSection = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      // Detect headers (## or ** or numbered sections like "1.")
      if (trimmed.startsWith('## ') || trimmed.startsWith('### ') || trimmed.startsWith('# ')) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, ''),
          content: []
        };
      } else if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: trimmed.replace(/\*\*/g, ''),
          content: []
        };
      } else if (currentSection) {
        if (trimmed) currentSection.content.push(line);
      } else {
        if (trimmed) {
          if (!currentSection) {
            currentSection = { title: '', content: [line] };
          }
        }
      }
    });

    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const sections = formatContent(content);

  const formatText = (text) => {
    // Bold text
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic text
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Bullet points
    if (formatted.trim().startsWith('- ') || formatted.trim().startsWith('• ')) {
      formatted = `<span style="display:flex;gap:8px;margin:2px 0"><span style="color:#7c3aed">●</span><span>${formatted.replace(/^[\s]*[-•]\s*/, '')}</span></span>`;
    }
    // Numbered lists
    const numMatch = formatted.trim().match(/^(\d+)[.)]\s*(.*)/);
    if (numMatch) {
      formatted = `<span style="display:flex;gap:8px;margin:2px 0"><span style="color:#7c3aed;font-weight:700;min-width:20px">${numMatch[1]}.</span><span>${numMatch[2]}</span></span>`;
    }
    return formatted;
  };

  return (
    <div className="ai-response">
      <h3>
        <span style={{ fontSize: '24px' }}>✨</span>
        {title || 'AI Analysis & Recommendations'}
      </h3>
      {sections.length > 0 ? (
        sections.map((section, idx) => (
          <div key={idx} className="ai-section">
            {section.title && (
              <div className="ai-section-title">{section.title}</div>
            )}
            <div className="ai-section-content">
              {section.content.map((line, lineIdx) => (
                <div
                  key={lineIdx}
                  dangerouslySetInnerHTML={{ __html: formatText(line) }}
                  style={{ marginBottom: '4px' }}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="ai-section">
          <div className="ai-section-content" style={{ whiteSpace: 'pre-wrap' }}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIResponseDisplay;
