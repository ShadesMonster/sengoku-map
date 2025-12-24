import React, { useState, useCallback } from 'react';

// Province data based on Shogun 2's 65 provinces
const PROVINCES = {
  // Kyushu
  satsuma: { id: 'satsuma', name: 'Satsuma', region: 'kyushu', x: 8, y: 85, resource: 'smithing', neighbors: ['osumi', 'hyuga'] },
  osumi: { id: 'osumi', name: 'Osumi', region: 'kyushu', x: 12, y: 82, resource: null, neighbors: ['satsuma', 'hyuga'] },
  hyuga: { id: 'hyuga', name: 'Hyuga', region: 'kyushu', x: 15, y: 78, resource: 'farming', neighbors: ['satsuma', 'osumi', 'higo', 'bungo'] },
  higo: { id: 'higo', name: 'Higo', region: 'kyushu', x: 10, y: 74, resource: 'horses', neighbors: ['hyuga', 'bungo', 'tsukushi', 'hizen'] },
  bungo: { id: 'bungo', name: 'Bungo', region: 'kyushu', x: 17, y: 72, resource: 'naval', neighbors: ['hyuga', 'higo', 'buzen'] },
  buzen: { id: 'buzen', name: 'Buzen', region: 'kyushu', x: 18, y: 68, resource: 'craftwork', neighbors: ['bungo', 'tsukushi'] },
  tsukushi: { id: 'tsukushi', name: 'Tsukushi', region: 'kyushu', x: 12, y: 68, resource: 'philosophical', neighbors: ['higo', 'buzen', 'hizen'] },
  hizen: { id: 'hizen', name: 'Hizen', region: 'kyushu', x: 6, y: 70, resource: 'naval', neighbors: ['higo', 'tsukushi'] },
  
  // Shikoku
  tosa: { id: 'tosa', name: 'Tosa', region: 'shikoku', x: 28, y: 72, resource: 'forest', neighbors: ['iyo', 'sanuki', 'awa_shikoku'] },
  iyo: { id: 'iyo', name: 'Iyo', region: 'shikoku', x: 24, y: 68, resource: 'farming', neighbors: ['tosa', 'sanuki'] },
  sanuki: { id: 'sanuki', name: 'Sanuki', region: 'shikoku', x: 30, y: 66, resource: 'stone', neighbors: ['tosa', 'iyo', 'awa_shikoku'] },
  awa_shikoku: { id: 'awa_shikoku', name: 'Awa', region: 'shikoku', x: 34, y: 68, resource: 'horses', neighbors: ['tosa', 'sanuki'] },
  
  // Chugoku (Western Honshu)
  nagato: { id: 'nagato', name: 'Nagato', region: 'chugoku', x: 20, y: 62, resource: 'farming', neighbors: ['suo', 'iwami'] },
  suo: { id: 'suo', name: 'Suo', region: 'chugoku', x: 24, y: 60, resource: 'horses', neighbors: ['nagato', 'aki', 'iwami'] },
  aki: { id: 'aki', name: 'Aki', region: 'chugoku', x: 28, y: 58, resource: 'hallowed', neighbors: ['suo', 'bingo', 'iwami'] },
  bingo: { id: 'bingo', name: 'Bingo', region: 'chugoku', x: 32, y: 56, resource: 'naval', neighbors: ['aki', 'bitchu', 'izumo'] },
  bitchu: { id: 'bitchu', name: 'Bitchu', region: 'chugoku', x: 36, y: 55, resource: 'farming', neighbors: ['bingo', 'bizen', 'mimasaka'] },
  bizen: { id: 'bizen', name: 'Bizen', region: 'chugoku', x: 40, y: 54, resource: 'smithing', neighbors: ['bitchu', 'mimasaka', 'harima'] },
  mimasaka: { id: 'mimasaka', name: 'Mimasaka', region: 'chugoku', x: 38, y: 50, resource: 'iron', neighbors: ['bitchu', 'bizen', 'inaba', 'hoki'] },
  iwami: { id: 'iwami', name: 'Iwami', region: 'chugoku', x: 26, y: 54, resource: 'gold', neighbors: ['nagato', 'suo', 'aki', 'izumo'] },
  izumo: { id: 'izumo', name: 'Izumo', region: 'chugoku', x: 30, y: 50, resource: 'farming', neighbors: ['iwami', 'bingo', 'hoki'] },
  hoki: { id: 'hoki', name: 'Hoki', region: 'chugoku', x: 34, y: 48, resource: 'craftwork', neighbors: ['izumo', 'mimasaka', 'inaba'] },
  inaba: { id: 'inaba', name: 'Inaba', region: 'chugoku', x: 38, y: 46, resource: 'naval', neighbors: ['hoki', 'mimasaka', 'tajima'] },
  
  // Kinai (Central)
  harima: { id: 'harima', name: 'Harima', region: 'kinai', x: 44, y: 52, resource: null, neighbors: ['bizen', 'tajima', 'tamba', 'settsu'] },
  tajima: { id: 'tajima', name: 'Tajima', region: 'kinai', x: 42, y: 46, resource: 'farming', neighbors: ['inaba', 'harima', 'tamba', 'tango'] },
  tamba: { id: 'tamba', name: 'Tamba', region: 'kinai', x: 46, y: 48, resource: 'farming', neighbors: ['harima', 'tajima', 'settsu', 'kyoto', 'tango'] },
  tango: { id: 'tango', name: 'Tango', region: 'kinai', x: 46, y: 42, resource: 'farming', neighbors: ['tajima', 'tamba', 'wakasa'] },
  settsu: { id: 'settsu', name: 'Settsu', region: 'kinai', x: 48, y: 54, resource: 'philosophical', neighbors: ['harima', 'tamba', 'kawachi', 'kyoto'] },
  kawachi: { id: 'kawachi', name: 'Kawachi', region: 'kinai', x: 50, y: 58, resource: 'farming', neighbors: ['settsu', 'yamato', 'kii'] },
  kyoto: { id: 'kyoto', name: 'Kyoto', region: 'kinai', x: 52, y: 50, resource: 'philosophical', neighbors: ['tamba', 'settsu', 'omi', 'yamato'], special: 'capital' },
  yamato: { id: 'yamato', name: 'Yamato', region: 'kinai', x: 54, y: 56, resource: 'hallowed', neighbors: ['kyoto', 'kawachi', 'kii', 'iga'] },
  kii: { id: 'kii', name: 'Kii', region: 'kinai', x: 52, y: 64, resource: 'ninja', neighbors: ['kawachi', 'yamato', 'iga'] },
  iga: { id: 'iga', name: 'Iga', region: 'kinai', x: 56, y: 58, resource: 'ninja', neighbors: ['yamato', 'kii', 'ise', 'omi'] },
  
  // Tokai
  omi: { id: 'omi', name: 'Omi', region: 'tokai', x: 56, y: 50, resource: 'ninja', neighbors: ['kyoto', 'iga', 'ise', 'mino', 'wakasa', 'echizen'] },
  wakasa: { id: 'wakasa', name: 'Wakasa', region: 'tokai', x: 50, y: 42, resource: 'farming', neighbors: ['tango', 'omi', 'echizen'] },
  echizen: { id: 'echizen', name: 'Echizen', region: 'tokai', x: 54, y: 40, resource: 'craftwork', neighbors: ['wakasa', 'omi', 'mino', 'kaga'] },
  ise: { id: 'ise', name: 'Ise', region: 'tokai', x: 60, y: 58, resource: 'hallowed', neighbors: ['iga', 'omi', 'mino', 'owari'] },
  mino: { id: 'mino', name: 'Mino', region: 'tokai', x: 60, y: 50, resource: 'farming', neighbors: ['omi', 'echizen', 'ise', 'owari', 'hida', 's_shinano'] },
  owari: { id: 'owari', name: 'Owari', region: 'tokai', x: 64, y: 54, resource: null, neighbors: ['ise', 'mino', 'mikawa', 's_shinano'] },
  mikawa: { id: 'mikawa', name: 'Mikawa', region: 'tokai', x: 68, y: 56, resource: 'horses', neighbors: ['owari', 'totomi', 's_shinano'] },
  totomi: { id: 'totomi', name: 'Totomi', region: 'tokai', x: 72, y: 58, resource: 'farming', neighbors: ['mikawa', 'suruga', 's_shinano'] },
  suruga: { id: 'suruga', name: 'Suruga', region: 'tokai', x: 76, y: 56, resource: 'philosophical', neighbors: ['totomi', 'izu', 'kai', 's_shinano'] },
  izu: { id: 'izu', name: 'Izu', region: 'tokai', x: 80, y: 60, resource: 'gold', neighbors: ['suruga', 'sagami'] },
  
  // Hokuriku
  kaga: { id: 'kaga', name: 'Kaga', region: 'hokuriku', x: 58, y: 38, resource: 'smithing', neighbors: ['echizen', 'noto', 'etchu', 'hida'] },
  noto: { id: 'noto', name: 'Noto', region: 'hokuriku', x: 60, y: 32, resource: 'farming', neighbors: ['kaga', 'etchu'] },
  etchu: { id: 'etchu', name: 'Etchu', region: 'hokuriku', x: 64, y: 36, resource: 'farming', neighbors: ['kaga', 'noto', 'hida', 'echigo', 'n_shinano'] },
  hida: { id: 'hida', name: 'Hida', region: 'hokuriku', x: 64, y: 44, resource: 'forest', neighbors: ['mino', 'kaga', 'etchu', 'n_shinano', 's_shinano'] },
  
  // Shinano
  n_shinano: { id: 'n_shinano', name: 'North Shinano', region: 'shinano', x: 70, y: 42, resource: 'farming', neighbors: ['etchu', 'hida', 's_shinano', 'echigo', 'kozuke'] },
  s_shinano: { id: 's_shinano', name: 'South Shinano', region: 'shinano', x: 72, y: 50, resource: 'stone', neighbors: ['mino', 'owari', 'mikawa', 'totomi', 'suruga', 'kai', 'hida', 'n_shinano', 'kozuke'] },
  kai: { id: 'kai', name: 'Kai', region: 'shinano', x: 78, y: 52, resource: 'horses', neighbors: ['suruga', 's_shinano', 'sagami', 'musashi', 'kozuke'] },
  
  // Kanto
  sagami: { id: 'sagami', name: 'Sagami', region: 'kanto', x: 82, y: 56, resource: 'smithing', neighbors: ['izu', 'kai', 'musashi'] },
  musashi: { id: 'musashi', name: 'Musashi', region: 'kanto', x: 84, y: 50, resource: 'farming', neighbors: ['sagami', 'kai', 'kozuke', 'shimotsuke', 'shimosa', 'kazusa'] },
  kozuke: { id: 'kozuke', name: 'Kozuke', region: 'kanto', x: 78, y: 44, resource: 'philosophical', neighbors: ['n_shinano', 's_shinano', 'kai', 'musashi', 'shimotsuke', 'echigo'] },
  shimotsuke: { id: 'shimotsuke', name: 'Shimotsuke', region: 'kanto', x: 84, y: 42, resource: 'hallowed', neighbors: ['kozuke', 'musashi', 'shimosa', 'hitachi', 'uzen'] },
  shimosa: { id: 'shimosa', name: 'Shimosa', region: 'kanto', x: 88, y: 48, resource: 'farming', neighbors: ['musashi', 'shimotsuke', 'hitachi', 'kazusa'] },
  kazusa: { id: 'kazusa', name: 'Kazusa', region: 'kanto', x: 90, y: 54, resource: null, neighbors: ['musashi', 'shimosa'] },
  hitachi: { id: 'hitachi', name: 'Hitachi', region: 'kanto', x: 90, y: 44, resource: 'craftwork', neighbors: ['shimotsuke', 'shimosa', 'uzen', 'miyagi'] },
  
  // Tohoku
  echigo: { id: 'echigo', name: 'Echigo', region: 'tohoku', x: 72, y: 34, resource: 'naval', neighbors: ['etchu', 'n_shinano', 'kozuke', 'uzen', 'ugo', 'sado'] },
  sado: { id: 'sado', name: 'Sado', region: 'tohoku', x: 68, y: 28, resource: 'gold', neighbors: ['echigo'] },
  ugo: { id: 'ugo', name: 'Ugo', region: 'tohoku', x: 76, y: 28, resource: 'stone', neighbors: ['echigo', 'uzen', 'iwate'] },
  uzen: { id: 'uzen', name: 'Uzen', region: 'tohoku', x: 82, y: 32, resource: 'hallowed', neighbors: ['echigo', 'shimotsuke', 'hitachi', 'ugo', 'miyagi', 'iwate'] },
  miyagi: { id: 'miyagi', name: 'Miyagi', region: 'tohoku', x: 88, y: 34, resource: 'iron', neighbors: ['hitachi', 'uzen', 'iwate'] },
  fukushima: { id: 'fukushima', name: 'Fukushima', region: 'tohoku', x: 86, y: 38, resource: 'forest', neighbors: ['uzen', 'miyagi', 'shimotsuke'] },
  iwate: { id: 'iwate', name: 'Iwate', region: 'tohoku', x: 88, y: 24, resource: 'smithing', neighbors: ['ugo', 'uzen', 'miyagi'] },
};

