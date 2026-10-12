import React from 'react';
import AIReport from './AIReport';

export default function AIResponseDisplay({ content, title }) {
  return <AIReport response={content} title={title || 'AI Analysis & Recommendations'} />;
}
