import React, { useState, useEffect } from 'react';

// This will be filled in once we know which path = which province
const PATH_TO_PROVINCE = {
  // Will be mapped after visual identification
};

const PROVINCE_DATA = {
  // KYUSHU
  satsuma: { name: 'Satsuma', resource: 'smithing', neighbors: ['osumi', 'higo'] },
  osumi: { name: 'Osumi', resource: null, neighbors: ['satsuma', 'hyuga'] },
  hyuga: { name: 'Hyuga', resource: 'farming', neighbors: ['osumi', 'higo', 'bungo'] },
  higo: { name: 'Higo', resource: 'horses', neighbors: ['satsuma', 'hyuga', 'bungo', 'chikugo', 'hizen'] },
  bungo: { name: 'Bungo', resource: 'naval', neighbors: ['hyuga', 'higo', 'buzen', 'chikugo'] },
  buzen: { name: 'Buzen', resource: 'craftwork', neighbors: ['bungo', 'chikugo', 'chikuzen', 'nagato'] },
  chikugo: { name: 'Chikugo', resource: 'farming', neighbors: ['higo', 'bungo', 'buzen', 'chikuzen', 'hizen'] },
  chikuzen: { name: 'Chikuzen', resource: 'philosophical', neighbors: ['buzen', 'chikugo', 'hizen', 'nagato'] },
  hizen: { name: 'Hizen', resource: 'naval', neighbors: ['higo', 'chikugo', 'chikuzen'] },
  iki: { name: 'Iki', resource: 'naval', neighbors: ['hizen'] },
  tsushima: { name: 'Tsushima', resource: 'naval', neighbors: ['hizen'] },
  
  // SHIKOKU
  tosa: { name: 'Tosa', resource: 'forest', neighbors: ['iyo', 'sanuki', 'awa_shikoku'] },
  iyo: { name: 'Iyo', resource: 'farming', neighbors: ['tosa', 'sanuki'] },
  sanuki: { name: 'Sanuki', resource: 'stone', neighbors: ['tosa', 'iyo', 'awa_shikoku'] },
  awa_shikoku: { name: 'Awa (Shikoku)', resource: 'horses', neighbors: ['tosa', 'sanuki'] },
  
  // CHUGOKU
  nagato: { name: 'Nagato', resource: 'farming', neighbors: ['suo', 'iwami', 'buzen'] },
  suo: { name: 'Suo', resource: 'horses', neighbors: ['nagato', 'aki', 'iwami'] },
  aki: { name: 'Aki', resource: 'hallowed', neighbors: ['suo', 'bingo', 'iwami'] },
  bingo: { name: 'Bingo', resource: 'naval', neighbors: ['aki', 'bitchu', 'izumo', 'hoki', 'mimasaka'] },
  bitchu: { name: 'Bitchu', resource: 'farming', neighbors: ['bingo', 'bizen', 'mimasaka'] },
  bizen: { name: 'Bizen', resource: 'smithing', neighbors: ['bitchu', 'mimasaka', 'harima'] },
  mimasaka: { name: 'Mimasaka', resource: 'iron', neighbors: ['bitchu', 'bizen', 'bingo', 'hoki', 'harima', 'inaba'] },
  iwami: { name: 'Iwami', resource: 'gold', neighbors: ['nagato', 'suo', 'aki', 'izumo'] },
  izumo: { name: 'Izumo', resource: 'farming', neighbors: ['iwami', 'bingo', 'hoki'] },
  hoki: { name: 'Hoki', resource: 'craftwork', neighbors: ['izumo', 'bingo', 'mimasaka', 'inaba'] },
  inaba: { name: 'Inaba', resource: 'naval', neighbors: ['hoki', 'mimasaka', 'harima', 'tajima'] },
  oki: { name: 'Oki', resource: 'farming', neighbors: ['izumo'] },
  
  // KINAI
  harima: { name: 'Harima', resource: null, neighbors: ['bizen', 'mimasaka', 'inaba', 'tajima', 'tamba', 'settsu'] },
  tajima: { name: 'Tajima', resource: 'farming', neighbors: ['inaba', 'harima', 'tamba', 'tango'] },
  tamba: { name: 'Tamba', resource: 'farming', neighbors: ['tajima', 'harima', 'settsu', 'yamashiro', 'tango', 'wakasa'] },
  tango: { name: 'Tango', resource: 'farming', neighbors: ['tajima', 'tamba', 'wakasa'] },
  settsu: { name: 'Settsu', resource: 'philosophical', neighbors: ['harima', 'tamba', 'kawachi', 'yamashiro', 'yamato', 'izumi'] },
  kawachi: { name: 'Kawachi', resource: 'farming', neighbors: ['settsu', 'yamato', 'kii', 'izumi'] },
  yamashiro: { name: 'Yamashiro', resource: 'philosophical', neighbors: ['tamba', 'settsu', 'omi', 'yamato', 'wakasa', 'iga'], special: 'capital' },
  yamato: { name: 'Yamato', resource: 'hallowed', neighbors: ['yamashiro', 'settsu', 'kawachi', 'kii', 'iga', 'ise'] },
  kii: { name: 'Kii', resource: 'forest', neighbors: ['kawachi', 'yamato', 'iga', 'ise', 'izumi'] },
  iga: { name: 'Iga', resource: 'ninja', neighbors: ['yamato', 'kii', 'ise', 'omi', 'yamashiro'] },
  izumi: { name: 'Izumi', resource: 'farming', neighbors: ['kawachi', 'kii', 'settsu'] },
  awaji: { name: 'Awaji', resource: 'fishing', neighbors: ['settsu'] },
  
  // TOKAI
  omi: { name: 'Omi', resource: 'farming', neighbors: ['yamashiro', 'iga', 'ise', 'mino', 'wakasa', 'echizen'] },
  wakasa: { name: 'Wakasa', resource: 'farming', neighbors: ['tango', 'tamba', 'yamashiro', 'omi', 'echizen'] },
  echizen: { name: 'Echizen', resource: 'craftwork', neighbors: ['wakasa', 'omi', 'mino', 'kaga', 'hida'] },
  ise: { name: 'Ise', resource: 'hallowed', neighbors: ['iga', 'omi', 'mino', 'owari', 'kii', 'yamato', 'shima'] },
  shima: { name: 'Shima', resource: 'naval', neighbors: ['ise'] },
  mino: { name: 'Mino', resource: 'farming', neighbors: ['omi', 'echizen', 'ise', 'owari', 'hida', 'shinano'] },
  owari: { name: 'Owari', resource: null, neighbors: ['ise', 'mino', 'mikawa', 'shinano'] },
  mikawa: { name: 'Mikawa', resource: 'horses', neighbors: ['owari', 'totomi', 'shinano'] },
  totomi: { name: 'Totomi', resource: 'farming', neighbors: ['mikawa', 'suruga', 'shinano'] },
  suruga: { name: 'Suruga', resource: 'philosophical', neighbors: ['totomi', 'izu', 'kai', 'shinano'] },
  izu: { name: 'Izu', resource: 'gold', neighbors: ['suruga', 'sagami'] },
  
  // HOKURIKU
  kaga: { name: 'Kaga', resource: 'smithing', neighbors: ['echizen', 'noto', 'etchu', 'hida'] },
  noto: { name: 'Noto', resource: 'farming', neighbors: ['kaga', 'etchu'] },
  etchu: { name: 'Etchu', resource: 'farming', neighbors: ['kaga', 'noto', 'hida', 'echigo', 'shinano'] },
  hida: { name: 'Hida', resource: 'forest', neighbors: ['echizen', 'kaga', 'etchu', 'mino', 'shinano'] },
  
  // SHINANO & KAI
  shinano: { name: 'Shinano', resource: 'stone', neighbors: ['mino', 'owari', 'mikawa', 'totomi', 'suruga', 'kai', 'hida', 'etchu', 'echigo', 'kozuke', 'musashi'] },
  kai: { name: 'Kai', resource: 'horses', neighbors: ['suruga', 'shinano', 'sagami', 'musashi'] },
  
  // KANTO
  sagami: { name: 'Sagami', resource: 'smithing', neighbors: ['izu', 'kai', 'musashi'] },
  musashi: { name: 'Musashi', resource: 'farming', neighbors: ['sagami', 'kai', 'kozuke', 'shimotsuke', 'shimosa', 'kazusa', 'shinano'] },
  kozuke: { name: 'Kozuke', resource: 'philosophical', neighbors: ['shinano', 'musashi', 'shimotsuke', 'echigo'] },
  shimotsuke: { name: 'Shimotsuke', resource: 'hallowed', neighbors: ['kozuke', 'musashi', 'shimosa', 'hitachi', 'iwashiro'] },
  shimosa: { name: 'Shimosa', resource: 'farming', neighbors: ['musashi', 'shimotsuke', 'hitachi', 'kazusa'] },
  kazusa: { name: 'Kazusa', resource: null, neighbors: ['musashi', 'shimosa', 'awa_kanto'] },
  awa_kanto: { name: 'Awa (Kanto)', resource: 'naval', neighbors: ['kazusa'] },
  hitachi: { name: 'Hitachi', resource: 'craftwork', neighbors: ['shimotsuke', 'shimosa', 'iwashiro', 'iwaki'] },
  
  // TOHOKU
  echigo: { name: 'Echigo', resource: 'naval', neighbors: ['etchu', 'shinano', 'kozuke', 'iwashiro', 'uzen', 'ugo'] },
  sado: { name: 'Sado', resource: 'gold', neighbors: ['echigo'] },
  ugo: { name: 'Ugo', resource: 'stone', neighbors: ['echigo', 'uzen', 'rikuchu'] },
  uzen: { name: 'Uzen', resource: 'hallowed', neighbors: ['echigo', 'iwashiro', 'ugo', 'rikuzen', 'rikuchu'] },
  iwashiro: { name: 'Iwashiro', resource: 'forest', neighbors: ['shimotsuke', 'uzen', 'hitachi', 'iwaki', 'echigo'] },
  iwaki: { name: 'Iwaki', resource: 'iron', neighbors: ['hitachi', 'iwashiro', 'rikuzen'] },
  rikuzen: { name: 'Rikuzen', resource: 'naval', neighbors: ['uzen', 'iwaki', 'rikuchu'] },
  rikuchu: { name: 'Rikuchu', resource: 'horses', neighbors: ['ugo', 'uzen', 'rikuzen', 'mutsu'] },
  mutsu: { name: 'Mutsu', resource: 'smithing', neighbors: ['rikuchu'] },
};

