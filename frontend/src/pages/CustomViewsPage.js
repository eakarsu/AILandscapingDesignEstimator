import React from 'react';
import CostBreakdownChart from '../components/customViews/CostBreakdownChart';
import ZoneSuitabilityHeatmap from '../components/customViews/ZoneSuitabilityHeatmap';
import DesignQuotePdf from '../components/customViews/DesignQuotePdf';
import RulesEditor from '../components/customViews/RulesEditor';

export default function CustomViewsPage() {
  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 28, color: '#1a4a2e', marginBottom: 4 }}>Landscape Views</h1>
        <p style={{ color: '#52606d' }}>Custom visualizations and tools for landscape design and estimation.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
        <CostBreakdownChart />
        <ZoneSuitabilityHeatmap />
        <DesignQuotePdf />
        <RulesEditor />
      </div>
    </div>
  );
}
