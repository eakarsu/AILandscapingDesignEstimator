import React, { useEffect, useState } from 'react';
export default function PlantSurvivabilityZoneCheck() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/plant-survivability-zone-check').then(r => r.json()).then(setData).catch(() => {}); }, []);
  return <div><h1>Plant Survivability Zone Check</h1><p>Flags landscaping plant selections that do not match site hardiness conditions.</p>{data?.plants?.map(p => <section className="card" key={p.plant}><h2>{p.plant}</h2><p>{p.status} - {p.note}</p></section>)}</div>;
}
