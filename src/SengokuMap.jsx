import React, { useState, useEffect, useRef } from 'react';

// Path index to province ID mapping
const PATH_TO_PROVINCE = {
  0: 'kii', 1: 'satsuma', 2: 'hyuga', 3: 'higo', 4: 'higo',
  5: 'osumi', 6: 'chikugo', 7: 'kozuke', 8: 'hizen', 9: 'chikuzen',
  10: 'buzen', 11: 'bungo', 12: 'iki', 13: 'tsushima', 14: 'tosa',
  15: 'awa_shikoku', 16: 'sanuki', 17: 'iyo', 18: 'awaji', 19: 'nagato',
  20: 'suo', 21: 'aki', 22: 'bingo', 23: 'bitchu', 24: 'bizen',
  25: 'mimasaka', 26: 'harima', 27: 'iwami', 28: 'izumo', 29: 'hoki',
  30: 'oki', 31: 'inaba', 32: 'tajima', 33: 'tamba', 34: 'tango',
  35: 'settsu', 36: 'izumi', 37: 'yamato', 38: 'yamashiro', 39: 'kawachi',
  40: 'wakasa', 41: 'echizen', 42: 'kaga', 43: 'noto', 44: 'etchu',
  45: 'echigo', 46: 'sado', 47: 'iga', 48: 'ise', 49: 'shima',
  50: 'owari', 51: 'mikawa', 52: 'totomi', 53: 'suruga', 54: 'izu',
  55: 'sagami', 56: 'kai', 57: 'musashi', 58: 'awa_kanto', 59: 'kazusa',
  60: 'shimosa', 61: 'hitachi', 62: 'omi', 63: 'mino', 64: 'hida',
  65: 'shinano', 66: 'shimotsuke', 67: 'mutsu', 68: 'dewa',
  69: 'yezo', 70: 'yezo', 71: 'yezo', 72: 'yezo', 73: 'yezo', 74: 'yezo', 75: 'yezo', 76: 'yezo', 77: 'yezo',
};

const PRIMARY_PATH_FOR_PROVINCE = { higo: 3, yezo: 69 };

