import React, { useState } from 'react';

// Province positions mapped to the background image (percentage-based for responsiveness)
// These are approximate center points for each province on the map image
const PROVINCES = {
  // KYUSHU (Bottom-left region)
  satsuma: { id: 'satsuma', name: 'Satsuma', x: 14.5, y: 82, resource: 'smithing', neighbors: ['osumi', 'higo'] },
  osumi: { id: 'osumi', name: 'Osumi', x: 18.5, y: 79, resource: null, neighbors: ['satsuma', 'hyuga'] },
  hyuga: { id: 'hyuga', name: 'Hyuga', x: 21, y: 72, resource: 'farming', neighbors: ['osumi', 'higo', 'bungo'] },
  higo: { id: 'higo', name: 'Higo', x: 15, y: 70, resource: 'horses', neighbors: ['satsuma', 'hyuga', 'bungo', 'tsukushi', 'hizen'] },
  bungo: { id: 'bungo', name: 'Bungo', x: 22, y: 64, resource: 'naval', neighbors: ['hyuga', 'higo', 'buzen', 'tsukushi'] },
  buzen: { id: 'buzen', name: 'Buzen', x: 24, y: 57, resource: 'craftwork', neighbors: ['bungo', 'tsukushi', 'nagato'] },
  tsukushi: { id: 'tsukushi', name: 'Tsukushi', x: 17, y: 58, resource: 'philosophical', neighbors: ['higo', 'bungo', 'buzen', 'hizen'] },
  hizen: { id: 'hizen', name: 'Hizen', x: 11, y: 62, resource: 'naval', neighbors: ['higo', 'tsukushi'] },

  // SHIKOKU (Island in the middle-south)
  tosa: { id: 'tosa', name: 'Tosa', x: 34, y: 66, resource: 'forest', neighbors: ['iyo', 'sanuki', 'awa_shikoku'] },
  iyo: { id: 'iyo', name: 'Iyo', x: 29, y: 58, resource: 'farming', neighbors: ['tosa', 'sanuki'] },
  sanuki: { id: 'sanuki', name: 'Sanuki', x: 36, y: 55, resource: 'stone', neighbors: ['tosa', 'iyo', 'awa_shikoku'] },
  awa_shikoku: { id: 'awa_shikoku', name: 'Awa', x: 40, y: 60, resource: 'horses', neighbors: ['tosa', 'sanuki'] },

  // CHUGOKU (Western Honshu)
  nagato: { id: 'nagato', name: 'Nagato', x: 22, y: 48, resource: 'farming', neighbors: ['suo', 'iwami', 'buzen'] },
  suo: { id: 'suo', name: 'Suo', x: 26, y: 51, resource: 'horses', neighbors: ['nagato', 'aki', 'iwami'] },
  aki: { id: 'aki', name: 'Aki', x: 31, y: 50, resource: 'hallowed', neighbors: ['suo', 'bingo', 'iwami'] },
  bingo: { id: 'bingo', name: 'Bingo', x: 35, y: 48, resource: 'naval', neighbors: ['aki', 'bitchu', 'izumo', 'hoki'] },
  bitchu: { id: 'bitchu', name: 'Bitchu', x: 38, y: 50, resource: 'farming', neighbors: ['bingo', 'bizen', 'mimasaka', 'hoki'] },
  bizen: { id: 'bizen', name: 'Bizen', x: 41, y: 52, resource: 'smithing', neighbors: ['bitchu', 'mimasaka', 'harima'] },
  mimasaka: { id: 'mimasaka', name: 'Mimasaka', x: 42, y: 47, resource: 'iron', neighbors: ['bitchu', 'bizen', 'inaba', 'hoki', 'harima', 'tajima'] },
  iwami: { id: 'iwami', name: 'Iwami', x: 27, y: 44, resource: 'gold', neighbors: ['nagato', 'suo', 'aki', 'izumo'] },
  izumo: { id: 'izumo', name: 'Izumo', x: 32, y: 41, resource: 'farming', neighbors: ['iwami', 'bingo', 'hoki'] },
  hoki: { id: 'hoki', name: 'Hoki', x: 37, y: 42, resource: 'craftwork', neighbors: ['izumo', 'bingo', 'bitchu', 'mimasaka', 'inaba'] },
  inaba: { id: 'inaba', name: 'Inaba', x: 41, y: 39, resource: 'naval', neighbors: ['hoki', 'mimasaka', 'tajima'] },

  // KINAI (Central/Capital Region)
  harima: { id: 'harima', name: 'Harima', x: 45, y: 53, resource: null, neighbors: ['bizen', 'mimasaka', 'tajima', 'tamba', 'settsu'] },
  tajima: { id: 'tajima', name: 'Tajima', x: 45, y: 42, resource: 'farming', neighbors: ['inaba', 'mimasaka', 'harima', 'tamba', 'tango'] },
  tamba: { id: 'tamba', name: 'Tamba', x: 49, y: 46, resource: 'farming', neighbors: ['tajima', 'harima', 'settsu', 'kyoto', 'tango', 'wakasa'] },
  tango: { id: 'tango', name: 'Tango', x: 49, y: 38, resource: 'farming', neighbors: ['tajima', 'tamba', 'wakasa'] },
  settsu: { id: 'settsu', name: 'Settsu', x: 48, y: 53, resource: 'philosophical', neighbors: ['harima', 'tamba', 'kawachi', 'kyoto', 'yamato'] },
  kawachi: { id: 'kawachi', name: 'Kawachi', x: 50, y: 57, resource: 'farming', neighbors: ['settsu', 'yamato', 'kii', 'izumi'] },
  kyoto: { id: 'kyoto', name: 'Kyoto', x: 53, y: 50, resource: 'philosophical', neighbors: ['tamba', 'settsu', 'omi', 'yamato', 'wakasa', 'iga'], special: 'capital' },
  yamato: { id: 'yamato', name: 'Yamato', x: 52, y: 58, resource: 'hallowed', neighbors: ['kyoto', 'settsu', 'kawachi', 'kii', 'iga'] },
  kii: { id: 'kii', name: 'Kii', x: 50, y: 68, resource: 'ninja', neighbors: ['kawachi', 'yamato', 'iga', 'ise', 'izumi'] },
  iga: { id: 'iga', name: 'Iga', x: 55, y: 58, resource: 'ninja', neighbors: ['yamato', 'kii', 'ise', 'omi'] },
  izumi: { id: 'izumi', name: 'Izumi', x: 46, y: 59, resource: 'farming', neighbors: ['kawachi', 'kii', 'settsu'] },

  // TOKAI (Eastern Central)
  omi: { id: 'omi', name: 'Omi', x: 57, y: 50, resource: 'ninja', neighbors: ['kyoto', 'iga', 'ise', 'mino', 'wakasa', 'echizen'] },
  wakasa: { id: 'wakasa', name: 'Wakasa', x: 53, y: 42, resource: 'farming', neighbors: ['tango', 'tamba', 'kyoto', 'omi', 'echizen'] },
  echizen: { id: 'echizen', name: 'Echizen', x: 57, y: 38, resource: 'craftwork', neighbors: ['wakasa', 'omi', 'mino', 'kaga', 'hida'] },
  ise: { id: 'ise', name: 'Ise', x: 58, y: 58, resource: 'hallowed', neighbors: ['iga', 'omi', 'mino', 'owari', 'kii'] },
  mino: { id: 'mino', name: 'Mino', x: 62, y: 48, resource: 'farming', neighbors: ['omi', 'echizen', 'ise', 'owari', 'hida', 's_shinano'] },
  owari: { id: 'owari', name: 'Owari', x: 64, y: 54, resource: null, neighbors: ['ise', 'mino', 'mikawa', 's_shinano'] },
  mikawa: { id: 'mikawa', name: 'Mikawa', x: 68, y: 56, resource: 'horses', neighbors: ['owari', 'totomi', 's_shinano'] },
  totomi: { id: 'totomi', name: 'Totomi', x: 72, y: 56, resource: 'farming', neighbors: ['mikawa', 'suruga', 's_shinano'] },
  suruga: { id: 'suruga', name: 'Suruga', x: 76, y: 54, resource: 'philosophical', neighbors: ['totomi', 'izu', 'kai', 's_shinano'] },
  izu: { id: 'izu', name: 'Izu', x: 79, y: 60, resource: 'gold', neighbors: ['suruga', 'sagami'] },

  // HOKURIKU (Northwest coast)
  kaga: { id: 'kaga', name: 'Kaga', x: 61, y: 35, resource: 'smithing', neighbors: ['echizen', 'noto', 'etchu', 'hida'] },
  noto: { id: 'noto', name: 'Noto', x: 64, y: 28, resource: 'farming', neighbors: ['kaga', 'etchu'] },
  etchu: { id: 'etchu', name: 'Etchu', x: 67, y: 33, resource: 'farming', neighbors: ['kaga', 'noto', 'hida', 'echigo', 'n_shinano'] },
  hida: { id: 'hida', name: 'Hida', x: 65, y: 42, resource: 'forest', neighbors: ['echizen', 'kaga', 'etchu', 'mino', 'n_shinano', 's_shinano'] },

  // SHINANO (Central mountains)
  n_shinano: { id: 'n_shinano', name: 'N. Shinano', x: 72, y: 40, resource: 'farming', neighbors: ['etchu', 'hida', 's_shinano', 'echigo', 'kozuke'] },
  s_shinano: { id: 's_shinano', name: 'S. Shinano', x: 71, y: 48, resource: 'stone', neighbors: ['mino', 'owari', 'mikawa', 'totomi', 'suruga', 'kai', 'hida', 'n_shinano', 'kozuke'] },
  kai: { id: 'kai', name: 'Kai', x: 78, y: 50, resource: 'horses', neighbors: ['suruga', 's_shinano', 'sagami', 'musashi', 'kozuke'] },

  // KANTO (Eastern plain)
  sagami: { id: 'sagami', name: 'Sagami', x: 82, y: 54, resource: 'smithing', neighbors: ['izu', 'kai', 'musashi'] },
  musashi: { id: 'musashi', name: 'Musashi', x: 84, y: 48, resource: 'farming', neighbors: ['sagami', 'kai', 'kozuke', 'shimotsuke', 'shimosa', 'kazusa'] },
  kozuke: { id: 'kozuke', name: 'Kozuke', x: 79, y: 42, resource: 'philosophical', neighbors: ['n_shinano', 's_shinano', 'kai', 'musashi', 'shimotsuke', 'echigo'] },
  shimotsuke: { id: 'shimotsuke', name: 'Shimotsuke', x: 84, y: 40, resource: 'hallowed', neighbors: ['kozuke', 'musashi', 'shimosa', 'hitachi', 'echigo', 'iwashiro'] },
  shimosa: { id: 'shimosa', name: 'Shimosa', x: 89, y: 48, resource: 'farming', neighbors: ['musashi', 'shimotsuke', 'hitachi', 'kazusa'] },
  kazusa: { id: 'kazusa', name: 'Kazusa', x: 90, y: 54, resource: null, neighbors: ['musashi', 'shimosa', 'awa_kanto'] },
  awa_kanto: { id: 'awa_kanto', name: 'Awa', x: 92, y: 60, resource: 'naval', neighbors: ['kazusa'] },
  hitachi: { id: 'hitachi', name: 'Hitachi', x: 91, y: 42, resource: 'craftwork', neighbors: ['shimotsuke', 'shimosa', 'iwashiro', 'iwaki'] },

  // TOHOKU (Northeast)
  echigo: { id: 'echigo', name: 'Echigo', x: 75, y: 32, resource: 'naval', neighbors: ['etchu', 'n_shinano', 'kozuke', 'shimotsuke', 'uzen', 'ugo', 'sado'] },
  sado: { id: 'sado', name: 'Sado', x: 68, y: 22, resource: 'gold', neighbors: ['echigo'] },
  ugo: { id: 'ugo', name: 'Ugo', x: 77, y: 22, resource: 'stone', neighbors: ['echigo', 'uzen', 'rikuchu'] },
  uzen: { id: 'uzen', name: 'Uzen', x: 82, y: 28, resource: 'hallowed', neighbors: ['echigo', 'shimotsuke', 'ugo', 'iwashiro', 'rikuzen', 'rikuchu'] },
  iwashiro: { id: 'iwashiro', name: 'Iwashiro', x: 86, y: 34, resource: 'forest', neighbors: ['shimotsuke', 'uzen', 'hitachi', 'iwaki', 'rikuzen'] },
  iwaki: { id: 'iwaki', name: 'Iwaki', x: 92, y: 36, resource: 'iron', neighbors: ['hitachi', 'iwashiro', 'rikuzen'] },
  rikuzen: { id: 'rikuzen', name: 'Rikuzen', x: 90, y: 28, resource: 'naval', neighbors: ['uzen', 'iwashiro', 'iwaki', 'rikuchu'] },
  rikuchu: { id: 'rikuchu', name: 'Rikuchu', x: 86, y: 18, resource: 'horses', neighbors: ['ugo', 'uzen', 'rikuzen', 'mutsu'] },
  mutsu: { id: 'mutsu', name: 'Mutsu', x: 88, y: 8, resource: 'smithing', neighbors: ['rikuchu'] },
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
  uncontrolled: { id: 'uncontrolled', name: 'Neutral', color: 'transparent', provinces: [] },
};