const CLANS = {
  shimazu: { id: 'shimazu', name: 'Shimazu', color: '#DC2626', provinces: ['satsuma', 'osumi'] },
  chosokabe: { id: 'chosokabe', name: 'Chōsokabe', color: '#F59E0B', provinces: ['tosa'] },
  mori: { id: 'mori', name: 'Mōri', color: '#059669', provinces: ['aki', 'suo', 'nagato'] },
  oda: { id: 'oda', name: 'Oda', color: '#3B82F6', provinces: ['owari'] },
  takeda: { id: 'takeda', name: 'Takeda', color: '#7C3AED', provinces: ['kai'] },
  uesugi: { id: 'uesugi', name: 'Uesugi', color: '#0891B2', provinces: ['echigo'] },
  hojo: { id: 'hojo', name: 'Hōjō', color: '#DB2777', provinces: ['sagami', 'izu', 'musashi'] },
  date: { id: 'date', name: 'Date', color: '#4F46E5', provinces: ['mutsu', 'rikuchu'] },
  tokugawa: { id: 'tokugawa', name: 'Tokugawa', color: '#65A30D', provinces: ['mikawa'] },
  imagawa: { id: 'imagawa', name: 'Imagawa', color: '#EA580C', provinces: ['suruga', 'totomi'] },
  uncontrolled: { id: 'uncontrolled', name: 'Neutral', color: '#78716c', provinces: [] },
};