const PROVINCE_DATA = {
  satsuma: { name: 'Satsuma', resource: 'smithing', neighbors: ['osumi', 'higo'] },
  osumi: { name: 'Osumi', resource: 'farming', neighbors: ['satsuma', 'hyuga'] },
  hyuga: { name: 'Hyuga', resource: 'farming', neighbors: ['osumi', 'higo', 'bungo'] },
  higo: { name: 'Higo', resource: 'horses', neighbors: ['satsuma', 'hyuga', 'bungo', 'chikugo', 'hizen'] },
  bungo: { name: 'Bungo', resource: 'naval', neighbors: ['hyuga', 'higo', 'buzen', 'chikugo'] },
  buzen: { name: 'Buzen', resource: 'craftwork', neighbors: ['bungo', 'chikugo', 'chikuzen', 'nagato'] },
  chikugo: { name: 'Chikugo', resource: 'farming', neighbors: ['higo', 'bungo', 'buzen', 'chikuzen', 'hizen'] },
  chikuzen: { name: 'Chikuzen', resource: 'philosophical', neighbors: ['buzen', 'chikugo', 'hizen', 'nagato'] },
  hizen: { name: 'Hizen', resource: 'naval', neighbors: ['higo', 'chikugo', 'chikuzen', 'iki'] },
  iki: { name: 'Iki', resource: 'naval', neighbors: ['hizen', 'tsushima'] },
  tsushima: { name: 'Tsushima', resource: 'naval', neighbors: ['iki'] },
  tosa: { name: 'Tosa', resource: 'forest', neighbors: ['iyo', 'sanuki', 'awa_shikoku'] },
  iyo: { name: 'Iyo', resource: 'farming', neighbors: ['tosa', 'sanuki'] },
  sanuki: { name: 'Sanuki', resource: 'stone', neighbors: ['tosa', 'iyo', 'awa_shikoku'] },
  awa_shikoku: { name: 'Awa', resource: 'horses', neighbors: ['tosa', 'sanuki'] },
  nagato: { name: 'Nagato', resource: 'farming', neighbors: ['suo', 'iwami', 'buzen', 'chikuzen'] },
  suo: { name: 'Suo', resource: 'horses', neighbors: ['nagato', 'aki', 'iwami'] },
  aki: { name: 'Aki', resource: 'hallowed', neighbors: ['suo', 'bingo', 'iwami'] },
  bingo: { name: 'Bingo', resource: 'naval', neighbors: ['aki', 'bitchu', 'izumo', 'hoki', 'mimasaka'] },
  bitchu: { name: 'Bitchu', resource: 'farming', neighbors: ['bingo', 'bizen', 'mimasaka'] },
  bizen: { name: 'Bizen', resource: 'smithing', neighbors: ['bitchu', 'mimasaka', 'harima'] },
  mimasaka: { name: 'Mimasaka', resource: 'iron', neighbors: ['bitchu', 'bizen', 'bingo', 'hoki', 'harima', 'inaba'] },
  iwami: { name: 'Iwami', resource: 'gold', neighbors: ['nagato', 'suo', 'aki', 'izumo'] },
  izumo: { name: 'Izumo', resource: 'farming', neighbors: ['iwami', 'bingo', 'hoki', 'oki'] },
  hoki: { name: 'Hoki', resource: 'craftwork', neighbors: ['izumo', 'bingo', 'mimasaka', 'inaba'] },
  inaba: { name: 'Inaba', resource: 'naval', neighbors: ['hoki', 'mimasaka', 'harima', 'tajima'] },
  oki: { name: 'Oki', resource: 'fishing', neighbors: ['izumo'] },
  harima: { name: 'Harima', resource: 'farming', neighbors: ['bizen', 'mimasaka', 'inaba', 'tajima', 'tamba', 'settsu'] },
  tajima: { name: 'Tajima', resource: 'farming', neighbors: ['inaba', 'harima', 'tamba', 'tango'] },
  tamba: { name: 'Tamba', resource: 'farming', neighbors: ['tajima', 'harima', 'settsu', 'yamashiro', 'tango', 'wakasa'] },
  tango: { name: 'Tango', resource: 'farming', neighbors: ['tajima', 'tamba', 'wakasa'] },
  settsu: { name: 'Settsu', resource: 'philosophical', neighbors: ['harima', 'tamba', 'kawachi', 'yamashiro', 'yamato', 'izumi', 'awaji'] },
  kawachi: { name: 'Kawachi', resource: 'farming', neighbors: ['settsu', 'yamato', 'kii', 'izumi'] },
  yamashiro: { name: 'Yamashiro', resource: 'philosophical', neighbors: ['tamba', 'settsu', 'omi', 'yamato', 'iga'], special: 'capital' },
  yamato: { name: 'Yamato', resource: 'hallowed', neighbors: ['yamashiro', 'settsu', 'kawachi', 'kii', 'iga', 'ise'] },
  kii: { name: 'Kii', resource: 'forest', neighbors: ['kawachi', 'yamato', 'iga', 'ise', 'izumi'] },
  iga: { name: 'Iga', resource: 'ninja', neighbors: ['yamato', 'kii', 'ise', 'omi', 'yamashiro'] },
  izumi: { name: 'Izumi', resource: 'farming', neighbors: ['kawachi', 'kii', 'settsu'] },
  awaji: { name: 'Awaji', resource: 'fishing', neighbors: ['settsu'] },
  omi: { name: 'Omi', resource: 'farming', neighbors: ['yamashiro', 'iga', 'ise', 'mino', 'wakasa', 'echizen'] },
  wakasa: { name: 'Wakasa', resource: 'farming', neighbors: ['tango', 'tamba', 'omi', 'echizen'] },
  echizen: { name: 'Echizen', resource: 'craftwork', neighbors: ['wakasa', 'omi', 'mino', 'kaga', 'hida'] },
  ise: { name: 'Ise', resource: 'hallowed', neighbors: ['iga', 'omi', 'mino', 'owari', 'kii', 'yamato', 'shima'] },
  shima: { name: 'Shima', resource: 'naval', neighbors: ['ise'] },
  mino: { name: 'Mino', resource: 'farming', neighbors: ['omi', 'echizen', 'ise', 'owari', 'hida', 'shinano'] },
  owari: { name: 'Owari', resource: 'craftwork', neighbors: ['ise', 'mino', 'mikawa'] },
  mikawa: { name: 'Mikawa', resource: 'horses', neighbors: ['owari', 'totomi', 'shinano'] },
  totomi: { name: 'Totomi', resource: 'farming', neighbors: ['mikawa', 'suruga', 'shinano'] },
  suruga: { name: 'Suruga', resource: 'philosophical', neighbors: ['totomi', 'izu', 'kai', 'shinano'] },
  izu: { name: 'Izu', resource: 'gold', neighbors: ['suruga', 'sagami'] },
  kaga: { name: 'Kaga', resource: 'smithing', neighbors: ['echizen', 'noto', 'etchu', 'hida'] },
  noto: { name: 'Noto', resource: 'farming', neighbors: ['kaga', 'etchu'] },
  etchu: { name: 'Etchu', resource: 'farming', neighbors: ['kaga', 'noto', 'hida', 'echigo', 'shinano'] },
  hida: { name: 'Hida', resource: 'forest', neighbors: ['echizen', 'kaga', 'etchu', 'mino', 'shinano'] },
  shinano: { name: 'Shinano', resource: 'stone', neighbors: ['mino', 'mikawa', 'totomi', 'suruga', 'kai', 'hida', 'etchu', 'echigo', 'kozuke', 'musashi'] },
  kai: { name: 'Kai', resource: 'horses', neighbors: ['suruga', 'shinano', 'sagami', 'musashi'] },
  sagami: { name: 'Sagami', resource: 'smithing', neighbors: ['izu', 'kai', 'musashi'] },
  musashi: { name: 'Musashi', resource: 'farming', neighbors: ['sagami', 'kai', 'kozuke', 'shimotsuke', 'shimosa', 'kazusa', 'shinano'] },
  kozuke: { name: 'Kozuke', resource: 'philosophical', neighbors: ['shinano', 'musashi', 'shimotsuke', 'echigo'] },
  shimotsuke: { name: 'Shimotsuke', resource: 'hallowed', neighbors: ['kozuke', 'musashi', 'shimosa', 'hitachi', 'dewa'] },
  shimosa: { name: 'Shimosa', resource: 'farming', neighbors: ['musashi', 'shimotsuke', 'hitachi', 'kazusa'] },
  kazusa: { name: 'Kazusa', resource: 'farming', neighbors: ['musashi', 'shimosa', 'awa_kanto'] },
  awa_kanto: { name: 'Awa', resource: 'naval', neighbors: ['kazusa'] },
  hitachi: { name: 'Hitachi', resource: 'craftwork', neighbors: ['shimotsuke', 'shimosa', 'dewa'] },
  echigo: { name: 'Echigo', resource: 'naval', neighbors: ['etchu', 'shinano', 'kozuke', 'dewa'] },
  sado: { name: 'Sado', resource: 'gold', neighbors: ['echigo'] },
  dewa: { name: 'Dewa', resource: 'stone', neighbors: ['echigo', 'shimotsuke', 'hitachi', 'mutsu'] },
  mutsu: { name: 'Mutsu', resource: 'horses', neighbors: ['dewa', 'yezo'] },
  yezo: { name: 'Yezo', resource: 'fishing', neighbors: ['mutsu'] },
};