const RESOURCES = {
  smithing: { icon: '⚔️', name: 'Smithing' }, horses: { icon: '🐎', name: 'Horses' },
  gold: { icon: '💰', name: 'Gold' }, iron: { icon: '⛏️', name: 'Iron' },
  farming: { icon: '🌾', name: 'Farming' }, naval: { icon: '⚓', name: 'Naval' },
  craftwork: { icon: '🏺', name: 'Craftwork' }, ninja: { icon: '🥷', name: 'Ninja' },
  hallowed: { icon: '⛩️', name: 'Sacred' }, philosophical: { icon: '📜', name: 'Learning' },
  forest: { icon: '🌲', name: 'Timber' }, stone: { icon: '🪨', name: 'Stone' },
};

const BUILDINGS = {
  castle: { icon: '🏯', name: 'Castle', time: 5 }, temple: { icon: '⛩️', name: 'Temple', time: 3 },
  barracks: { icon: '🎌', name: 'Barracks', time: 2 }, market: { icon: '🏪', name: 'Market', time: 2 },
};

export default function SengokuMap() {
  const [provinces, setProvinces] = useState(() => {
    const init = {};
    Object.entries(PROVINCES).forEach(([id, p]) => {
      let owner = 'uncontrolled';
      Object.entries(CLANS).forEach(([cid, c]) => { if (c.provinces?.includes(id)) owner = cid; });
      init[id] = { ...p, owner, armies: owner !== 'uncontrolled' ? 1 : 0, buildings: [], constructing: null };
    });
    return init;
  });

  const [selected, setSelected] = useState(null);
  const [selArmy, setSelArmy] = useState(null);
  const [moveTarget, setMoveTarget] = useState(null);
  const [moves, setMoves] = useState([]);
  const [week] = useState(1);
  const [admin, setAdmin] = useState(false);
  const [clan, setClan] = useState('oda');
  const [buildMenu, setBuildMenu] = useState(false);
  const [hovered, setHovered] = useState(null);

  const getColor = (id) => CLANS[provinces[id]?.owner]?.color || 'transparent';

  const clickProv = (id) => {
    if (selArmy && !moveTarget && provinces[selArmy.prov].neighbors.includes(id)) {
      setMoveTarget(id);
      return;
    }
    setSelected(id);
    setSelArmy(null);
    setMoveTarget(null);
    setBuildMenu(false);
  };

  const clickArmy = (e, id) => {
    e.stopPropagation();
    if (provinces[id].owner === clan && provinces[id].armies > 0) {
      setSelArmy({ prov: id });
      setSelected(id);
      setMoveTarget(null);
    }
  };

  const confirmMove = () => {
    if (selArmy && moveTarget) {
      setMoves([...moves, { id: Date.now(), from: selArmy.prov, to: moveTarget, clan }]);
      setSelArmy(null);
      setMoveTarget(null);
    }
  };

  const build = (type) => {
    if (!selected || provinces[selected].owner !== clan || provinces[selected].constructing) return;
    setProvinces({
      ...provinces,
      [selected]: { ...provinces[selected], constructing: { type, days: BUILDINGS[type].time } }
    });
    setBuildMenu(false);
  };

  const changeOwner = (id, newOwner) => {
    setProvinces({ ...provinces, [id]: { ...provinces[id], owner: newOwner } });
  };

  return (
    <div className="w-full h-screen bg-stone-900 relative overflow-hidden" style={{ fontFamily: "'Noto Serif', Georgia, serif" }}>
      {/* Background Map Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/japan-map.png)' }}
      />
      
      {/* Darkening overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Interactive Layer */}
      <div className="absolute inset-0">
        {/* Province markers and army tokens */}
        {Object.entries(PROVINCES).map(([id, p]) => {
          const pr = provinces[id];
          const isSel = selected === id;
          const isHov = hovered === id;
          const isTarget = selArmy && provinces[selArmy.prov]?.neighbors.includes(id);
          const isMoveT = moveTarget === id;
          const isMine = pr.owner === clan;
          const color = getColor(id);

          return (
            <div
              key={id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={() => clickProv(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Province color indicator (circle behind) */}
              {color !== 'transparent' && (
                <div
                  className="absolute rounded-full opacity-70 transition-all duration-200"
                  style={{
                    width: isSel ? '50px' : isHov ? '45px' : '40px',
                    height: isSel ? '50px' : isHov ? '45px' : '40px',
                    backgroundColor: color,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: isSel ? `0 0 20px ${color}` : isHov ? `0 0 15px ${color}` : `0 0 8px ${color}`,
                    border: isSel ? '3px solid #fbbf24' : isMoveT ? '3px solid #22c55e' : isTarget ? '2px solid #fbbf24' : '2px solid rgba(0,0,0,0.5)',
                  }}
                />
              )}
              
              {/* Neutral province marker */}
              {color === 'transparent' && (
                <div
                  className="absolute rounded-full transition-all duration-200"
                  style={{
                    width: isSel ? '40px' : isHov ? '35px' : '30px',
                    height: isSel ? '40px' : isHov ? '35px' : '30px',
                    backgroundColor: 'rgba(60, 60, 60, 0.7)',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: isSel ? '3px solid #fbbf24' : isMoveT ? '3px solid #22c55e' : isTarget ? '2px solid #fbbf24' : '2px solid rgba(0,0,0,0.5)',
                  }}
                />
              )}

              {/* Province name label */}
              <div
                className="absolute whitespace-nowrap text-center pointer-events-none"
                style={{
                  left: '50%',
                  top: '-20px',
                  transform: 'translateX(-50%)',
                  fontSize: isSel || isHov ? '11px' : '9px',
                  fontWeight: isSel ? 'bold' : 'normal',
                  color: '#fff',
                  textShadow: '1px 1px 3px #000, -1px -1px 3px #000, 1px -1px 3px #000, -1px 1px 3px #000',
                }}
              >
                {p.name}
                {p.resource && <span className="ml-1">{RESOURCES[p.resource]?.icon}</span>}
              </div>

              {/* Capital marker */}
              {p.special === 'capital' && (
                <div className="absolute text-lg pointer-events-none" style={{ left: '50%', top: '25px', transform: 'translateX(-50%)' }}>
                  👑
                </div>
              )}

              {/* Army token */}
              {pr.armies > 0 && (
                <div
                  className="absolute flex items-center justify-center rounded-full text-white font-bold text-sm transition-all"
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#1f2937',
                    border: isMine ? '2px solid #fbbf24' : '2px solid #6b7280',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    cursor: isMine ? 'pointer' : 'default',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                  onClick={(e) => clickArmy(e, id)}
                >
                  {pr.armies}
                </div>
              )}
            </div>
          );
        })}

        {/* Movement lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0,10 3.5,0 7" fill="#fbbf24" />
            </marker>
            <marker id="arrow-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0,10 3.5,0 7" fill="#22c55e" />
            </marker>
          </defs>
          
          {/* Planned moves */}
          {moves.filter(m => m.clan === clan).map(m => {
            const from = PROVINCES[m.from];
            const to = PROVINCES[m.to];
            return (
              <line
                key={m.id}
                x1={`${from.x}%`} y1={`${from.y}%`}
                x2={`${to.x}%`} y2={`${to.y}%`}
                stroke={CLANS[m.clan]?.color}
                strokeWidth={3}
                strokeDasharray="10,5"
                markerEnd="url(#arrow)"
                opacity={0.9}
              />
            );
          })}
          
          {/* Current movement preview */}
          {selArmy && moveTarget && (
            <line
              x1={`${PROVINCES[selArmy.prov].x}%`} y1={`${PROVINCES[selArmy.prov].y}%`}
              x2={`${PROVINCES[moveTarget].x}%`} y2={`${PROVINCES[moveTarget].y}%`}
              stroke="#22c55e"
              strokeWidth={4}
              strokeDasharray="12,6"
              markerEnd="url(#arrow-green)"
            />
          )}
        </svg>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-stone-900/90 to-transparent z-10 flex items-center justify-center">
        <h1 className="text-3xl font-bold tracking-wide" style={{ color: '#C9A227', textShadow: '2px 2px 6px #000' }}>
          戦国 <span className="text-xl text-stone-300 ml-2">SENGOKU</span>
        </h1>
      </div>

      {/* Top controls */}
      <div className="absolute top-16 left-4 flex gap-2 z-20">
        <div className="bg-stone-900/90 backdrop-blur rounded-lg border border-stone-600 px-4 py-2 shadow-xl">
          <p className="text-stone-400 text-xs uppercase tracking-wider">Week</p>
          <p className="text-amber-400 font-bold text-2xl">{week}</p>
        </div>
        <div className="bg-stone-900/90 backdrop-blur rounded-lg border border-stone-600 px-4 py-2 shadow-xl">
          <p className="text-stone-400 text-xs uppercase tracking-wider">Playing As</p>
          <select
            value={clan}
            onChange={e => setClan(e.target.value)}
            className="bg-transparent font-bold text-lg cursor-pointer focus:outline-none"
            style={{ color: CLANS[clan]?.color }}
          >
            {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
              <option key={id} value={id} style={{ color: '#fff', background: '#1c1917' }}>{c.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setAdmin(!admin)}
          className={`px-4 py-2 rounded-lg border backdrop-blur shadow-xl transition-colors ${
            admin ? 'bg-red-900/80 border-red-500 text-red-300' : 'bg-stone-900/90 border-stone-600 text-stone-400 hover:bg-stone-800'
          }`}
        >
          {admin ? '🔓 Admin' : '🔒 Admin'}
        </button>
      </div>

      {/* Province info panel */}
      {selected && (
        <div className="absolute top-16 right-4 w-80 bg-stone-900/95 backdrop-blur rounded-lg border border-stone-600 shadow-2xl z-20 overflow-hidden">
          <div
            className="p-4 border-b border-stone-600"
            style={{ background: `linear-gradient(135deg, ${getColor(selected)}40, transparent)` }}
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {PROVINCES[selected].name}
              {PROVINCES[selected].special === 'capital' && <span>👑</span>}
            </h2>
            <p className="text-sm text-stone-300">
              Owner: <span className="font-semibold" style={{ color: getColor(selected) || '#9ca3af' }}>
                {CLANS[provinces[selected].owner]?.name || 'Neutral'}
              </span>
            </p>
          </div>
          
          <div className="p-4 space-y-4">
            {PROVINCES[selected].resource && (
              <div className="flex items-center gap-3 p-3 bg-stone-800/50 rounded-lg">
                <span className="text-2xl">{RESOURCES[PROVINCES[selected].resource]?.icon}</span>
                <span className="text-white font-medium">{RESOURCES[PROVINCES[selected].resource]?.name}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-stone-400">Armies Stationed:</span>
              <span className="text-white font-bold text-xl">{provinces[selected].armies}</span>
            </div>

            <div>
              <p className="text-stone-400 text-sm mb-2">Borders:</p>
              <div className="flex flex-wrap gap-1">
                {PROVINCES[selected].neighbors.map(n => (
                  <button
                    key={n}
                    onClick={() => setSelected(n)}
                    className="text-xs px-2 py-1 rounded bg-stone-700 hover:bg-stone-600 text-stone-300 transition-colors"
                  >
                    {PROVINCES[n]?.name}
                  </button>
                ))}
              </div>
            </div>

            {provinces[selected].owner === clan && (
              <div className="pt-3 border-t border-stone-600 space-y-2">
                {!provinces[selected].constructing && (
                  <button
                    onClick={() => setBuildMenu(!buildMenu)}
                    className="w-full py-2 bg-amber-700 hover:bg-amber-600 rounded-lg text-white font-medium transition-colors"
                  >
                    🏗️ Build Structure
                  </button>
                )}
                
                {buildMenu && (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(BUILDINGS).map(([id, b]) => (
                      <button
                        key={id}
                        onClick={() => build(id)}
                        className="p-2 bg-stone-700 hover:bg-stone-600 rounded-lg text-sm text-white transition-colors"
                      >
                        {b.icon} {b.name}
                      </button>
                    ))}
                  </div>
                )}
                
                {provinces[selected].armies > 0 && !selArmy && (
                  <button
                    onClick={e => clickArmy(e, selected)}
                    className="w-full py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
                  >
                    🎌 Move Army
                  </button>
                )}
              </div>
            )}

            {admin && (
              <div className="pt-3 border-t border-red-900/50">
                <p className="text-red-400 text-xs mb-2">⚠️ Admin: Change Owner</p>
                <select
                  value={provinces[selected].owner}
                  onChange={e => changeOwner(selected, e.target.value)}
                  className="w-full p-2 bg-stone-800 text-white rounded-lg border border-stone-600 focus:outline-none focus:border-red-500"
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

      {/* Movement confirmation panel */}
      {selArmy && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-stone-900/95 backdrop-blur rounded-lg border border-stone-600 p-4 shadow-2xl z-20">
          <p className="text-white mb-3">
            Moving army from <span className="text-blue-400 font-bold">{PROVINCES[selArmy.prov]?.name}</span>
            {moveTarget && (
              <span> → <span className="text-green-400 font-bold">{PROVINCES[moveTarget]?.name}</span></span>
            )}
          </p>
          {!moveTarget && <p className="text-amber-400 text-sm mb-3">Click a neighboring province to set destination</p>}
          <div className="flex gap-2">
            {moveTarget && (
              <button
                onClick={confirmMove}
                className="px-5 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-white font-medium transition-colors"
              >
                ✓ Confirm
              </button>
            )}
            <button
              onClick={() => { setSelArmy(null); setMoveTarget(null); }}
              className="px-5 py-2 bg-stone-700 hover:bg-stone-600 rounded-lg text-white transition-colors"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Planned moves panel */}
      {moves.filter(m => m.clan === clan).length > 0 && (
        <div className="absolute bottom-6 right-4 w-64 bg-stone-900/95 backdrop-blur rounded-lg border border-stone-600 shadow-2xl z-20 overflow-hidden">
          <div className="p-3 border-b border-stone-600">
            <h3 className="text-white font-bold">📋 Planned Orders</h3>
          </div>
          <div className="p-3 space-y-2 max-h-40 overflow-y-auto">
            {moves.filter(m => m.clan === clan).map(m => (
              <div key={m.id} className="flex items-center justify-between bg-stone-800 rounded-lg px-3 py-2">
                <span className="text-sm text-white">
                  {PROVINCES[m.from]?.name} → {PROVINCES[m.to]?.name}
                </span>
                <button
                  onClick={() => setMoves(moves.filter(x => x.id !== m.id))}
                  className="text-red-400 hover:text-red-300 text-sm ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clan legend */}
      <div className="absolute bottom-6 left-4 bg-stone-900/90 backdrop-blur rounded-lg border border-stone-600 p-3 shadow-xl z-20">
        <p className="text-stone-400 text-xs uppercase tracking-wider mb-2">Clans</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
            <div key={id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-xs text-stone-300">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
