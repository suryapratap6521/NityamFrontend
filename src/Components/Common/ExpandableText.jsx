// ExpandableText.js
import React, { useState } from "react";

const ExpandableText = ({ text, threshold = 100, className = "" }) => {
  const [expanded, setExpanded] = useState(false);

  // If text is short, display it fully.
  if (!text || text.length <= threshold) {
    return <span className={className}>{text}</span>;
  }

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <span className={className}>
      {expanded ? text : text.substring(0, threshold) + '... '}
      <button onClick={toggleExpand} className="text-blue-500 hover:underline">
        {expanded ? 'Show less' : 'More'}
      </button>
    </span>
  );
};

export default ExpandableText;
