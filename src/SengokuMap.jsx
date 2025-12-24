import React, { useState, useEffect, useRef } from 'react';

// Province data - we'll map these to the SVG paths
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
  
  // SHIKOKU
  tosa: { name: 'Tosa', resource: 'forest', neighbors: ['iyo', 'sanuki', 'awa_shikoku'] },
  iyo: { name: 'Iyo', resource: 'farming', neighbors: ['tosa', 'sanuki'] },
  sanuki: { name: 'Sanuki', resource: 'stone', neighbors: ['tosa', 'iyo', 'awa_shikoku'] },
  awa_shikoku: { name: 'Awa', resource: 'horses', neighbors: ['tosa', 'sanuki'] },
  
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
  
  // KINAI
  harima: { name: 'Harima', resource: null, neighbors: ['bizen', 'mimasaka', 'inaba', 'tajima', 'tamba', 'settsu'] },
  tajima: { name: 'Tajima', resource: 'farming', neighbors: ['inaba', 'harima', 'tamba', 'tango'] },
  tamba: { name: 'Tamba', resource: 'farming', neighbors: ['tajima', 'harima', 'settsu', 'yamashiro', 'tango', 'wakasa'] },
  tango: { name: 'Tango', resource: 'farming', neighbors: ['tajima', 'tamba', 'wakasa'] },
  settsu: { name: 'Settsu', resource: 'philosophical', neighbors: ['harima', 'tamba', 'kawachi', 'yamashiro', 'yamato', 'izumi'] },
  kawachi: { name: 'Kawachi', resource: 'farming', neighbors: ['settsu', 'yamato', 'kii', 'izumi'] },
  yamashiro: { name: 'Yamashiro', resource: 'philosophical', neighbors: ['tamba', 'settsu', 'omi', 'yamato', 'wakasa', 'iga'], special: 'capital' },
  yamato: { name: 'Yamato', resource: 'hallowed', neighbors: ['yamashiro', 'settsu', 'kawachi', 'kii', 'iga', 'ise'] },
  kii: { name: 'Kii', resource: 'ninja', neighbors: ['kawachi', 'yamato', 'iga', 'ise', 'izumi'] },
  iga: { name: 'Iga', resource: 'ninja', neighbors: ['yamato', 'kii', 'ise', 'omi', 'yamashiro'] },
  izumi: { name: 'Izumi', resource: 'farming', neighbors: ['kawachi', 'kii', 'settsu'] },
  
  // TOKAI
  omi: { name: 'Omi', resource: 'ninja', neighbors: ['yamashiro', 'iga', 'ise', 'mino', 'wakasa', 'echizen'] },
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
  awa_kanto: { name: 'Awa', resource: 'naval', neighbors: ['kazusa'] },
  hitachi: { name: 'Hitachi', resource: 'craftwork', neighbors: ['shimotsuke', 'shimosa', 'iwashiro', 'iwaki'] },
  
  // TOHOKU
  echigo: { name: 'Echigo', resource: 'naval', neighbors: ['etchu', 'shinano', 'kozuke', 'iwashiro', 'uzen', 'ugo', 'sado'] },
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
};