// Default clans with colors
const DEFAULT_CLANS = {
  shimazu: { id: 'shimazu', name: 'Shimazu', color: '#DC2626', provinces: ['satsuma'], armies: 2 },
  chosokabe: { id: 'chosokabe', name: 'Chosokabe', color: '#F59E0B', provinces: ['tosa'], armies: 2 },
  mori: { id: 'mori', name: 'Mōri', color: '#10B981', provinces: ['aki'], armies: 2 },
  oda: { id: 'oda', name: 'Oda', color: '#3B82F6', provinces: ['owari'], armies: 2 },
  takeda: { id: 'takeda', name: 'Takeda', color: '#8B5CF6', provinces: ['kai'], armies: 2 },
  uesugi: { id: 'uesugi', name: 'Uesugi', color: '#06B6D4', provinces: ['echigo'], armies: 2 },
  hojo: { id: 'hojo', name: 'Hōjō', color: '#EC4899', provinces: ['sagami', 'izu'], armies: 3 },
  date: { id: 'date', name: 'Date', color: '#6366F1', provinces: ['iwate'], armies: 2 },
  tokugawa: { id: 'tokugawa', name: 'Tokugawa', color: '#84CC16', provinces: ['mikawa'], armies: 2 },
  imagawa: { id: 'imagawa', name: 'Imagawa', color: '#F97316', provinces: ['suruga', 'totomi'], armies: 3 },
  uncontrolled: { id: 'uncontrolled', name: 'Uncontrolled', color: '#6B7280', provinces: [], armies: 0 },
};