const CLANS = {
  shimazu: { id: 'shimazu', name: 'Shimazu', color: '#DC2626', provinces: ['satsuma', 'osumi'] },
  chosokabe: { id: 'chosokabe', name: 'Chōsokabe', color: '#F59E0B', provinces: ['tosa'] },
  mori: { id: 'mori', name: 'Mōri', color: '#059669', provinces: ['aki', 'suo', 'nagato'] },
  oda: { id: 'oda', name: 'Oda', color: '#3B82F6', provinces: ['owari'] },
  takeda: { id: 'takeda', name: 'Takeda', color: '#7C3AED', provinces: ['kai'] },
  uesugi: { id: 'uesugi', name: 'Uesugi', color: '#0891B2', provinces: ['echigo'] },
  hojo: { id: 'hojo', name: 'Hōjō', color: '#DB2777', provinces: ['sagami', 'izu', 'musashi'] },
  date: { id: 'date', name: 'Date', color: '#4F46E5', provinces: ['mutsu', 'dewa'] },
  tokugawa: { id: 'tokugawa', name: 'Tokugawa', color: '#65A30D', provinces: ['mikawa'] },
  imagawa: { id: 'imagawa', name: 'Imagawa', color: '#EA580C', provinces: ['suruga', 'totomi'] },
  uncontrolled: { id: 'uncontrolled', name: 'Neutral', color: '#78716c', provinces: [] },
};

const RESOURCES = {
  smithing: { icon: '⚔️', name: 'Smithing', desc: 'Weapon production' },
  horses: { icon: '🐎', name: 'Horses', desc: 'Cavalry units' },
  gold: { icon: '💰', name: 'Gold', desc: 'Treasury income' },
  iron: { icon: '⛏️', name: 'Iron', desc: 'Armor production' },
  farming: { icon: '🌾', name: 'Farming', desc: 'Food & population' },
  naval: { icon: '⚓', name: 'Naval', desc: 'Ship building' },
  craftwork: { icon: '🏺', name: 'Craftwork', desc: 'Trade goods' },
  ninja: { icon: '🥷', name: 'Ninja', desc: 'Espionage' },
  hallowed: { icon: '⛩️', name: 'Sacred', desc: 'Legitimacy & morale' },
  philosophical: { icon: '📜', name: 'Learning', desc: 'Technology' },
  forest: { icon: '🌲', name: 'Timber', desc: 'Construction' },
  stone: { icon: '🪨', name: 'Stone', desc: 'Fortifications' },
  fishing: { icon: '🐟', name: 'Fishing', desc: 'Coastal food' },
};

// Calculate time until next Thursday midnight (end of planning phase)
const getTimeUntilDeadline = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 4 = Thursday
  let daysUntilThursday = (4 - dayOfWeek + 7) % 7;
  if (daysUntilThursday === 0 && now.getHours() >= 23 && now.getMinutes() >= 59) {
    daysUntilThursday = 7;
  }
  
  const nextThursday = new Date(now);
  nextThursday.setDate(now.getDate() + daysUntilThursday);
  nextThursday.setHours(23, 59, 59, 999);
  
  const diff = nextThursday - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, total: diff };
};