const RESOURCES = {
  smithing: { icon: '⚔️', name: 'Smithing' },
  horses: { icon: '🐎', name: 'Horses' },
  gold: { icon: '💰', name: 'Gold' },
  iron: { icon: '⛏️', name: 'Iron' },
  farming: { icon: '🌾', name: 'Farming' },
  naval: { icon: '⚓', name: 'Naval' },
  craftwork: { icon: '🏺', name: 'Craftwork' },
  ninja: { icon: '🥷', name: 'Ninja' },
  hallowed: { icon: '⛩️', name: 'Sacred' },
  philosophical: { icon: '📜', name: 'Learning' },
  forest: { icon: '🌲', name: 'Timber' },
  stone: { icon: '🪨', name: 'Stone' },
  fishing: { icon: '🐟', name: 'Fishing' },
};

export default function SengokuMap() {
  const [svgContent, setSvgContent] = useState('');
  const [pathData, setPathData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [showNumbers, setShowNumbers] = useState(true);
  const [provinces, setProvinces] = useState(() => {
    const init = {};
    Object.entries(PROVINCE_DATA).forEach(([id, p]) => {
      let owner = 'uncontrolled';
      Object.entries(CLANS).forEach(([cid, c]) => {
        if (c.provinces?.includes(id)) owner = cid;
      });
      init[id] = { ...p, id, owner, armies: owner !== 'uncontrolled' ? 1 : 0 };
    });
    return init;
  });
  const [clan, setClan] = useState('oda');
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    fetch('/japan-provinces.svg')
      .then(res => res.text())
      .then(svg => {
        setSvgContent(svg);
        
        // Parse and extract paths
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const paths = doc.querySelectorAll('path');
        
        const extracted = [];
        paths.forEach((path, index) => {
          const d = path.getAttribute('d');
          const id = path.getAttribute('id');
          const style = path.getAttribute('style') || '';
          
          // Skip empty paths or water/decoration paths
          if (!d || d.trim() === '' || style.includes('fill:#daf0fd')) return;
          
          // Calculate center point for label
          const bbox = estimateBBox(d);
          
          extracted.push({
            index: extracted.length,
            id,
            d,
            centerX: bbox.centerX,
            centerY: bbox.centerY,
            style
          });
        });
        
        setPathData(extracted);
      });
  }, []);

  // Rough bbox estimation from path data
  function estimateBBox(d) {
    const numbers = d.match(/-?\d+\.?\d*/g) || [];
    const coords = [];
    for (let i = 0; i < numbers.length - 1; i += 2) {
      coords.push({ x: parseFloat(numbers[i]), y: parseFloat(numbers[i + 1]) });
    }
    if (coords.length === 0) return { centerX: 0, centerY: 0 };
    
    const xs = coords.map(c => c.x);
    const ys = coords.map(c => c.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    return {
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
  }

  const getProvinceId = (pathIndex) => PATH_TO_PROVINCE[pathIndex] || null;
  
  const getColor = (pathIndex) => {
    const provId = getProvinceId(pathIndex);
    if (!provId || !provinces[provId]) return '#a8a29e'; // neutral stone color
    return CLANS[provinces[provId].owner]?.color || '#78716c';
  };

  const handleClick = (index) => {
    const provId = getProvinceId(index);
    if (provId) {
      setSelected(provId);
    } else {
      setSelected(null);
      console.log(`Clicked path index: ${index}, pathId: ${pathData[index]?.id}`);
    }
  };

  const changeOwner = (id, newOwner) => {
    setProvinces({ ...provinces, [id]: { ...provinces[id], owner: newOwner } });
  };

  return (
    <div className="w-full h-screen bg-slate-900 flex">
      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-slate-900 to-transparent z-10 flex items-center px-4 gap-4">
          <h1 className="text-2xl font-bold" style={{ color: '#C9A227', fontFamily: 'serif' }}>
            戦国 <span className="text-lg text-slate-300">SENGOKU</span>
          </h1>
          <div className="flex-1" />
          <label className="flex items-center gap-2 text-slate-300 text-sm">
            <input 
              type="checkbox" 
              checked={showNumbers} 
              onChange={e => setShowNumbers(e.target.checked)}
              className="rounded"
            />
            Show Numbers (for mapping)
          </label>
          <select
            value={clan}
            onChange={e => setClan(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm"
            style={{ color: CLANS[clan]?.color }}
          >
            {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
              <option key={id} value={id} style={{ color: '#fff', background: '#1e293b' }}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={() => setAdmin(!admin)}
            className={`px-3 py-1 rounded text-sm ${admin ? 'bg-red-800 text-red-200' : 'bg-slate-700 text-slate-300'}`}
          >
            {admin ? '🔓 Admin' : '🔒'}
          </button>
        </div>

        {/* SVG Map */}
        <svg
          viewBox="0 0 732 777"
          className="w-full h-full"
          style={{ background: 'linear-gradient(180deg, #0c1929 0%, #020617 100%)' }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Province paths */}
          {pathData.map((path, idx) => {
            const isSelected = getProvinceId(idx) === selected;
            const isHovered = hovered === idx;
            const provId = getProvinceId(idx);
            const hasProv = !!provId;
            
            return (
              <g key={path.id || idx}>
                <path
                  d={path.d}
                  fill={hasProv ? getColor(idx) : '#a8a29e'}
                  fillOpacity={isSelected ? 0.95 : isHovered ? 0.85 : 0.65}
                  stroke={isSelected ? '#fbbf24' : isHovered ? '#e2e8f0' : '#475569'}
                  strokeWidth={isSelected ? 2 : 1}
                  filter={isSelected ? 'url(#glow)' : undefined}
                  style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                  onClick={() => handleClick(idx)}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                />
                {/* Number label for identification */}
                {showNumbers && (
                  <text
                    x={path.centerX}
                    y={path.centerY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#000"
                    stroke="#fff"
                    strokeWidth="2"
                    paintOrder="stroke"
                    style={{ pointerEvents: 'none' }}
                  >
                    {idx}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-800/90 rounded-lg border border-slate-600 p-3 z-10">
          <p className="text-slate-400 text-xs mb-2">Clans</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
              <div key={id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-xs text-slate-300">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        {showNumbers && (
          <div className="absolute bottom-4 right-4 bg-amber-900/90 rounded-lg border border-amber-600 p-3 z-10 max-w-xs">
            <p className="text-amber-200 text-sm font-bold mb-1">🗺️ Province Mapping Mode</p>
            <p className="text-amber-100 text-xs">
              Each province shows a number. Click provinces to see their number in the console. 
              List which number = which province name, and I'll update the mapping!
            </p>
          </div>
        )}
      </div>

      {/* Side Panel */}
      {selected && provinces[selected] && (
        <div className="w-72 bg-slate-800 border-l border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700" style={{ background: `linear-gradient(135deg, ${CLANS[provinces[selected].owner]?.color}40, transparent)` }}>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'serif' }}>
              {provinces[selected].name}
              {PROVINCE_DATA[selected]?.special === 'capital' && ' 👑'}
            </h2>
            <p className="text-sm text-slate-300">
              Owner: <span style={{ color: CLANS[provinces[selected].owner]?.color }}>
                {CLANS[provinces[selected].owner]?.name}
              </span>
            </p>
          </div>
          
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {PROVINCE_DATA[selected]?.resource && (
              <div className="flex items-center gap-2 p-2 bg-slate-700/50 rounded">
                <span className="text-xl">{RESOURCES[PROVINCE_DATA[selected].resource]?.icon}</span>
                <span className="text-white">{RESOURCES[PROVINCE_DATA[selected].resource]?.name}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-slate-400">Armies:</span>
              <span className="text-white font-bold">{provinces[selected].armies}</span>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-1">Borders:</p>
              <div className="flex flex-wrap gap-1">
                {PROVINCE_DATA[selected]?.neighbors?.map(n => (
                  <button
                    key={n}
                    onClick={() => provinces[n] && setSelected(n)}
                    className="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                  >
                    {PROVINCE_DATA[n]?.name || n}
                  </button>
                ))}
              </div>
            </div>

            {admin && (
              <div className="pt-3 border-t border-slate-600">
                <p className="text-red-400 text-xs mb-1">Admin: Change Owner</p>
                <select
                  value={provinces[selected].owner}
                  onChange={e => changeOwner(selected, e.target.value)}
                  className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600"
                >
                  {Object.entries(CLANS).map(([id, c]) => (
                    <option key={id} value={id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