// Resource icons and info
const RESOURCES = {
  smithing: { icon: '⚔️', name: 'Smithing', desc: 'Weapons & Armor' },
  horses: { icon: '🐎', name: 'Horses', desc: 'Cavalry Training' },
  gold: { icon: '💰', name: 'Gold', desc: 'Gold Mines' },
  iron: { icon: '⛏️', name: 'Iron', desc: 'Iron Mines' },
  farming: { icon: '🌾', name: 'Farming', desc: 'Fertile Land' },
  naval: { icon: '⚓', name: 'Naval', desc: 'Naval Tradition' },
  craftwork: { icon: '🏺', name: 'Craftwork', desc: 'Artisans' },
  ninja: { icon: '🥷', name: 'Ninja', desc: 'Shadow Arts' },
  hallowed: { icon: '⛩️', name: 'Hallowed Ground', desc: 'Sacred Sites' },
  philosophical: { icon: '📜', name: 'Philosophy', desc: 'Learning' },
  forest: { icon: '🌲', name: 'Prime Forest', desc: 'Timber' },
  stone: { icon: '🪨', name: 'Stone', desc: 'Quarries' },
};

// Building types
const BUILDINGS = {
  castle: { icon: '🏯', name: 'Castle', buildTime: 5, desc: '+1 Army Capacity' },
  temple: { icon: '⛩️', name: 'Temple', buildTime: 3, desc: 'Reduces Unrest' },
  barracks: { icon: '🎌', name: 'Barracks', buildTime: 2, desc: 'Faster Recruitment' },
  market: { icon: '🏪', name: 'Market', buildTime: 2, desc: '+Income' },
  port: { icon: '⚓', name: 'Port', buildTime: 3, desc: 'Naval Movement' },
  watchtower: { icon: '🗼', name: 'Watchtower', buildTime: 1, desc: 'Vision Range' },
};