// Get current phase based on day of week
const getCurrentPhase = () => {
  const day = new Date().getDay();
  if (day === 5) return { phase: 'BATTLE', label: 'Battle Day', color: '#DC2626' }; // Friday
  if (day === 6 || day === 0) return { phase: 'BATTLE', label: 'Battle Weekend', color: '#DC2626' }; // Sat/Sun
  return { phase: 'PLANNING', label: 'Planning Phase', color: '#3B82F6' }; // Mon-Thu
};

export default function SengokuMap() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [pathData, setPathData] = useState([]);
  const [provinceCenters, setProvinceCenters] = useState({});
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [week, setWeek] = useState(1);
  const [provinces, setProvinces] = useState(() => {
    const init = {};
    Object.entries(PROVINCE_DATA).forEach(([id, p]) => {
      let owner = 'uncontrolled';
      Object.entries(CLANS).forEach(([cid, c]) => {
        if (c.provinces?.includes(id)) owner = cid;
      });
      init[id] = { ...p, id, owner, armies: owner !== 'uncontrolled' ? 1 : 0, rallyCapacity: 100 };
    });
    return init;
  });
  const [clan, setClan] = useState('oda');
  const [admin, setAdmin] = useState(false);
  const [committedMoves, setCommittedMoves] = useState([]); // Locked in moves
  const [pendingMoves, setPendingMoves] = useState([]); // Can still be changed
  const [selectedArmy, setSelectedArmy] = useState(null);
  const [timeUntilDeadline, setTimeUntilDeadline] = useState(getTimeUntilDeadline());
  const [currentPhase, setCurrentPhase] = useState(getCurrentPhase());
  const [tooltip, setTooltip] = useState(null);
  
  // Pan and zoom state
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 732, h: 777 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilDeadline(getTimeUntilDeadline());
      setCurrentPhase(getCurrentPhase());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Load SVG
  useEffect(() => {
    fetch('/japan-provinces.svg')
      .then(res => res.text())
      .then(svg => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const paths = doc.querySelectorAll('path');
        
        const extracted = [];
        paths.forEach((path) => {
          const d = path.getAttribute('d');
          const id = path.getAttribute('id');
          const style = path.getAttribute('style') || '';
          if (!d || d.trim() === '' || style.includes('fill:#daf0fd')) return;
          extracted.push({ index: extracted.length, id, d });
        });
        
        setPathData(extracted);
      });
  }, []);

  // Calculate province centers
  useEffect(() => {
    if (!svgRef.current || pathData.length === 0) return;
    
    const centers = {};
    const provincePathGroups = {};
    
    pathData.forEach((_, idx) => {
      const provId = PATH_TO_PROVINCE[idx];
      if (!provId) return;
      if (!provincePathGroups[provId]) provincePathGroups[provId] = [];
      provincePathGroups[provId].push(idx);
    });
    
    Object.entries(provincePathGroups).forEach(([provId, pathIndices]) => {
      const primaryIdx = PRIMARY_PATH_FOR_PROVINCE[provId] ?? pathIndices[0];
      const pathEl = svgRef.current.querySelector(`#province-path-${primaryIdx}`);
      
      if (pathEl) {
        try {
          const bbox = pathEl.getBBox();
          centers[provId] = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
        } catch (e) {}
      }
    });
    
    setProvinceCenters(centers);
  }, [pathData]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sengoku-game-state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.provinces) setProvinces(state.provinces);
        if (state.week) setWeek(state.week);
        if (state.committedMoves) setCommittedMoves(state.committedMoves);
        if (state.pendingMoves) setPendingMoves(state.pendingMoves);
      } catch (e) {}
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const state = { provinces, week, committedMoves, pendingMoves };
    localStorage.setItem('sengoku-game-state', JSON.stringify(state));
  }, [provinces, week, committedMoves, pendingMoves]);

  // Pan and zoom handlers
  const handleWheel = (e) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 1.1 : 0.9;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const svgX = viewBox.x + (mouseX / rect.width) * viewBox.w;
    const svgY = viewBox.y + (mouseY / rect.height) * viewBox.h;
    const newW = Math.max(200, Math.min(1500, viewBox.w * scaleFactor));
    const newH = Math.max(200, Math.min(1600, viewBox.h * scaleFactor));
    const newX = svgX - (mouseX / rect.width) * newW;
    const newY = svgY - (mouseY / rect.height) * newH;
    setViewBox({ x: newX, y: newY, w: newW, h: newH });
  };

  const handleMouseDown = (e) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const dx = (e.clientX - panStart.x) * (viewBox.w / rect.width);
    const dy = (e.clientY - panStart.y) * (viewBox.h / rect.height);
    setViewBox(prev => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsPanning(false);
  const resetView = () => setViewBox({ x: 0, y: 0, w: 732, h: 777 });

  const getProvinceId = (pathIndex) => PATH_TO_PROVINCE[pathIndex] || null;
  const getColor = (provId) => {
    if (!provId || !provinces[provId]) return '#78716c';
    return CLANS[provinces[provId].owner]?.color || '#78716c';
  };

  // Get clan border color for territory outlines
  const getClanBorderColor = (provId) => {
    if (!provId || !provinces[provId]) return null;
    const owner = provinces[provId].owner;
    if (owner === 'uncontrolled') return null;
    return CLANS[owner]?.color;
  };

  const handleProvinceClick = (index, e) => {
    if (isPanning) return;
    const provId = getProvinceId(index);
    if (!provId) return;
    
    if (selectedArmy && provinces[selectedArmy].neighbors.includes(provId)) {
      // Add to pending moves (can still be changed)
      const existingMove = pendingMoves.find(m => m.from === selectedArmy && m.clan === clan);
      if (existingMove) {
        setPendingMoves(pendingMoves.map(m => m.id === existingMove.id ? { ...m, to: provId } : m));
      } else {
        setPendingMoves([...pendingMoves, { id: Date.now(), from: selectedArmy, to: provId, clan, committed: false }]);
      }
      setSelectedArmy(null);
      return;
    }
    
    setSelected(provId);
    setSelectedArmy(null);
  };

  const handleProvinceHover = (e, provId) => {
    if (!provId || !provinces[provId]) {
      setTooltip(null);
      return;
    }
    const prov = provinces[provId];
    setTooltip({
      x: e.clientX,
      y: e.clientY,
      province: prov,
      provId
    });
  };

  const startArmyMove = (provId) => {
    if (currentPhase.phase === 'BATTLE') return; // Can't plan during battles
    if (provinces[provId].owner === clan && provinces[provId].armies > 0) {
      setSelectedArmy(provId);
    }
  };

  const commitMove = (moveId) => {
    const move = pendingMoves.find(m => m.id === moveId);
    if (move) {
      setPendingMoves(pendingMoves.filter(m => m.id !== moveId));
      setCommittedMoves([...committedMoves, { ...move, committedAt: Date.now() }]);
    }
  };

  const uncommitMove = (moveId) => {
    const move = committedMoves.find(m => m.id === moveId);
    if (move) {
      // Check if within 12 hour window
      const hoursSinceCommit = (Date.now() - move.committedAt) / (1000 * 60 * 60);
      if (hoursSinceCommit < 12) {
        setCommittedMoves(committedMoves.filter(m => m.id !== moveId));
        setPendingMoves([...pendingMoves, { ...move, committed: false }]);
      }
    }
  };

  const cancelPendingMove = (moveId) => {
    setPendingMoves(pendingMoves.filter(m => m.id !== moveId));
  };

  const cancelMove = () => setSelectedArmy(null);

  // Admin functions
  const changeOwner = (id, newOwner) => setProvinces({ ...provinces, [id]: { ...provinces[id], owner: newOwner } });
  const addArmy = (id) => setProvinces({ ...provinces, [id]: { ...provinces[id], armies: provinces[id].armies + 1 } });
  const removeArmy = (id) => {
    if (provinces[id].armies > 0) setProvinces({ ...provinces, [id]: { ...provinces[id], armies: provinces[id].armies - 1 } });
  };
  const setRallyCapacity = (id, capacity) => setProvinces({ ...provinces, [id]: { ...provinces[id], rallyCapacity: parseInt(capacity) || 0 } });
  const advanceWeek = () => setWeek(w => w + 1);

  const getPathIndicesForProvince = (provId) => {
    const indices = [];
    Object.entries(PATH_TO_PROVINCE).forEach(([idx, pId]) => {
      if (pId === provId) indices.push(parseInt(idx));
    });
    return indices;
  };

  // Sort paths for layering
  const sortedPathData = [...pathData].sort((a, b) => {
    const provA = getProvinceId(a.index);
    const provB = getProvinceId(b.index);
    const aSelected = provA === selected || provA === selectedArmy;
    const bSelected = provB === selected || provB === selectedArmy;
    const aHovered = hovered === provA;
    const bHovered = hovered === provB;
    
    if (aSelected && !bSelected) return 1;
    if (bSelected && !aSelected) return -1;
    if (aHovered && !bHovered) return 1;
    if (bHovered && !aHovered) return -1;
    return 0;
  });

  // Get all moves for current clan
  const clanPendingMoves = pendingMoves.filter(m => m.clan === clan);
  const clanCommittedMoves = committedMoves.filter(m => m.clan === clan);
  const allClanMoves = [...clanPendingMoves, ...clanCommittedMoves];

  return (
    <div className="w-full h-screen bg-slate-900 flex">
      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden" ref={containerRef}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-slate-900/95 to-transparent z-10 flex items-center px-4 gap-4">
          <h1 className="text-2xl font-bold" style={{ color: '#C9A227', fontFamily: 'serif' }}>
            戦国 <span className="text-lg text-slate-300">SENGOKU</span>
          </h1>
          
          <div className="ml-4 bg-slate-800/80 rounded px-3 py-1 border border-slate-700">
            <span className="text-slate-400 text-xs">WEEK</span>
            <span className="text-amber-400 font-bold text-xl ml-2">{week}</span>
          </div>

          {/* Phase indicator */}
          <div className="bg-slate-800/80 rounded px-3 py-1 border border-slate-700">
            <span className="text-xs font-bold" style={{ color: currentPhase.color }}>{currentPhase.label}</span>
          </div>

          {/* Countdown */}
          {currentPhase.phase === 'PLANNING' && (
            <div className="bg-slate-800/80 rounded px-3 py-1 border border-slate-700">
              <span className="text-slate-400 text-xs">Orders lock in: </span>
              <span className="text-amber-400 text-sm font-mono">
                {timeUntilDeadline.days}d {timeUntilDeadline.hours}h {timeUntilDeadline.minutes}m
              </span>
            </div>
          )}

          <div className="flex-1" />
          
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Playing as:</span>
            <select
              value={clan}
              onChange={e => setClan(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded px-2 py-1 font-bold"
              style={{ color: CLANS[clan]?.color }}
            >
              {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
                <option key={id} value={id} style={{ color: '#fff', background: '#1e293b' }}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setAdmin(!admin)}
            className={`px-3 py-1 rounded text-sm font-medium transition ${admin ? 'bg-red-700 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
          >
            {admin ? '🔓 Admin Mode' : '🔒 Admin'}
          </button>
        </div>

        {/* Zoom controls */}
        <div className="absolute top-16 right-4 z-20 flex flex-col gap-1">
          <button onClick={() => setViewBox(v => ({ ...v, w: Math.max(200, v.w * 0.8), h: Math.max(200, v.h * 0.8) }))}
            className="w-8 h-8 bg-slate-800/90 hover:bg-slate-700 border border-slate-600 rounded text-white text-lg font-bold">+</button>
          <button onClick={() => setViewBox(v => ({ ...v, w: Math.min(1500, v.w * 1.2), h: Math.min(1600, v.h * 1.2) }))}
            className="w-8 h-8 bg-slate-800/90 hover:bg-slate-700 border border-slate-600 rounded text-white text-lg font-bold">−</button>
          <button onClick={resetView} className="w-8 h-8 bg-slate-800/90 hover:bg-slate-700 border border-slate-600 rounded text-white text-xs" title="Reset view">⟲</button>
        </div>

        {/* SVG Map */}
        <svg
          ref={svgRef}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          className="w-full h-full"
          style={{ cursor: isPanning ? 'grabbing' : 'default' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="shadow">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.5"/>
            </filter>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
            </marker>
            <marker id="arrowhead-committed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
            </marker>
          </defs>

          {/* Background image */}
          <image href="/japan-map.jpg" x="-625" y="-150" width="1920" height="1080" opacity="0.5" />

          {/* Province paths */}
          {sortedPathData.map((path) => {
            const idx = path.index;
            const provId = getProvinceId(idx);
            const isSelected = provId === selected;
            const isHovered = hovered === provId;
            const isValidTarget = selectedArmy && provId && provId !== selectedArmy && provinces[selectedArmy]?.neighbors?.includes(provId);
            const isArmySelected = provId === selectedArmy;
            const borderColor = getClanBorderColor(provId);
            
            return (
              <path
                key={path.id || idx}
                id={`province-path-${idx}`}
                d={path.d}
                fill={provId ? getColor(provId) : '#64748b'}
                fillOpacity={isSelected || isArmySelected ? 0.95 : isHovered ? 0.85 : 0.7}
                stroke={isArmySelected ? '#22c55e' : isSelected ? '#fbbf24' : isValidTarget ? '#86efac' : borderColor || '#334155'}
                strokeWidth={isSelected || isArmySelected ? 3 : isValidTarget ? 2.5 : borderColor ? 2 : 1}
                filter={isSelected || isArmySelected ? 'url(#glow)' : undefined}
                style={{ cursor: provId ? 'pointer' : 'default', transition: 'all 0.15s' }}
                onClick={(e) => handleProvinceClick(idx, e)}
                onMouseEnter={(e) => { provId && setHovered(provId); handleProvinceHover(e, provId); }}
                onMouseMove={(e) => handleProvinceHover(e, provId)}
                onMouseLeave={() => { setHovered(null); setTooltip(null); }}
              />
            );
          })}

          {/* Province labels */}
          {Object.entries(provinceCenters).map(([provId, center]) => {
            if (!provinces[provId]) return null;
            const prov = provinces[provId];
            const isOwned = prov.owner !== 'uncontrolled';
            const isZoomedIn = viewBox.w < 500; // Show labels only when zoomed in
            
            return (
              <g key={`label-${provId}`} style={{ pointerEvents: 'none' }}>
                {/* Province name - only show when zoomed in */}
                {isZoomedIn && (
                  <text x={center.x} y={center.y - (isOwned && prov.armies > 0 ? 10 : 0)}
                    textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="600" fill="#fff" fontFamily="serif"
                    letterSpacing="0.5"
                    style={{ textShadow: '1px 1px 2px #000, -1px -1px 2px #000, 1px -1px 2px #000, -1px 1px 2px #000' }}>
                    {PROVINCE_DATA[provId]?.name.toUpperCase()}
                  </text>
                )}
                
                {/* Army indicators - always visible */}
                {isOwned && prov.armies > 0 && (
                  <g onClick={(e) => { e.stopPropagation(); startArmyMove(provId); }}
                    style={{ cursor: prov.owner === clan && currentPhase.phase === 'PLANNING' ? 'pointer' : 'default', pointerEvents: 'auto' }}>
                    <circle cx={center.x} cy={center.y + (isZoomedIn ? 6 : 0)} r="8" fill="#1e293b" stroke={prov.owner === clan ? '#fbbf24' : '#64748b'} strokeWidth="1.5" filter="url(#shadow)" />
                    <text x={center.x} y={center.y + (isZoomedIn ? 7 : 1)} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="bold" fill="#fff">
                      {prov.armies}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Movement arrows - Pending (yellow dashed) */}
          {clanPendingMoves.map(move => {
            const from = provinceCenters[move.from];
            const to = provinceCenters[move.to];
            if (!from || !to) return null;
            return (
              <line key={move.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="#fbbf24" strokeWidth="3" strokeDasharray="8,4"
                markerEnd="url(#arrowhead)" opacity="0.8" />
            );
          })}

          {/* Movement arrows - Committed (green solid) */}
          {clanCommittedMoves.map(move => {
            const from = provinceCenters[move.from];
            const to = provinceCenters[move.to];
            if (!from || !to) return null;
            return (
              <line key={move.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="#22c55e" strokeWidth="3"
                markerEnd="url(#arrowhead-committed)" opacity="0.9" />
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div className="fixed bg-slate-800/95 backdrop-blur rounded-lg border border-slate-600 p-2 z-50 pointer-events-none"
            style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}>
            <p className="font-bold text-white" style={{ fontFamily: 'serif' }}>{tooltip.province.name}</p>
            <p className="text-xs" style={{ color: getColor(tooltip.provId) }}>{CLANS[tooltip.province.owner]?.name || 'Neutral'}</p>
            {tooltip.province.armies > 0 && <p className="text-xs text-slate-300">⚔️ {tooltip.province.armies} armies</p>}
          </div>
        )}

        {/* Army Movement UI */}
        {selectedArmy && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-slate-800/95 backdrop-blur rounded-lg border border-slate-600 p-4 z-20 shadow-xl">
            <p className="text-white font-medium mb-2">
              Moving army from <span className="text-amber-400 font-bold">{provinces[selectedArmy]?.name}</span>
            </p>
            <p className="text-green-400 text-sm mb-3">Click a neighboring province (highlighted in green)</p>
            <button onClick={cancelMove} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm">Cancel</button>
          </div>
        )}

        {/* Orders Panel */}
        {(clanPendingMoves.length > 0 || clanCommittedMoves.length > 0) && (
          <div className="absolute bottom-4 right-4 w-72 bg-slate-800/95 backdrop-blur rounded-lg border border-slate-600 z-20 overflow-hidden shadow-xl">
            <div className="p-3 border-b border-slate-700">
              <h3 className="text-white font-bold text-sm">📋 Army Orders</h3>
            </div>
            <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
              {/* Pending moves */}
              {clanPendingMoves.map(m => (
                <div key={m.id} className="bg-amber-900/30 border border-amber-700/50 rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{provinces[m.from]?.name} → {provinces[m.to]?.name}</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    <button onClick={() => commitMove(m.id)} className="flex-1 text-xs py-1 bg-green-700 hover:bg-green-600 rounded text-white">
                      ✓ Commit
                    </button>
                    <button onClick={() => cancelPendingMove(m.id)} className="flex-1 text-xs py-1 bg-red-700 hover:bg-red-600 rounded text-white">
                      ✕ Cancel
                    </button>
                  </div>
                  <p className="text-xs text-amber-400 mt-1">⚠️ Not committed yet</p>
                </div>
              ))}
              
              {/* Committed moves */}
              {clanCommittedMoves.map(m => {
                const hoursSinceCommit = (Date.now() - m.committedAt) / (1000 * 60 * 60);
                const canUncommit = hoursSinceCommit < 12;
                return (
                  <div key={m.id} className="bg-green-900/30 border border-green-700/50 rounded p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">{provinces[m.from]?.name} → {provinces[m.to]?.name}</span>
                      {canUncommit && (
                        <button onClick={() => uncommitMove(m.id)} className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300">
                          Undo
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-green-400 mt-1">
                      ✓ Committed {canUncommit ? `(${Math.round(12 - hoursSinceCommit)}h to change)` : '(locked)'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur rounded-lg border border-slate-600 p-3 z-10">
          <p className="text-slate-400 text-xs font-medium mb-2">CLANS</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
              <div key={id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.color }} />
                <span className="text-xs text-slate-300">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      {selected && provinces[selected] && (
        <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col shadow-xl">
          <div className="p-4 border-b border-slate-700" style={{ background: `linear-gradient(135deg, ${getColor(selected)}50, transparent)` }}>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'serif' }}>{provinces[selected].name}</h2>
              {PROVINCE_DATA[selected]?.special === 'capital' && <span className="text-xl">👑</span>}
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Controlled by: <span className="font-semibold" style={{ color: getColor(selected) }}>{CLANS[provinces[selected].owner]?.name || 'No one'}</span>
            </p>
          </div>
          
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {PROVINCE_DATA[selected]?.resource && (
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <span className="text-2xl">{RESOURCES[PROVINCE_DATA[selected].resource]?.icon}</span>
                <div>
                  <p className="text-white font-medium">{RESOURCES[PROVINCE_DATA[selected].resource]?.name}</p>
                  <p className="text-slate-400 text-xs">{RESOURCES[PROVINCE_DATA[selected].resource]?.desc}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Armies Stationed</p>
                <p className="text-slate-400 text-xs">Military strength</p>
              </div>
              <span className="text-white font-bold text-2xl">{provinces[selected].armies}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Rally Capacity</p>
                <p className="text-slate-400 text-xs">Max recruitable</p>
              </div>
              <span className="text-white font-bold text-xl">{provinces[selected].rallyCapacity || 0}</span>
            </div>

            {provinces[selected].owner === clan && provinces[selected].armies > 0 && currentPhase.phase === 'PLANNING' && (
              <button onClick={() => startArmyMove(selected)} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition">
                🎌 Move Army
              </button>
            )}

            {currentPhase.phase === 'BATTLE' && (
              <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
                <p className="text-red-400 text-sm font-medium">⚔️ Battle Phase</p>
                <p className="text-red-300 text-xs">Army movements locked. Resolve battles in Roblox!</p>
              </div>
            )}

            <div>
              <p className="text-slate-400 text-sm mb-2">Neighboring Provinces:</p>
              <div className="flex flex-wrap gap-1.5">
                {PROVINCE_DATA[selected]?.neighbors?.map(n => (
                  <button key={n} onClick={() => provinces[n] && setSelected(n)}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition"
                    style={{ borderLeft: `3px solid ${getColor(n)}` }}>
                    {PROVINCE_DATA[n]?.name || n}
                  </button>
                ))}
              </div>
            </div>

            {admin && (
              <div className="pt-4 border-t border-slate-600 space-y-3">
                <p className="text-red-400 text-xs font-medium">⚠️ ADMIN CONTROLS</p>
                
                <div>
                  <label className="text-slate-400 text-xs">Change Owner:</label>
                  <select value={provinces[selected].owner} onChange={e => changeOwner(selected, e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-700 text-white rounded border border-slate-600 text-sm">
                    {Object.entries(CLANS).map(([id, c]) => (<option key={id} value={id}>{c.name}</option>))}
                  </select>
                </div>
                
                <div>
                  <label className="text-slate-400 text-xs">Armies:</label>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => removeArmy(selected)} className="flex-1 py-1.5 bg-red-700 hover:bg-red-600 rounded text-white text-sm">- Remove</button>
                    <button onClick={() => addArmy(selected)} className="flex-1 py-1.5 bg-green-700 hover:bg-green-600 rounded text-white text-sm">+ Add</button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs">Rally Capacity:</label>
                  <input
                    type="number"
                    value={provinces[selected].rallyCapacity || 0}
                    onChange={e => setRallyCapacity(selected, e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                  />
                </div>

                <div className="pt-2 border-t border-slate-600">
                  <label className="text-slate-400 text-xs">Game Controls:</label>
                  <button onClick={advanceWeek} className="w-full mt-1 py-1.5 bg-amber-700 hover:bg-amber-600 rounded text-white text-sm">
                    ⏭️ Advance Week ({week} → {week + 1})
                  </button>
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setSelected(null)} className="m-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm transition">Close Panel</button>
        </div>
      )}
    </div>
  );
}