export default function SengokuMap() {
  const svgRef = useRef(null);
  const [provinces, setProvinces] = useState(() => {
    const init = {};
    Object.entries(PROVINCE_DATA).forEach(([id, p]) => {
      let owner = 'uncontrolled';
      Object.entries(CLANS).forEach(([cid, c]) => {
        if (c.provinces?.includes(id)) owner = cid;
      });
      init[id] = { ...p, id, owner, armies: owner !== 'uncontrolled' ? 1 : 0, buildings: [] };
    });
    return init;
  });
  
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [week] = useState(1);
  const [admin, setAdmin] = useState(false);
  const [clan, setClan] = useState('oda');
  const [svgContent, setSvgContent] = useState('');
  const [provinceElements, setProvinceElements] = useState([]);

  // Load and process the SVG
  useEffect(() => {
    fetch('/japan-provinces.svg')
      .then(res => res.text())
      .then(svg => {
        setSvgContent(svg);
      });
  }, []);

  // Extract province groups from SVG once loaded
  useEffect(() => {
    if (!svgContent) return;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const groups = doc.querySelectorAll('g[id^="g"]');
    
    const elements = [];
    groups.forEach((g, index) => {
      const transform = g.getAttribute('transform') || '';
      const paths = g.querySelectorAll('path');
      if (paths.length > 0) {
        const pathsData = Array.from(paths).map(p => ({
          d: p.getAttribute('d'),
          style: p.getAttribute('style')
        }));
        elements.push({
          id: g.id,
          index,
          transform,
          paths: pathsData
        });
      }
    });
    
    setProvinceElements(elements);
  }, [svgContent]);

  // Map SVG group indices to province IDs (based on position in Japan)
  // This mapping needs to match the actual SVG structure
  const svgToProvince = {
    0: 'satsuma', 1: 'osumi', 2: 'hyuga', 3: 'higo',
    4: 'bungo', 5: 'buzen', 6: 'chikugo', 7: 'chikuzen', 8: 'hizen',
    9: 'nagato', 10: 'suo', 11: 'iwami', 12: 'izumo',
    13: 'aki', 14: 'bingo', 15: 'hoki', 16: 'inaba',
    17: 'bitchu', 18: 'mimasaka', 19: 'bizen', 20: 'harima',
    21: 'tajima', 22: 'tango', 23: 'tamba', 24: 'wakasa',
    25: 'settsu', 26: 'kawachi', 27: 'izumi', 28: 'yamashiro',
    29: 'yamato', 30: 'kii', 31: 'iga', 32: 'ise', 33: 'shima',
    34: 'omi', 35: 'echizen', 36: 'kaga', 37: 'noto',
    38: 'mino', 39: 'hida', 40: 'etchu', 41: 'owari',
    42: 'mikawa', 43: 'totomi', 44: 'suruga', 45: 'izu',
    46: 'kai', 47: 'shinano', 48: 'kozuke', 49: 'shimotsuke',
    50: 'musashi', 51: 'sagami', 52: 'kazusa', 53: 'shimosa',
    54: 'awa_kanto', 55: 'hitachi', 56: 'echigo', 57: 'sado',
    58: 'ugo', 59: 'uzen', 60: 'iwashiro', 61: 'iwaki',
    62: 'rikuzen', 63: 'rikuchu', 64: 'mutsu',
    // Shikoku
    65: 'iyo', 66: 'sanuki', 67: 'awa_shikoku', 68: 'tosa',
  };

  const getColor = (provinceId) => {
    if (!provinceId || !provinces[provinceId]) return '#78716c';
    return CLANS[provinces[provinceId].owner]?.color || '#78716c';
  };

  const handleProvinceClick = (provinceId) => {
    if (provinceId && provinces[provinceId]) {
      setSelected(provinceId);
    }
  };

  const changeOwner = (id, newOwner) => {
    setProvinces({ ...provinces, [id]: { ...provinces[id], owner: newOwner } });
  };

  return (
    <div className="w-full h-screen bg-slate-900 relative overflow-hidden flex">
      {/* Main Map Area */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-slate-900 to-transparent z-10 flex items-center justify-center">
          <h1 className="text-3xl font-bold tracking-wide" style={{ color: '#C9A227', textShadow: '2px 2px 6px #000', fontFamily: 'serif' }}>
            戦国 <span className="text-xl text-slate-300 ml-2">SENGOKU</span>
          </h1>
        </div>

        {/* Controls */}
        <div className="absolute top-16 left-4 flex gap-2 z-20">
          <div className="bg-slate-800/90 backdrop-blur rounded-lg border border-slate-600 px-4 py-2">
            <p className="text-slate-400 text-xs uppercase tracking-wider">Week</p>
            <p className="text-amber-400 font-bold text-2xl">{week}</p>
          </div>
          <div className="bg-slate-800/90 backdrop-blur rounded-lg border border-slate-600 px-4 py-2">
            <p className="text-slate-400 text-xs uppercase tracking-wider">Playing As</p>
            <select
              value={clan}
              onChange={e => setClan(e.target.value)}
              className="bg-transparent font-bold text-lg cursor-pointer focus:outline-none"
              style={{ color: CLANS[clan]?.color }}
            >
              {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
                <option key={id} value={id} style={{ color: '#fff', background: '#1e293b' }}>{c.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setAdmin(!admin)}
            className={`px-4 py-2 rounded-lg border backdrop-blur transition-colors ${
              admin ? 'bg-red-900/80 border-red-500 text-red-300' : 'bg-slate-800/90 border-slate-600 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {admin ? '🔓 Admin' : '🔒 Admin'}
          </button>
        </div>

        {/* SVG Map */}
        <svg
          ref={svgRef}
          viewBox="-180 -50 780 850"
          className="w-full h-full"
          style={{ background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)' }}
        >
          {/* Water pattern */}
          <defs>
            <pattern id="water" patternUnits="userSpaceOnUse" width="60" height="60">
              <rect width="60" height="60" fill="#0c1929" />
              <circle cx="30" cy="30" r="1.5" fill="#1e3a5f" opacity="0.4" />
              <circle cx="10" cy="10" r="1" fill="#1e3a5f" opacity="0.3" />
              <circle cx="50" cy="50" r="1" fill="#1e3a5f" opacity="0.3" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <rect x="-200" y="-100" width="1000" height="1000" fill="url(#water)" />

          {/* Render province shapes */}
          {provinceElements.map((element, idx) => {
            const provinceId = svgToProvince[idx];
            const isSelected = selected === provinceId;
            const isHovered = hovered === provinceId;
            const color = getColor(provinceId);
            
            return (
              <g
                key={element.id}
                transform={element.transform}
                onClick={() => handleProvinceClick(provinceId)}
                onMouseEnter={() => setHovered(provinceId)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                {element.paths.map((path, pathIdx) => (
                  <path
                    key={pathIdx}
                    d={path.d}
                    fill={color}
                    fillOpacity={isSelected ? 0.9 : isHovered ? 0.8 : 0.6}
                    stroke={isSelected ? '#fbbf24' : isHovered ? '#94a3b8' : '#475569'}
                    strokeWidth={isSelected ? 1.5 : 0.8}
                    filter={isSelected ? 'url(#glow)' : undefined}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                ))}
              </g>
            );
          })}
        </svg>

        {/* Clan Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur rounded-lg border border-slate-600 p-3 z-20">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Clans</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
              <div key={id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-xs text-slate-300">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      {selected && provinces[selected] && (
        <div className="w-80 bg-slate-800 border-l border-slate-700 overflow-y-auto">
          <div
            className="p-4 border-b border-slate-700"
            style={{ background: `linear-gradient(135deg, ${getColor(selected)}40, transparent)` }}
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'serif' }}>
              {provinces[selected].name}
              {PROVINCE_DATA[selected]?.special === 'capital' && <span>👑</span>}
            </h2>
            <p className="text-sm text-slate-300">
              Owner: <span className="font-semibold" style={{ color: getColor(selected) }}>
                {CLANS[provinces[selected].owner]?.name || 'Neutral'}
              </span>
            </p>
          </div>
          
          <div className="p-4 space-y-4">
            {PROVINCE_DATA[selected]?.resource && (
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <span className="text-2xl">{RESOURCES[PROVINCE_DATA[selected].resource]?.icon}</span>
                <span className="text-white font-medium">{RESOURCES[PROVINCE_DATA[selected].resource]?.name}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Armies Stationed:</span>
              <span className="text-white font-bold text-xl">{provinces[selected].armies}</span>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-2">Borders:</p>
              <div className="flex flex-wrap gap-1">
                {PROVINCE_DATA[selected]?.neighbors?.map(n => (
                  <button
                    key={n}
                    onClick={() => setSelected(n)}
                    className="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                  >
                    {PROVINCE_DATA[n]?.name || n}
                  </button>
                ))}
              </div>
            </div>

            {admin && (
              <div className="pt-3 border-t border-slate-600">
                <p className="text-red-400 text-xs mb-2">⚠️ Admin: Change Owner</p>
                <select
                  value={provinces[selected].owner}
                  onChange={e => changeOwner(selected, e.target.value)}
                  className="w-full p-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500"
                >
                  {Object.entries(CLANS).map(([id, c]) => (
                    <option key={id} value={id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