// Terrain types for movement
const TERRAIN = {
  plains: { moveCost: 1, color: '#86EFAC' },
  forest: { moveCost: 1, hidden: true, color: '#166534' },
  mountain: { moveCost: 2, color: '#A1A1AA' },
  coastal: { moveCost: 1, color: '#7DD3FC' },
};

export default function SengokuMap() {
  // Game state
  const [clans, setClans] = useState(DEFAULT_CLANS);
  const [provinces, setProvinces] = useState(() => {
    const initial = {};
    Object.entries(PROVINCES).forEach(([id, prov]) => {
      // Find which clan owns this province
      let owner = 'uncontrolled';
      Object.entries(DEFAULT_CLANS).forEach(([clanId, clan]) => {
        if (clan.provinces.includes(id)) owner = clanId;
      });
      initial[id] = {
        ...prov,
        owner,
        armies: owner !== 'uncontrolled' ? 1 : 0,
        buildings: [],
        constructing: null,
        unrest: 0,
      };
    });
    return initial;
  });
  
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedArmy, setSelectedArmy] = useState(null);
  const [movementTarget, setMovementTarget] = useState(null);
  const [plannedMoves, setPlannedMoves] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentClan, setCurrentClan] = useState('oda');
  const [showBuildMenu, setShowBuildMenu] = useState(false);
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  // Get owner color for a province
  const getProvinceColor = (provId) => {
    const prov = provinces[provId];
    if (!prov) return '#6B7280';
    return clans[prov.owner]?.color || '#6B7280';
  };

  // Handle province selection
  const handleProvinceClick = (provId) => {
    if (selectedArmy && movementTarget === null) {
      // We have an army selected, this click is setting movement target
      const fromProv = provinces[selectedArmy.province];
      if (fromProv.neighbors.includes(provId)) {
        setMovementTarget(provId);
      }
    } else {
      setSelectedProvince(provId);
      setSelectedArmy(null);
      setMovementTarget(null);
      setShowBuildMenu(false);
    }
  };

  // Handle army selection
  const handleArmyClick = (e, provId) => {
    e.stopPropagation();
    const prov = provinces[provId];
    if (prov.owner === currentClan && prov.armies > 0) {
      setSelectedArmy({ province: provId, count: 1 });
      setSelectedProvince(provId);
      setMovementTarget(null);
    }
  };

  // Confirm movement
  const confirmMovement = () => {
    if (selectedArmy && movementTarget) {
      const newMove = {
        id: Date.now(),
        from: selectedArmy.province,
        to: movementTarget,
        armies: selectedArmy.count,
        clan: currentClan,
      };
      setPlannedMoves([...plannedMoves, newMove]);
      setSelectedArmy(null);
      setMovementTarget(null);
    }
  };

  // Cancel movement
  const cancelMovement = () => {
    setSelectedArmy(null);
    setMovementTarget(null);
  };

  // Remove planned move
  const removePlannedMove = (moveId) => {
    setPlannedMoves(plannedMoves.filter(m => m.id !== moveId));
  };

  // Build structure
  const startBuilding = (buildingType) => {
    if (!selectedProvince) return;
    const prov = provinces[selectedProvince];
    if (prov.owner !== currentClan || prov.constructing) return;
    
    setProvinces({
      ...provinces,
      [selectedProvince]: {
        ...prov,
        constructing: {
          type: buildingType,
          daysLeft: BUILDINGS[buildingType].buildTime,
        },
      },
    });
    setShowBuildMenu(false);
  };

  // Admin: Resolve battle
  const resolveBattle = (provId, winner) => {
    setProvinces({
      ...provinces,
      [provId]: {
        ...provinces[provId],
        owner: winner,
        unrest: 2, // New conquest has unrest
      },
    });
  };

  // Render province marker
  const renderProvince = (provId) => {
    const prov = provinces[provId];
    const baseProv = PROVINCES[provId];
    const isSelected = selectedProvince === provId;
    const isHovered = hoveredProvince === provId;
    const isMovementTarget = movementTarget === provId;
    const isValidMoveTarget = selectedArmy && provinces[selectedArmy.province]?.neighbors.includes(provId);
    const isOwnedByPlayer = prov.owner === currentClan;
    
    const size = isSelected ? 14 : isHovered ? 12 : 10;
    
    return (
      <g key={provId} transform={`translate(${baseProv.x * 8}, ${baseProv.y * 5})`}>
        {/* Province territory circle */}
        <circle
          cx={0}
          cy={0}
          r={size}
          fill={getProvinceColor(provId)}
          stroke={isSelected ? '#FFF' : isValidMoveTarget ? '#FFD700' : isMovementTarget ? '#00FF00' : '#000'}
          strokeWidth={isSelected ? 3 : isValidMoveTarget ? 2 : 1}
          opacity={0.85}
          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
          onClick={() => handleProvinceClick(provId)}
          onMouseEnter={() => setHoveredProvince(provId)}
          onMouseLeave={() => setHoveredProvince(null)}
        />
        
        {/* Province name */}
        <text
          x={0}
          y={-size - 4}
          textAnchor="middle"
          fontSize={isHovered || isSelected ? 8 : 6}
          fill="#FFF"
          fontWeight={isSelected ? 'bold' : 'normal'}
          style={{ pointerEvents: 'none', textShadow: '1px 1px 2px #000' }}
        >
          {baseProv.name}
        </text>
        
        {/* Resource icon */}
        {baseProv.resource && (
          <text
            x={size + 4}
            y={0}
            fontSize={8}
            dominantBaseline="middle"
            style={{ pointerEvents: 'none' }}
          >
            {RESOURCES[baseProv.resource]?.icon}
          </text>
        )}
        
        {/* Army count */}
        {prov.armies > 0 && (
          <g onClick={(e) => handleArmyClick(e, provId)} style={{ cursor: isOwnedByPlayer ? 'pointer' : 'default' }}>
            <circle cx={0} cy={size + 8} r={6} fill="#1F2937" stroke={isOwnedByPlayer ? '#FFD700' : '#FFF'} strokeWidth={1} />
            <text x={0} y={size + 8} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="#FFF" fontWeight="bold">
              {prov.armies}
            </text>
          </g>
        )}
        
        {/* Kyoto marker */}
        {baseProv.special === 'capital' && (
          <text x={0} y={size + 18} textAnchor="middle" fontSize={10}>👑</text>
        )}
        
        {/* Construction indicator */}
        {prov.constructing && (
          <text x={-size - 4} y={0} fontSize={8}>🔨</text>
        )}
      </g>
    );
  };

  // Render movement arrows for planned moves
  const renderPlannedMoves = () => {
    return plannedMoves.map(move => {
      const from = PROVINCES[move.from];
      const to = PROVINCES[move.to];
      const clanColor = clans[move.clan]?.color || '#FFF';
      
      return (
        <g key={move.id}>
          <defs>
            <marker id={`arrow-${move.id}`} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill={clanColor} />
            </marker>
          </defs>
          <line
            x1={from.x * 8}
            y1={from.y * 5}
            x2={to.x * 8}
            y2={to.y * 5}
            stroke={clanColor}
            strokeWidth={2}
            strokeDasharray="5,3"
            markerEnd={`url(#arrow-${move.id})`}
          />
        </g>
      );
    });
  };

  // Render current movement planning arrow
  const renderCurrentMovement = () => {
    if (!selectedArmy || !movementTarget) return null;
    const from = PROVINCES[selectedArmy.province];
    const to = PROVINCES[movementTarget];
    
    return (
      <line
        x1={from.x * 8}
        y1={from.y * 5}
        x2={to.x * 8}
        y2={to.y * 5}
        stroke="#00FF00"
        strokeWidth={3}
        strokeDasharray="8,4"
      />
    );
  };

  // Province info panel
  const renderProvinceInfo = () => {
    if (!selectedProvince) return null;
    const prov = provinces[selectedProvince];
    const baseProv = PROVINCES[selectedProvince];
    const ownerClan = clans[prov.owner];
    
    return (
      <div className="absolute top-4 right-4 w-72 bg-gray-900/95 rounded-lg border border-gray-700 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-700" style={{ backgroundColor: ownerClan?.color + '40' }}>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {baseProv.name}
            {baseProv.special === 'capital' && <span>👑</span>}
          </h2>
          <p className="text-sm text-gray-300">
            Controlled by: <span style={{ color: ownerClan?.color }}>{ownerClan?.name || 'None'}</span>
          </p>
        </div>
        
        {/* Stats */}
        <div className="p-4 space-y-3">
          {/* Resource */}
          {baseProv.resource && (
            <div className="flex items-center gap-2">
              <span className="text-lg">{RESOURCES[baseProv.resource]?.icon}</span>
              <div>
                <p className="text-white font-medium">{RESOURCES[baseProv.resource]?.name}</p>
                <p className="text-xs text-gray-400">{RESOURCES[baseProv.resource]?.desc}</p>
              </div>
            </div>
          )}
          
          {/* Armies */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Armies Stationed:</span>
            <span className="text-white font-bold text-lg">{prov.armies}</span>
          </div>
          
          {/* Buildings */}
          <div>
            <p className="text-gray-400 mb-2">Buildings:</p>
            {prov.buildings.length === 0 && !prov.constructing ? (
              <p className="text-gray-500 text-sm italic">No buildings</p>
            ) : (
              <div className="space-y-1">
                {prov.buildings.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span>{BUILDINGS[b]?.icon}</span>
                    <span className="text-white">{BUILDINGS[b]?.name}</span>
                  </div>
                ))}
                {prov.constructing && (
                  <div className="flex items-center gap-2 text-sm text-yellow-400">
                    <span>🔨</span>
                    <span>{BUILDINGS[prov.constructing.type]?.name}</span>
                    <span className="text-xs">({prov.constructing.daysLeft} days)</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Neighbors */}
          <div>
            <p className="text-gray-400 mb-1">Borders:</p>
            <div className="flex flex-wrap gap-1">
              {baseProv.neighbors.map(n => (
                <button
                  key={n}
                  onClick={() => setSelectedProvince(n)}
                  className="text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
                >
                  {PROVINCES[n]?.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Actions for owned provinces */}
          {prov.owner === currentClan && (
            <div className="pt-3 border-t border-gray-700 space-y-2">
              {/* Build button */}
              {!prov.constructing && (
                <button
                  onClick={() => setShowBuildMenu(!showBuildMenu)}
                  className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-500 rounded text-white font-medium flex items-center justify-center gap-2"
                >
                  🏗️ Build Structure
                </button>
              )}
              
              {/* Build menu */}
              {showBuildMenu && (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(BUILDINGS).map(([id, building]) => (
                    <button
                      key={id}
                      onClick={() => startBuilding(id)}
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-left"
                    >
                      <div className="flex items-center gap-1">
                        <span>{building.icon}</span>
                        <span className="text-white text-sm">{building.name}</span>
                      </div>
                      <p className="text-xs text-gray-400">{building.buildTime} days</p>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Move army */}
              {prov.armies > 0 && !selectedArmy && (
                <button
                  onClick={(e) => handleArmyClick(e, selectedProvince)}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded text-white font-medium flex items-center justify-center gap-2"
                >
                  🎌 Move Army
                </button>
              )}
            </div>
          )}
          
          {/* Admin controls */}
          {isAdmin && (
            <div className="pt-3 border-t border-gray-700">
              <p className="text-red-400 text-sm mb-2">⚠️ Admin Controls</p>
              <select
                className="w-full p-2 bg-gray-800 text-white rounded mb-2"
                value={prov.owner}
                onChange={(e) => resolveBattle(selectedProvince, e.target.value)}
              >
                {Object.entries(clans).map(([id, clan]) => (
                  <option key={id} value={id}>{clan.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Movement confirmation panel
  const renderMovementPanel = () => {
    if (!selectedArmy) return null;
    
    return (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/95 rounded-lg border border-gray-700 p-4 shadow-xl">
        <p className="text-white mb-3">
          Moving army from <span className="font-bold text-blue-400">{PROVINCES[selectedArmy.province]?.name}</span>
          {movementTarget && (
            <span> to <span className="font-bold text-green-400">{PROVINCES[movementTarget]?.name}</span></span>
          )}
        </p>
        {!movementTarget && (
          <p className="text-yellow-400 text-sm mb-3">Click a neighboring province to set destination</p>
        )}
        <div className="flex gap-2">
          {movementTarget && (
            <button
              onClick={confirmMovement}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-medium"
            >
              ✓ Confirm Move
            </button>
          )}
          <button
            onClick={cancelMovement}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    );
  };

  // Planned moves panel
  const renderPlannedMovesPanel = () => {
    if (plannedMoves.length === 0) return null;
    
    const myMoves = plannedMoves.filter(m => m.clan === currentClan);
    if (myMoves.length === 0) return null;
    
    return (
      <div className="absolute bottom-4 right-4 w-64 bg-gray-900/95 rounded-lg border border-gray-700 shadow-xl">
        <div className="p-3 border-b border-gray-700">
          <h3 className="text-white font-bold">📋 Planned Moves</h3>
        </div>
        <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
          {myMoves.map(move => (
            <div key={move.id} className="flex items-center justify-between bg-gray-800 rounded p-2">
              <span className="text-sm text-white">
                {PROVINCES[move.from]?.name} → {PROVINCES[move.to]?.name}
              </span>
              <button
                onClick={() => removePlannedMove(move.id)}
                className="text-red-400 hover:text-red-300 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Top bar with game info
  const renderTopBar = () => (
    <div className="absolute top-4 left-4 flex items-center gap-4">
      {/* Week indicator */}
      <div className="bg-gray-900/95 rounded-lg border border-gray-700 px-4 py-2">
        <p className="text-gray-400 text-xs">Current Week</p>
        <p className="text-white font-bold text-xl">Week {currentWeek}</p>
      </div>
      
      {/* Clan selector */}
      <div className="bg-gray-900/95 rounded-lg border border-gray-700 px-4 py-2">
        <p className="text-gray-400 text-xs">Playing as</p>
        <select
          value={currentClan}
          onChange={(e) => setCurrentClan(e.target.value)}
          className="bg-transparent text-white font-bold text-lg focus:outline-none cursor-pointer"
          style={{ color: clans[currentClan]?.color }}
        >
          {Object.entries(clans).filter(([id]) => id !== 'uncontrolled').map(([id, clan]) => (
            <option key={id} value={id} style={{ color: clan.color, backgroundColor: '#1F2937' }}>
              {clan.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Admin toggle */}
      <button
        onClick={() => setIsAdmin(!isAdmin)}
        className={`px-4 py-2 rounded-lg border ${isAdmin ? 'bg-red-900 border-red-600 text-red-300' : 'bg-gray-900/95 border-gray-700 text-gray-400'}`}
      >
        {isAdmin ? '🔓 Admin Mode' : '🔒 Admin'}
      </button>
    </div>
  );

  // Clan legend
  const renderLegend = () => (
    <div className="absolute bottom-4 left-4 bg-gray-900/95 rounded-lg border border-gray-700 p-3">
      <h3 className="text-white font-bold text-sm mb-2">Clans</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {Object.entries(clans).filter(([id]) => id !== 'uncontrolled').map(([id, clan]) => (
          <div key={id} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: clan.color }} />
            <span className="text-xs text-gray-300">{clan.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-gray-950 relative overflow-hidden">
      {/* Map SVG */}
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full"
        style={{ transform: `scale(${mapZoom}) translate(${mapOffset.x}px, ${mapOffset.y}px)` }}
      >
        {/* Background */}
        <rect x="0" y="0" width="800" height="500" fill="#1a1a2e" />
        
        {/* Water pattern */}
        <defs>
          <pattern id="water" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#0c1929" />
            <circle cx="10" cy="10" r="1" fill="#1a3a5c" opacity="0.3" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="800" height="500" fill="url(#water)" />
        
        {/* Japan landmass outline (simplified) */}
        <path
          d="M30,90 Q50,65 100,62 Q150,55 180,50 Q220,48 280,44 Q320,40 380,38 
             Q420,40 480,42 Q540,38 600,30 Q680,22 720,28 Q740,38 730,50 
             Q720,65 700,75 Q680,80 650,78 Q620,75 580,72 Q540,70 500,72 
             Q460,74 420,78 Q380,80 340,82 Q300,80 260,78 Q220,76 180,78 
             Q140,82 100,85 Q60,90 30,90 Z"
          fill="#2d3436"
          stroke="#4a5568"
          strokeWidth="2"
          opacity="0.5"
        />
        
        {/* Province connections (roads) */}
        {Object.entries(PROVINCES).map(([id, prov]) =>
          prov.neighbors.map(neighborId => {
            const neighbor = PROVINCES[neighborId];
            if (id < neighborId) { // Avoid drawing twice
              return (
                <line
                  key={`${id}-${neighborId}`}
                  x1={prov.x * 8}
                  y1={prov.y * 5}
                  x2={neighbor.x * 8}
                  y2={neighbor.y * 5}
                  stroke="#374151"
                  strokeWidth={1}
                  opacity={0.5}
                />
              );
            }
            return null;
          })
        )}
        
        {/* Planned movement arrows */}
        {renderPlannedMoves()}
        
        {/* Current movement arrow */}
        {renderCurrentMovement()}
        
        {/* Provinces */}
        {Object.keys(PROVINCES).map(renderProvince)}
      </svg>
      
      {/* UI Overlays */}
      {renderTopBar()}
      {renderProvinceInfo()}
      {renderMovementPanel()}
      {renderPlannedMovesPanel()}
      {renderLegend()}
      
      {/* Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <h1 className="text-3xl font-bold text-white tracking-wider" style={{ fontFamily: 'serif', textShadow: '2px 2px 4px #000' }}>
          戦国 <span className="text-lg text-gray-400">SENGOKU</span>
        </h1>
      </div>
      
      {/* Zoom controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <button
          onClick={() => setMapZoom(Math.min(2, mapZoom + 0.1))}
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded text-white text-xl"
        >
          +
        </button>
        <button
          onClick={() => setMapZoom(Math.max(0.5, mapZoom - 0.1))}
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded text-white text-xl"
        >
          −
        </button>
      </div>
    </div>
  );
}
