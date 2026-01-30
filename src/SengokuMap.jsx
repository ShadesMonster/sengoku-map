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
  // Kyushu
  satsuma: { name: 'Satsuma', neighbors: ['osumi', 'higo'], battleType: 'castle' },
  osumi: { name: 'Osumi', neighbors: ['satsuma', 'hyuga'], battleType: 'village' },
  hyuga: { name: 'Hyuga', neighbors: ['osumi', 'higo', 'bungo'], battleType: 'field' },
  higo: { name: 'Higo', neighbors: ['satsuma', 'hyuga', 'bungo', 'chikugo', 'hizen'], battleType: 'village' },
  bungo: { name: 'Bungo', neighbors: ['hyuga', 'higo', 'buzen', 'chikugo'], battleType: 'village' },
  buzen: { name: 'Buzen', neighbors: ['bungo', 'chikugo', 'chikuzen', 'nagato'], battleType: 'field' },
  chikugo: { name: 'Chikugo', neighbors: ['higo', 'bungo', 'buzen', 'chikuzen', 'hizen'], battleType: 'field' },
  chikuzen: { name: 'Chikuzen', neighbors: ['buzen', 'chikugo', 'hizen', 'nagato'], battleType: 'village' },
  hizen: { name: 'Hizen', neighbors: ['higo', 'chikugo', 'chikuzen', 'iki'], battleType: 'village' },
  iki: { name: 'Iki', neighbors: ['hizen', 'tsushima'], battleType: 'field' },
  tsushima: { name: 'Tsushima', neighbors: ['iki'], battleType: 'village' },
  
  // Shikoku
  tosa: { name: 'Tosa', neighbors: ['iyo', 'sanuki', 'awa_shikoku'], battleType: 'castle' },
  iyo: { name: 'Iyo', neighbors: ['tosa', 'sanuki'], battleType: 'village' },
  sanuki: { name: 'Sanuki', neighbors: ['tosa', 'iyo', 'awa_shikoku'], battleType: 'village' },
  awa_shikoku: { name: 'Awa (Shikoku)', neighbors: ['tosa', 'sanuki'], battleType: 'field' },
  
  // Chugoku
  nagato: { name: 'Nagato', neighbors: ['suo', 'iwami', 'buzen', 'chikuzen'], battleType: 'village' },
  suo: { name: 'Suo', neighbors: ['nagato', 'aki', 'iwami'], battleType: 'field' },
  aki: { name: 'Aki', neighbors: ['suo', 'bingo', 'iwami'], battleType: 'castle' },
  bingo: { name: 'Bingo', neighbors: ['aki', 'bitchu', 'izumo', 'hoki', 'mimasaka'], battleType: 'village' },
  bitchu: { name: 'Bitchu', neighbors: ['bingo', 'bizen', 'mimasaka'], battleType: 'field' },
  bizen: { name: 'Bizen', neighbors: ['bitchu', 'mimasaka', 'harima'], battleType: 'village' },
  mimasaka: { name: 'Mimasaka', neighbors: ['bitchu', 'bizen', 'bingo', 'hoki', 'harima', 'inaba'], battleType: 'field' },
  iwami: { name: 'Iwami', neighbors: ['nagato', 'suo', 'aki', 'izumo'], battleType: 'field' },
  izumo: { name: 'Izumo', neighbors: ['iwami', 'bingo', 'hoki', 'oki'], battleType: 'village' },
  hoki: { name: 'Hoki', neighbors: ['izumo', 'bingo', 'mimasaka', 'inaba'], battleType: 'field' },
  inaba: { name: 'Inaba', neighbors: ['hoki', 'mimasaka', 'harima', 'tajima'], battleType: 'village' },
  oki: { name: 'Oki', neighbors: ['izumo'], battleType: 'field' },
  
  // Kinki
  harima: { name: 'Harima', neighbors: ['bizen', 'mimasaka', 'inaba', 'tajima', 'tamba', 'settsu'], battleType: 'village' },
  tajima: { name: 'Tajima', neighbors: ['inaba', 'harima', 'tamba', 'tango'], battleType: 'field' },
  tamba: { name: 'Tamba', neighbors: ['tajima', 'harima', 'settsu', 'yamashiro', 'tango', 'wakasa'], battleType: 'field' },
  tango: { name: 'Tango', neighbors: ['tajima', 'tamba', 'wakasa'], battleType: 'village' },
  settsu: { name: 'Settsu', neighbors: ['harima', 'tamba', 'kawachi', 'yamashiro', 'yamato', 'izumi', 'awaji'], battleType: 'castle' },
  kawachi: { name: 'Kawachi', neighbors: ['settsu', 'yamato', 'kii', 'izumi'], battleType: 'village' },
  yamashiro: { name: 'Yamashiro', neighbors: ['tamba', 'settsu', 'omi', 'yamato', 'iga'], battleType: 'castle', special: 'capital' },
  yamato: { name: 'Yamato', neighbors: ['yamashiro', 'settsu', 'kawachi', 'kii', 'iga', 'ise'], battleType: 'village' },
  kii: { name: 'Kii', neighbors: ['kawachi', 'yamato', 'iga', 'ise', 'izumi'], battleType: 'field' },
  iga: { name: 'Iga', neighbors: ['yamato', 'kii', 'ise', 'omi', 'yamashiro'], battleType: 'village' },
  izumi: { name: 'Izumi', neighbors: ['kawachi', 'kii', 'settsu'], battleType: 'field' },
  awaji: { name: 'Awaji', neighbors: ['settsu'], battleType: 'field' },
  
  // Central Japan (includes Sanryo battlegrounds)
  omi: { name: 'Omi', neighbors: ['yamashiro', 'iga', 'ise', 'mino', 'wakasa', 'echizen'], battleType: 'sanryo' },
  wakasa: { name: 'Wakasa', neighbors: ['tango', 'tamba', 'omi', 'echizen'], battleType: 'village' },
  echizen: { name: 'Echizen', neighbors: ['wakasa', 'omi', 'mino', 'kaga', 'hida'], battleType: 'village' },
  ise: { name: 'Ise', neighbors: ['iga', 'omi', 'mino', 'owari', 'kii', 'yamato', 'shima'], battleType: 'village' },
  shima: { name: 'Shima', neighbors: ['ise'], battleType: 'field' },
  mino: { name: 'Mino', neighbors: ['omi', 'echizen', 'ise', 'owari', 'hida', 'shinano'], battleType: 'sanryo' },
  owari: { name: 'Owari', neighbors: ['ise', 'mino', 'mikawa'], battleType: 'castle' },
  mikawa: { name: 'Mikawa', neighbors: ['owari', 'totomi', 'shinano'], battleType: 'sanryo' },
  totomi: { name: 'Totomi', neighbors: ['mikawa', 'suruga', 'shinano'], battleType: 'village' },
  suruga: { name: 'Suruga', neighbors: ['totomi', 'izu', 'kai', 'shinano'], battleType: 'castle' },
  izu: { name: 'Izu', neighbors: ['suruga', 'sagami'], battleType: 'village' },
  
  // Hokuriku
  kaga: { name: 'Kaga', neighbors: ['echizen', 'noto', 'etchu', 'hida'], battleType: 'village' },
  noto: { name: 'Noto', neighbors: ['kaga', 'etchu'], battleType: 'field' },
  etchu: { name: 'Etchu', neighbors: ['kaga', 'noto', 'hida', 'echigo', 'shinano'], battleType: 'field' },
  hida: { name: 'Hida', neighbors: ['echizen', 'kaga', 'etchu', 'mino', 'shinano'], battleType: 'field' },
  
  // Chubu
  shinano: { name: 'Shinano', neighbors: ['mino', 'mikawa', 'totomi', 'suruga', 'kai', 'hida', 'etchu', 'echigo', 'kozuke', 'musashi'], battleType: 'sanryo' },
  kai: { name: 'Kai', neighbors: ['suruga', 'shinano', 'sagami', 'musashi'], battleType: 'castle' },
  
  // Kanto
  sagami: { name: 'Sagami', neighbors: ['izu', 'kai', 'musashi'], battleType: 'castle' },
  musashi: { name: 'Musashi', neighbors: ['sagami', 'kai', 'kozuke', 'shimotsuke', 'shimosa', 'kazusa', 'shinano'], battleType: 'castle' },
  kozuke: { name: 'Kozuke', neighbors: ['shinano', 'musashi', 'shimotsuke', 'echigo'], battleType: 'village' },
  shimotsuke: { name: 'Shimotsuke', neighbors: ['kozuke', 'musashi', 'shimosa', 'hitachi', 'dewa'], battleType: 'field' },
  shimosa: { name: 'Shimosa', neighbors: ['musashi', 'shimotsuke', 'hitachi', 'kazusa'], battleType: 'field' },
  kazusa: { name: 'Kazusa', neighbors: ['musashi', 'shimosa', 'awa_kanto'], battleType: 'village' },
  awa_kanto: { name: 'Awa (Kanto)', neighbors: ['kazusa'], battleType: 'village' },
  hitachi: { name: 'Hitachi', neighbors: ['shimotsuke', 'shimosa', 'dewa'], battleType: 'village' },
  
  // Hokuriku/Tohoku
  echigo: { name: 'Echigo', neighbors: ['etchu', 'shinano', 'kozuke', 'dewa'], battleType: 'castle' },
  sado: { name: 'Sado', neighbors: ['echigo'], battleType: 'field' },
  dewa: { name: 'Dewa', neighbors: ['echigo', 'shimotsuke', 'hitachi', 'mutsu'], battleType: 'field' },
  mutsu: { name: 'Mutsu', neighbors: ['dewa', 'yezo'], battleType: 'castle' },
  yezo: { name: 'Yezo', neighbors: ['mutsu'], battleType: 'field' },
};

const BATTLE_TYPES = {
  castle: { name: 'Castle Siege', icon: '🏯', desc: 'Fortified stronghold - Defender advantage' },
  village: { name: 'Village Raid', icon: '🏘️', desc: 'Minor settlement - Balanced battle' },
  field: { name: 'Open Field', icon: '⚔️', desc: 'Rural terrain - Attacker advantage' },
  sanryo: { name: 'Sanryō Battleground', icon: '🎌', desc: '3-point control - Strategic territory' },
};

const CLANS = {
  shimazu: { id: 'shimazu', name: 'Shimazu', color: '#8B0000', provinces: ['satsuma', 'osumi'] },
  chosokabe: { id: 'chosokabe', name: 'Chosokabe', color: '#DAA520', provinces: ['tosa'] },
  mori: { id: 'mori', name: 'Mori', color: '#228B22', provinces: ['aki', 'suo', 'nagato'] },
  oda: { id: 'oda', name: 'Oda', color: '#4169E1', provinces: ['owari'] },
  takeda: { id: 'takeda', name: 'Takeda', color: '#663399', provinces: ['kai'] },
  uesugi: { id: 'uesugi', name: 'Uesugi', color: '#008B8B', provinces: ['echigo'] },
  hojo: { id: 'hojo', name: 'Hojo', color: '#C71585', provinces: ['sagami', 'izu', 'musashi'] },
  date: { id: 'date', name: 'Date', color: '#4B0082', provinces: ['mutsu', 'dewa'] },
  tokugawa: { id: 'tokugawa', name: 'Tokugawa', color: '#556B2F', provinces: ['mikawa'] },
  imagawa: { id: 'imagawa', name: 'Imagawa', color: '#D2691E', provinces: ['suruga', 'totomi'] },
  uncontrolled: { id: 'uncontrolled', name: 'Neutral', color: '#5c5347', provinces: [] },
};

const getTimeUntilDeadline = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  let daysUntilThursday = (4 - dayOfWeek + 7) % 7;
  if (daysUntilThursday === 0 && now.getHours() >= 23) daysUntilThursday = 7;
  const nextThursday = new Date(now);
  nextThursday.setDate(now.getDate() + daysUntilThursday);
  nextThursday.setHours(23, 59, 59, 999);
  const diff = nextThursday - now;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  };
};

const getCurrentPhase = () => {
  const day = new Date().getDay();
  if (day === 5 || day === 6 || day === 0) return { phase: 'BATTLE', label: 'BATTLE', color: '#8B0000' };
  return { phase: 'PLANNING', label: 'PLANNING', color: '#2d5016' };
};

// Style constants - Modern dark theme
const S = {
  // Backgrounds
  bgPrimary: '#0f0f0f',
  bgSecondary: '#1a1a1a',
  bgTertiary: '#262626',
  bgHover: '#333333',
  // Wood theme for accents
  woodDark: '#1c1512',
  woodMid: '#2d2420',
  woodLight: '#4a3f38',
  // Text
  textPrimary: '#f5f5f5',
  textSecondary: '#a3a3a3',
  textMuted: '#737373',
  // Parchment (keeping for map elements)
  parchment: '#e7e5e4',
  parchmentDark: '#a8a29e',
  // Semantic
  red: '#dc2626',
  gold: '#fbbf24',
  green: '#22c55e',
  blue: '#3b82f6',
  // Borders
  border: '#333333',
  borderLight: '#404040',
};

export default function SengokuMap() {
  const svgRef = useRef(null);
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
      // New structure: armyPresence is array of {clan, count}
      const armyPresence = owner !== 'uncontrolled' ? [{ clan: owner, count: 1 }] : [];
      init[id] = { ...p, id, owner, armyPresence };
    });
    return init;
  });
  
  // Helper to get total armies at a province
  const getTotalArmies = (prov) => {
    if (!prov?.armyPresence) return prov?.armies || 0; // Fallback for old format
    return prov.armyPresence.reduce((sum, a) => sum + a.count, 0);
  };
  
  // Helper to get a specific clan's armies at a province
  const getClanArmies = (prov, clanId) => {
    if (!prov?.armyPresence) return prov?.owner === clanId ? (prov?.armies || 0) : 0;
    return prov.armyPresence.find(a => a.clan === clanId)?.count || 0;
  };
  
  // Helper to add armies to a province for a clan
  const addArmiesToProvince = (prov, clanId, count) => {
    const newPresence = [...(prov.armyPresence || [])];
    const existing = newPresence.find(a => a.clan === clanId);
    if (existing) {
      existing.count += count;
    } else {
      newPresence.push({ clan: clanId, count });
    }
    return { ...prov, armyPresence: newPresence };
  };
  
  // Helper to remove armies from a province for a clan
  const removeArmiesFromProvince = (prov, clanId, count) => {
    const newPresence = [...(prov.armyPresence || [])];
    const existing = newPresence.find(a => a.clan === clanId);
    if (existing) {
      existing.count = Math.max(0, existing.count - count);
      // Remove entry if count is 0
      if (existing.count === 0) {
        const idx = newPresence.indexOf(existing);
        newPresence.splice(idx, 1);
      }
    }
    return { ...prov, armyPresence: newPresence };
  };
  
  // Clan-level data (rally caps, etc)
  const [clanData, setClanData] = useState(() => {
    const data = {};
    Object.keys(CLANS).forEach(clanId => {
      data[clanId] = { rallyCap: 60 }; // Default 60 = 3 armies max
    });
    return data;
  });
  
  const [clan, setClan] = useState('oda');
  const [admin, setAdmin] = useState(false);
  const [committedMoves, setCommittedMoves] = useState([]);
  const [pendingMoves, setPendingMoves] = useState([]);
  const [selectedArmy, setSelectedArmy] = useState(null);
  const [timeUntilDeadline, setTimeUntilDeadline] = useState(getTimeUntilDeadline());
  const [currentPhase, setCurrentPhase] = useState(getCurrentPhase());
  const [tooltip, setTooltip] = useState(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 732, h: 777 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [activeBattles, setActiveBattles] = useState([]);
  const [pendingAttacks, setPendingAttacks] = useState([]);
  const [pendingLevies, setPendingLevies] = useState([]);
  const [lastProcessedPhase, setLastProcessedPhase] = useState(null);
  const [moveLog, setMoveLog] = useState([]);
  const [armySplitCount, setArmySplitCount] = useState(1);
  const [weekHistory, setWeekHistory] = useState([]); // Array of { week, events: [] }
  const [showHistory, setShowHistory] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [allianceRequests, setAllianceRequests] = useState([]); // { id, from, to, timestamp }
  const [alliances, setAlliances] = useState([]); // { clan1, clan2, formedAt }

  // Helper to check if two clans are allied
  const areAllied = (clan1, clan2) => {
    return alliances.some(a => 
      (a.clan1 === clan1 && a.clan2 === clan2) || 
      (a.clan1 === clan2 && a.clan2 === clan1)
    );
  };
  
  // Helper to get allies of a clan
  const getAllies = (clanId) => {
    return alliances
      .filter(a => a.clan1 === clanId || a.clan2 === clanId)
      .map(a => a.clan1 === clanId ? a.clan2 : a.clan1);
  };
  
  // Helper to get pending requests for a clan
  const getPendingRequests = (clanId) => {
    return allianceRequests.filter(r => r.to === clanId);
  };
  
  // Helper to check if request already sent
  const hasRequestPending = (fromClan, toClan) => {
    return allianceRequests.some(r => 
      (r.from === fromClan && r.to === toClan) ||
      (r.from === toClan && r.to === fromClan)
    );
  };

  // Helper to add event to current week's history
  const addHistoryEvent = (event) => {
    setWeekHistory(prev => {
      const updated = [...prev];
      const currentWeekIdx = updated.findIndex(w => w.week === week);
      if (currentWeekIdx >= 0) {
        updated[currentWeekIdx] = {
          ...updated[currentWeekIdx],
          events: [...updated[currentWeekIdx].events, { ...event, timestamp: Date.now() }]
        };
      } else {
        updated.push({ week, events: [{ ...event, timestamp: Date.now() }] });
      }
      return updated;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilDeadline(getTimeUntilDeadline());
      setCurrentPhase(getCurrentPhase());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Process moves and levies when battle phase starts
  useEffect(() => {
    if (currentPhase.phase === 'BATTLE' && lastProcessedPhase !== `${week}-BATTLE`) {
      // Spawn pending levies first
      if (pendingLevies.length > 0) {
        const newProvinces = { ...provinces };
        pendingLevies.forEach(levy => {
          if (newProvinces[levy.province] && newProvinces[levy.province].owner === levy.clan) {
            newProvinces[levy.province] = addArmiesToProvince(newProvinces[levy.province], levy.clan, 1);
            // Add history event for levy
            addHistoryEvent({
              type: 'levy',
              icon: '🚩',
              text: `${CLANS[levy.clan]?.name} raised levy in ${PROVINCE_DATA[levy.province]?.name}`,
              clan: levy.clan,
              province: levy.province,
            });
          }
        });
        setProvinces(newProvinces);
        setPendingLevies([]);
      }
      
      // Then process moves if any
      if (committedMoves.length > 0) {
        processMovesIntoBattles();
      }
      setLastProcessedPhase(`${week}-BATTLE`);
    }
  }, [currentPhase.phase, week]);

  const processMovesIntoBattles = () => {
    const battles = [];
    const pendingAttacksNew = [];
    const log = [];
    let movesToProcess = [...committedMoves];
    const newProvinces = { ...provinces };
    
    // STEP 0: Merge moves from same clan going to same destination from same origin
    const mergedMoves = [];
    const movesByRoute = new Map();
    
    movesToProcess.forEach(m => {
      const key = `${m.clan}-${m.from}-${m.to}`;
      if (movesByRoute.has(key)) {
        const existing = movesByRoute.get(key);
        existing.armies = (existing.armies || 1) + (m.armies || 1);
        // Keep earliest commit time
        if (m.committedAt < existing.committedAt) existing.committedAt = m.committedAt;
      } else {
        const merged = { ...m, armies: m.armies || 1 };
        movesByRoute.set(key, merged);
        mergedMoves.push(merged);
      }
    });
    movesToProcess = mergedMoves;
    
    // Log all moves
    movesToProcess.forEach(m => {
      log.push({
        type: 'move',
        clan: m.clan,
        from: m.from,
        to: m.to,
        text: `${CLANS[m.clan]?.name} moves ${m.armies} ${m.armies > 1 ? 'armies' : 'army'} from ${PROVINCE_DATA[m.from]?.name} to ${PROVINCE_DATA[m.to]?.name}`
      });
    });
    
    // STEP 1: Group moves by destination to detect multi-clan scenarios
    const movesByDestination = new Map();
    movesToProcess.forEach(m => {
      if (!movesByDestination.has(m.to)) movesByDestination.set(m.to, []);
      movesByDestination.get(m.to).push(m);
    });
    
    // STEP 2: Identify standard collisions (A→B and B→A) - these take priority
    // Allied clans do NOT collide with each other
    const collisions = [];
    const collisionMoveIds = new Set();
    const collisionClans = new Set();
    
    movesToProcess.forEach(m => {
      if (collisionMoveIds.has(m.id)) return;
      const opposing = movesToProcess.find(om => 
        om.from === m.to && om.to === m.from && om.clan !== m.clan && 
        !collisionMoveIds.has(om.id) && !areAllied(m.clan, om.clan)
      );
      if (opposing) {
        collisions.push({ move1: m, move2: opposing });
        collisionMoveIds.add(m.id);
        collisionMoveIds.add(opposing.id);
        collisionClans.add(m.clan);
        collisionClans.add(opposing.clan);
      }
    });
    
    // STEP 3: Process standard collisions
    collisions.forEach(({ move1, move2 }) => {
      const army1 = move1.armies || 1;
      const army2 = move2.armies || 1;
      
      const battleProvince = move1.to;
      
      const attacksOnMove1Origin = movesToProcess.filter(m => 
        !collisionMoveIds.has(m.id) && m.to === move1.from && m.clan !== move1.clan
      );
      const attacksOnMove2Origin = movesToProcess.filter(m => 
        !collisionMoveIds.has(m.id) && m.to === move2.from && m.clan !== move2.clan
      );
      
      const battle = {
        id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'collision',
        battleType: 'sanryo',
        province: battleProvince,
        attacker: move1.clan,
        defender: move2.clan,
        attackerFrom: move1.from,
        defenderFrom: move2.from,
        attackerDest: move1.to,
        defenderDest: move2.to,
        attackerArmies: army1,
        defenderArmies: army2,
        chainInfo: {
          attackerWinsNext: attacksOnMove2Origin.length > 0 ? 
            `Then fights ${CLANS[attacksOnMove2Origin[0]?.clan]?.name} at ${PROVINCE_DATA[move2.from]?.name}` : 
            `Takes ${PROVINCE_DATA[move1.to]?.name}`,
          defenderWinsNext: attacksOnMove1Origin.length > 0 ? 
            `Then fights ${CLANS[attacksOnMove1Origin[0]?.clan]?.name} at ${PROVINCE_DATA[move1.from]?.name}` : 
            `Takes ${PROVINCE_DATA[move2.to]?.name}`,
        }
      };
      
      battles.push(battle);
      
      newProvinces[move1.from] = removeArmiesFromProvince(newProvinces[move1.from], move1.clan, army1);
      newProvinces[move2.from] = removeArmiesFromProvince(newProvinces[move2.from], move2.clan, army2);
      
      log.push({
        type: 'collision',
        text: `⚔️ ${CLANS[move1.clan]?.name} (${army1}) and ${CLANS[move2.clan]?.name} (${army2}) armies collide! Sanryō battle`
      });
    });
    
    // STEP 4: Process remaining moves, handling multi-clan rushes
    const remainingMoves = movesToProcess.filter(m => !collisionMoveIds.has(m.id));
    const processedMoveIds = new Set();
    
    // Group remaining moves by destination
    const remainingByDest = new Map();
    remainingMoves.forEach(m => {
      if (!remainingByDest.has(m.to)) remainingByDest.set(m.to, []);
      remainingByDest.get(m.to).push(m);
    });
    
    // Process each destination
    remainingByDest.forEach((destMoves, destProvId) => {
      let targetProv = newProvinces[destProvId];
      
      // Merge moves from same clan to same destination (combine armies)
      const clanMoves = new Map();
      destMoves.forEach(m => {
        if (clanMoves.has(m.clan)) {
          const existing = clanMoves.get(m.clan);
          existing.armies = (existing.armies || 1) + (m.armies || 1);
          // Keep earliest commit time
          if ((m.committedAt || 0) < (existing.committedAt || Infinity)) {
            existing.committedAt = m.committedAt;
          }
          // Track all source provinces for army deduction
          if (!existing.allFroms) existing.allFroms = [existing.from];
          existing.allFroms.push(m.from);
          existing.allArmyCounts = existing.allArmyCounts || [existing.originalArmies || 1];
          existing.allArmyCounts.push(m.armies || 1);
        } else {
          clanMoves.set(m.clan, { ...m, originalArmies: m.armies || 1 });
        }
      });
      
      const uniqueClans = Array.from(clanMoves.values());
      
      // Sort by commit time (earliest first)
      uniqueClans.sort((a, b) => (a.committedAt || 0) - (b.committedAt || 0));
      
      if (targetProv.owner === 'uncontrolled' && uniqueClans.length > 1) {
        // MULTI-CLAN RUSH ON UNCLAIMED TERRITORY
        // Group clans by alliance blocks
        const allianceBlocks = [];
        const assignedClans = new Set();
        
        uniqueClans.forEach(clanMove => {
          if (assignedClans.has(clanMove.clan)) return;
          
          // Find all allies moving to same destination
          const block = [clanMove];
          assignedClans.add(clanMove.clan);
          
          uniqueClans.forEach(otherMove => {
            if (!assignedClans.has(otherMove.clan) && areAllied(clanMove.clan, otherMove.clan)) {
              block.push(otherMove);
              assignedClans.add(otherMove.clan);
            }
          });
          
          allianceBlocks.push(block);
        });
        
        if (allianceBlocks.length === 1) {
          // ALL movers are allied - no conflict, first committer owns
          const allMoves = allianceBlocks[0];
          allMoves.sort((a, b) => (a.committedAt || 0) - (b.committedAt || 0));
          const firstMove = allMoves[0];
          
          // Total armies from all allied clans - build army presence
          const newArmyPresence = [];
          allMoves.forEach(m => {
            const armyCount = m.armies || 1;
            const src = newProvinces[m.from];
            const available = getClanArmies(src, m.clan);
            if (available >= armyCount) {
              newArmyPresence.push({ clan: m.clan, count: armyCount });
              newProvinces[m.from] = removeArmiesFromProvince(src, m.clan, armyCount);
            }
          });
          
          newProvinces[destProvId] = { ...targetProv, owner: firstMove.clan, armyPresence: newArmyPresence };
          
          const allyNames = allMoves.map(m => CLANS[m.clan]?.name).join(' and ');
          log.push({
            type: 'claim',
            text: `✓ ${allyNames} claim ${PROVINCE_DATA[destProvId]?.name} - ${CLANS[firstMove.clan]?.name} takes control`
          });
          
          uniqueClans.forEach(m => processedMoveIds.add(m.id));
          return; // Skip rest of processing for this destination
        }
        
        // Multiple alliance blocks - first block claims, others contest
        // Sort blocks by earliest commit time
        allianceBlocks.sort((a, b) => {
          const aEarliest = Math.min(...a.map(m => m.committedAt || Infinity));
          const bEarliest = Math.min(...b.map(m => m.committedAt || Infinity));
          return aEarliest - bEarliest;
        });
        
        const claimingBlock = allianceBlocks[0];
        const challengingBlocks = allianceBlocks.slice(1);
        
        // First block claims
        claimingBlock.sort((a, b) => (a.committedAt || 0) - (b.committedAt || 0));
        const firstMove = claimingBlock[0];
        
        let claimingArmies = 0;
        const claimingArmyBreakdown = [];
        claimingBlock.forEach(m => {
          const armyCount = m.armies || 1;
          const src = newProvinces[m.from];
          const available = getClanArmies(src, m.clan);
          if (available >= armyCount) {
            claimingArmies += armyCount;
            claimingArmyBreakdown.push({ clan: m.clan, armies: armyCount });
            newProvinces[m.from] = removeArmiesFromProvince(src, m.clan, armyCount);
          }
        });
        
        // Set up province with claiming armies
        const claimingArmyPresence = claimingArmyBreakdown.map(b => ({ clan: b.clan, count: b.armies }));
        newProvinces[destProvId] = { ...targetProv, owner: firstMove.clan, armyPresence: claimingArmyPresence };
        
        const claimingNames = claimingBlock.map(m => CLANS[m.clan]?.name).join(' and ');
        log.push({
          type: 'claim',
          text: `✓ ${claimingNames} claim ${PROVINCE_DATA[destProvId]?.name} (first to commit)`
        });
        
        // Challenging blocks attack (combined if allied)
        challengingBlocks.forEach((block, blockIdx) => {
          let challengingArmies = 0;
          const challengerClans = [];
          const challengingArmyBreakdown = [];
          
          block.forEach(m => {
            const armyCount = m.armies || 1;
            const src = newProvinces[m.from];
            const available = getClanArmies(src, m.clan);
            if (available >= armyCount) {
              challengingArmies += armyCount;
              challengingArmyBreakdown.push({ clan: m.clan, armies: armyCount });
              newProvinces[m.from] = removeArmiesFromProvince(src, m.clan, armyCount);
            }
            challengerClans.push(m.clan);
          });
          
          // Sort by commit time for ownership
          block.sort((a, b) => (a.committedAt || 0) - (b.committedAt || 0));
          const primaryChallenger = block[0];
          
          battles.push({
            id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${blockIdx}`,
            type: 'attack',
            battleType: PROVINCE_DATA[destProvId]?.battleType || 'field',
            province: destProvId,
            attacker: primaryChallenger.clan,
            attackerAllies: challengerClans.filter(c => c !== primaryChallenger.clan),
            attackerArmyBreakdown: challengingArmyBreakdown,
            defender: firstMove.clan,
            defenderAllies: claimingBlock.filter(m => m.clan !== firstMove.clan).map(m => m.clan),
            defenderArmyBreakdown: claimingArmyBreakdown,
            attackerFrom: primaryChallenger.from,
            attackerArmies: challengingArmies,
            defenderArmies: claimingArmies,
          });
          
          const challengerNames = block.map(m => CLANS[m.clan]?.name).join(' and ');
          log.push({
            type: 'battle',
            text: `⚔️ ${challengerNames} (${challengingArmies}) contest ${claimingNames}'s claim on ${PROVINCE_DATA[destProvId]?.name}!`
          });
        });
        
        // Mark all as processed
        uniqueClans.forEach(m => processedMoveIds.add(m.id));
        
      } else if (targetProv.owner !== 'uncontrolled' && uniqueClans.length > 1) {
        // MULTI-CLAN ATTACK ON CLAIMED TERRITORY (stationary defender)
        // Filter to only attacking clans (not reinforcements or the owner)
        const attackers = uniqueClans.filter(m => m.clan !== targetProv.owner);
        const reinforcement = uniqueClans.find(m => m.clan === targetProv.owner);
        
        // Handle reinforcement first if any (owner moving more armies to their own province)
        if (reinforcement) {
          const armyCount = reinforcement.armies || 1;
          const sourceProv = newProvinces[reinforcement.from];
          const available = getClanArmies(sourceProv, reinforcement.clan);
          if (available >= armyCount) {
            newProvinces[destProvId] = addArmiesToProvince(targetProv, reinforcement.clan, armyCount);
            newProvinces[reinforcement.from] = removeArmiesFromProvince(sourceProv, reinforcement.clan, armyCount);
            targetProv = newProvinces[destProvId]; // Update reference
            log.push({
              type: 'reinforce',
              text: `${CLANS[reinforcement.clan]?.name} reinforces ${PROVINCE_DATA[destProvId]?.name} (+${armyCount})`
            });
          }
          processedMoveIds.add(reinforcement.id);
        }
        
        if (attackers.length > 0) {
          // Group attackers by alliance blocks
          const attackerBlocks = [];
          const assignedAttackers = new Set();
          
          attackers.forEach(attacker => {
            if (assignedAttackers.has(attacker.clan)) return;
            
            const block = [attacker];
            assignedAttackers.add(attacker.clan);
            
            attackers.forEach(other => {
              if (!assignedAttackers.has(other.clan) && areAllied(attacker.clan, other.clan)) {
                block.push(other);
                assignedAttackers.add(other.clan);
              }
            });
            
            attackerBlocks.push(block);
          });
          
          // Sort blocks by earliest commit time
          attackerBlocks.sort((a, b) => {
            const aEarliest = Math.min(...a.map(m => m.committedAt || Infinity));
            const bEarliest = Math.min(...b.map(m => m.committedAt || Infinity));
            return aEarliest - bEarliest;
          });
          
          // Check if defender is allied with any attacker (these become defender allies)
          const defenderAlliesBlock = attackerBlocks.find(block => 
            block.some(m => areAllied(m.clan, targetProv.owner))
          );
          
          // Track defender allies for battle display
          const defenderAllyClans = [];
          const defenderArmyBreakdown = [];
          
          if (defenderAlliesBlock) {
            // Can't attack your ally! Treat as reinforcement
            defenderAlliesBlock.forEach(m => {
              const armyCount = m.armies || 1;
              const src = newProvinces[m.from];
              const available = getClanArmies(src, m.clan);
              if (available >= armyCount) {
                newProvinces[destProvId] = addArmiesToProvince(newProvinces[destProvId], m.clan, armyCount);
                newProvinces[m.from] = removeArmiesFromProvince(src, m.clan, armyCount);
                defenderAllyClans.push(m.clan);
                defenderArmyBreakdown.push({ clan: m.clan, armies: armyCount });
                log.push({
                  type: 'reinforce',
                  text: `${CLANS[m.clan]?.name} reinforces ally ${CLANS[targetProv.owner]?.name} at ${PROVINCE_DATA[destProvId]?.name} (+${armyCount})`
                });
              }
            });
            // Remove this block from attackers
            const idx = attackerBlocks.indexOf(defenderAlliesBlock);
            if (idx > -1) attackerBlocks.splice(idx, 1);
          }
          
          // Refresh targetProv after reinforcements
          targetProv = newProvinces[destProvId];
          
          // Add defender's own armies to breakdown
          const defenderOwnArmies = getClanArmies(targetProv, targetProv.owner);
          if (defenderOwnArmies > 0) {
            defenderArmyBreakdown.unshift({ clan: targetProv.owner, armies: defenderOwnArmies });
          }
          
          if (attackerBlocks.length > 0) {
            // First alliance block attacks, others wait
            const firstBlock = attackerBlocks[0];
            const waitingBlocks = attackerBlocks.slice(1);
            
            // Sort first block by commit time for ownership
            firstBlock.sort((a, b) => (a.committedAt || 0) - (b.committedAt || 0));
            const primaryAttacker = firstBlock[0];
            
            // Deduct armies and track each clan's contribution separately
            let combinedArmies = 0;
            const alliedClans = [];
            const attackerArmyBreakdown = []; // { clan, armies }
            
            firstBlock.forEach(m => {
              let clanArmies = 0;
              if (m.allFroms) {
                m.allFroms.forEach((fromProv, idx) => {
                  const src = newProvinces[fromProv];
                  const armyCount = m.allArmyCounts?.[idx] || 1;
                  const available = getClanArmies(src, m.clan);
                  if (available >= armyCount) {
                    clanArmies += armyCount;
                    combinedArmies += armyCount;
                    newProvinces[fromProv] = removeArmiesFromProvince(src, m.clan, armyCount);
                  }
                });
              } else {
                const src = newProvinces[m.from];
                const armyCount = m.armies || 1;
                const available = getClanArmies(src, m.clan);
                if (available >= armyCount) {
                  clanArmies += armyCount;
                  combinedArmies += armyCount;
                  newProvinces[m.from] = removeArmiesFromProvince(src, m.clan, armyCount);
                }
              }
              attackerArmyBreakdown.push({ clan: m.clan, armies: clanArmies });
              if (m.clan !== primaryAttacker.clan) alliedClans.push(m.clan);
            });
            
            // Deduct armies from waiting blocks too
            const waitingAttackers = [];
            waitingBlocks.forEach(block => {
              block.sort((a, b) => (a.committedAt || 0) - (b.committedAt || 0));
              const blockPrimary = block[0];
              let blockArmies = 0;
              const blockAllies = [];
              const blockArmyBreakdown = [];
              
              block.forEach(m => {
                const src = newProvinces[m.from];
                const armyCount = m.armies || 1;
                const available = getClanArmies(src, m.clan);
                if (available >= armyCount) {
                  blockArmies += armyCount;
                  blockArmyBreakdown.push({ clan: m.clan, armies: armyCount });
                  newProvinces[m.from] = removeArmiesFromProvince(src, m.clan, armyCount);
                }
                if (m.clan !== blockPrimary.clan) blockAllies.push(m.clan);
              });
              
              waitingAttackers.push({
                clan: blockPrimary.clan,
                allies: blockAllies,
                armyBreakdown: blockArmyBreakdown,
                from: blockPrimary.from,
                armies: blockArmies,
              });
            });
            
            const battleType = PROVINCE_DATA[destProvId]?.battleType || 'field';
            const nextInLine = waitingAttackers[0];
            const chainInfo = nextInLine ? {
              attackerWinsNext: `Then fights ${CLANS[nextInLine.clan]?.name}${nextInLine.allies?.length ? ` and allies` : ''} (${nextInLine.armies})`,
              defenderWinsNext: `Then fights ${CLANS[nextInLine.clan]?.name}${nextInLine.allies?.length ? ` and allies` : ''} (${nextInLine.armies})`,
            } : null;
            
            const defenderArmyCount = getTotalArmies(targetProv);
            
            battles.push({
              id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: 'attack',
              battleType: battleType,
              province: destProvId,
              attacker: primaryAttacker.clan,
              attackerAllies: alliedClans,
              attackerArmyBreakdown: attackerArmyBreakdown, // Individual army counts per clan
              defender: targetProv.owner,
              defenderAllies: defenderAllyClans,
              defenderArmyBreakdown: defenderArmyBreakdown.length > 0 ? defenderArmyBreakdown : null,
              attackerFrom: primaryAttacker.from,
              attackerArmies: combinedArmies,
              defenderArmies: defenderArmyCount,
              chainInfo: chainInfo,
              waitingAttackers: waitingAttackers,
            });
            
            const attackerNames = [primaryAttacker.clan, ...alliedClans].map(c => CLANS[c]?.name).join(' and ');
            const defenderNames = [targetProv.owner, ...defenderAllyClans].map(c => CLANS[c]?.name).join(' and ');
            log.push({
              type: 'battle',
              text: `⚔️ ${attackerNames} (${combinedArmies}) attack ${defenderNames} (${defenderArmyCount}) at ${PROVINCE_DATA[destProvId]?.name}`
            });
            
            waitingAttackers.forEach(w => {
              const wNames = [w.clan, ...(w.allies || [])].map(c => CLANS[c]?.name).join(' and ');
              log.push({
                type: 'pending',
                text: `⏳ ${wNames} (${w.armies}) waiting to fight winner at ${PROVINCE_DATA[destProvId]?.name}`
              });
            });
          }
        }
        
        // Mark all as processed
        uniqueClans.forEach(m => processedMoveIds.add(m.id));
        
      } else {
        // Single clan - process normally
        uniqueClans.forEach(m => {
          if (processedMoveIds.has(m.id)) return;
          processedMoveIds.add(m.id);
          
          const armyCount = m.armies || 1;
          const sourceProv = newProvinces[m.from];
          const currentTarget = newProvinces[m.to];
          
          // Check if clan has enough armies at source
          const clanArmiesAtSource = getClanArmies(sourceProv, m.clan);
          if (clanArmiesAtSource < armyCount) {
            log.push({
              type: 'skip',
              text: `${CLANS[m.clan]?.name} order cancelled - not enough armies at ${PROVINCE_DATA[m.from]?.name}`
            });
            return;
          }
          
          if (currentTarget.owner === m.clan || areAllied(currentTarget.owner, m.clan)) {
            // REINFORCEMENT (own territory or ally's territory)
            newProvinces[m.to] = addArmiesToProvince(currentTarget, m.clan, armyCount);
            newProvinces[m.from] = removeArmiesFromProvince(sourceProv, m.clan, armyCount);
            log.push({
              type: 'reinforce',
              text: `${CLANS[m.clan]?.name} reinforces ${PROVINCE_DATA[m.to]?.name} (+${armyCount})`
            });
          } else if (currentTarget.owner === 'uncontrolled') {
            // CLAIM (single clan)
            newProvinces[m.to] = { ...currentTarget, owner: m.clan, armyPresence: [{ clan: m.clan, count: armyCount }] };
            newProvinces[m.from] = removeArmiesFromProvince(sourceProv, m.clan, armyCount);
            log.push({
              type: 'claim',
              text: `✓ ${CLANS[m.clan]?.name} claims ${PROVINCE_DATA[m.to]?.name}`
            });
          } else {
            // ATTACK
            const defenderInCollision = collisionClans.has(currentTarget.owner) && 
              collisions.some(c => 
                (c.move1.clan === currentTarget.owner && c.move1.from === m.to) ||
                (c.move2.clan === currentTarget.owner && c.move2.from === m.to)
              );
            
            const defenderArmies = getTotalArmies(currentTarget);
            
            if (defenderInCollision) {
              pendingAttacksNew.push({
                id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                clan: m.clan,
                from: m.from,
                to: m.to,
                armies: armyCount,
                waitingFor: currentTarget.owner,
              });
              
              newProvinces[m.from] = removeArmiesFromProvince(sourceProv, m.clan, armyCount);
              
              log.push({
                type: 'pending',
                text: `⏳ ${CLANS[m.clan]?.name} (${armyCount}) at ${PROVINCE_DATA[m.to]?.name} - waiting for ${CLANS[currentTarget.owner]?.name}`
              });
            } else if (defenderArmies === 0) {
              // AUTO-WIN
              newProvinces[m.to] = { ...currentTarget, owner: m.clan, armyPresence: [{ clan: m.clan, count: armyCount }] };
              newProvinces[m.from] = removeArmiesFromProvince(sourceProv, m.clan, armyCount);
              log.push({
                type: 'auto-win',
                text: `✓ ${CLANS[m.clan]?.name} takes undefended ${PROVINCE_DATA[m.to]?.name}`
              });
            } else {
              // BATTLE
              const battleType = PROVINCE_DATA[m.to]?.battleType || 'field';
              battles.push({
                id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'attack',
                battleType: battleType,
                province: m.to,
                attacker: m.clan,
                defender: currentTarget.owner,
                attackerFrom: m.from,
                attackerArmies: armyCount,
                defenderArmies: defenderArmies,
              });
              
              newProvinces[m.from] = removeArmiesFromProvince(sourceProv, m.clan, armyCount);
              
              log.push({
                type: 'battle',
                text: `⚔️ ${CLANS[m.clan]?.name} (${armyCount}) attacks ${CLANS[currentTarget.owner]?.name} (${defenderArmies}) at ${PROVINCE_DATA[m.to]?.name}`
              });
            }
          }
        });
      }
    });
    
    setProvinces(newProvinces);
    setActiveBattles(battles);
    setPendingAttacks(pendingAttacksNew);
    setMoveLog(log);
    setCommittedMoves([]);
    setPendingMoves([]);
  };

  useEffect(() => {
    fetch('/japan-provinces.svg').then(r => r.text()).then(svg => {
      const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
      const paths = doc.querySelectorAll('path');
      const extracted = [];
      paths.forEach(path => {
        const d = path.getAttribute('d');
        const style = path.getAttribute('style') || '';
        if (d && d.trim() && !style.includes('fill:#daf0fd')) {
          extracted.push({ index: extracted.length, id: path.getAttribute('id'), d });
        }
      });
      setPathData(extracted);
    });
  }, []);

  useEffect(() => {
    if (!svgRef.current || !pathData.length) return;
    const centers = {};
    const groups = {};
    pathData.forEach((_, idx) => {
      const provId = PATH_TO_PROVINCE[idx];
      if (provId) {
        if (!groups[provId]) groups[provId] = [];
        groups[provId].push(idx);
      }
    });
    Object.entries(groups).forEach(([provId, indices]) => {
      const idx = PRIMARY_PATH_FOR_PROVINCE[provId] ?? indices[0];
      const el = svgRef.current.querySelector(`#province-path-${idx}`);
      if (el) {
        try {
          const bbox = el.getBBox();
          centers[provId] = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
        } catch (e) {}
      }
    });
    setProvinceCenters(centers);
  }, [pathData]);

  useEffect(() => {
    const saved = localStorage.getItem('sengoku-game-state');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.provinces) setProvinces(s.provinces);
        if (s.clanData) setClanData(s.clanData);
        if (s.week) setWeek(s.week);
        if (s.committedMoves) setCommittedMoves(s.committedMoves);
        if (s.pendingMoves) setPendingMoves(s.pendingMoves);
        if (s.activeBattles) setActiveBattles(s.activeBattles);
        if (s.pendingAttacks) setPendingAttacks(s.pendingAttacks);
        if (s.pendingLevies) setPendingLevies(s.pendingLevies);
        if (s.lastProcessedPhase) setLastProcessedPhase(s.lastProcessedPhase);
        if (s.moveLog) setMoveLog(s.moveLog);
        if (s.weekHistory) setWeekHistory(s.weekHistory);
        if (s.allianceRequests) setAllianceRequests(s.allianceRequests);
        if (s.alliances) setAlliances(s.alliances);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sengoku-game-state', JSON.stringify({ provinces, clanData, week, committedMoves, pendingMoves, activeBattles, pendingAttacks, pendingLevies, lastProcessedPhase, moveLog, weekHistory, allianceRequests, alliances }));
  }, [provinces, clanData, week, committedMoves, pendingMoves, activeBattles, pendingAttacks, pendingLevies, lastProcessedPhase, moveLog, weekHistory, allianceRequests, alliances]);

  const resolveBattle = (battleId, winner) => {
    const battle = activeBattles.find(b => b.id === battleId);
    if (!battle) return;
    
    const newProvinces = { ...provinces };
    const loser = winner === battle.attacker ? battle.defender : battle.attacker;
    const winnerArmies = winner === battle.attacker ? battle.attackerArmies : battle.defenderArmies;
    
    const newLog = [...moveLog];
    let newBattles = activeBattles.filter(b => b.id !== battleId);
    let newPendingAttacks = [...pendingAttacks];
    
    if (battle.type === 'collision') {
      // Collision: attacker was going from attackerFrom to attackerDest (=defenderFrom)
      //            defender was going from defenderFrom to defenderDest (=attackerFrom)
      const winnerOrigin = winner === battle.attacker ? battle.attackerFrom : battle.defenderFrom;
      const winnerDest = winner === battle.attacker ? (battle.attackerDest || battle.defenderFrom) : (battle.defenderDest || battle.attackerFrom);
      const loserOrigin = winner === battle.attacker ? battle.defenderFrom : battle.attackerFrom;
      
      newLog.push({
        type: 'result',
        text: `🏆 ${CLANS[winner]?.name} wins collision! ${CLANS[loser]?.name} army destroyed.`
      });
      
      // Check if there's a pending attack waiting at the LOSER's origin
      // (Someone attacked loser's home while they were away - loser is dead, attacker takes it)
      const pendingAtLoserOrigin = newPendingAttacks.find(p => p.to === loserOrigin && p.waitingFor === loser);
      if (pendingAtLoserOrigin) {
        newProvinces[loserOrigin] = { 
          ...newProvinces[loserOrigin], 
          owner: pendingAtLoserOrigin.clan, 
          armies: pendingAtLoserOrigin.armies 
        };
        newLog.push({
          type: 'auto-win',
          text: `✓ ${CLANS[pendingAtLoserOrigin.clan]?.name} takes ${PROVINCE_DATA[loserOrigin]?.name} - ${CLANS[loser]?.name} army destroyed in battle!`
        });
        newPendingAttacks = newPendingAttacks.filter(p => p.id !== pendingAtLoserOrigin.id);
      }
      
      // Check if there's a pending attack waiting at the WINNER's origin
      // (Someone attacked winner's home - winner won but is continuing to their destination, not returning)
      const pendingAtWinnerOrigin = newPendingAttacks.find(p => p.to === winnerOrigin && p.waitingFor === winner);
      if (pendingAtWinnerOrigin) {
        // Winner is NOT returning home (continuing to destination), so pending attacker takes it
        newProvinces[winnerOrigin] = { 
          ...newProvinces[winnerOrigin], 
          owner: pendingAtWinnerOrigin.clan, 
          armies: pendingAtWinnerOrigin.armies 
        };
        newLog.push({
          type: 'auto-win',
          text: `✓ ${CLANS[pendingAtWinnerOrigin.clan]?.name} takes ${PROVINCE_DATA[winnerOrigin]?.name} - ${CLANS[winner]?.name} continued their march!`
        });
        newPendingAttacks = newPendingAttacks.filter(p => p.id !== pendingAtWinnerOrigin.id);
      }
      
      // Now handle winner continuing to their destination
      const targetProv = newProvinces[winnerDest];
      
      // Check if there's a pending attack at winner's destination
      const pendingAtWinnerDest = newPendingAttacks.find(p => p.to === winnerDest);
      
      if (pendingAtWinnerDest) {
        // Someone else is also at this location - battle!
        const newBattleType = PROVINCE_DATA[winnerDest]?.battleType || 'field';
        newBattles.push({
          id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'attack',
          battleType: newBattleType,
          province: winnerDest,
          attacker: pendingAtWinnerDest.clan,
          defender: winner,
          attackerFrom: pendingAtWinnerDest.from,
          attackerArmies: pendingAtWinnerDest.armies,
          defenderArmies: winnerArmies,
        });
        newLog.push({
          type: 'battle',
          text: `⚔️ ${CLANS[winner]?.name} arrives at ${PROVINCE_DATA[winnerDest]?.name} but ${CLANS[pendingAtWinnerDest.clan]?.name} is there!`
        });
        newPendingAttacks = newPendingAttacks.filter(p => p.id !== pendingAtWinnerDest.id);
        // Winner's army arrives and will fight
        newProvinces[winnerDest] = { ...targetProv, owner: winner, armyPresence: [{ clan: winner, count: winnerArmies }] };
      } else if (targetProv.owner === winner || areAllied(targetProv.owner, winner)) {
        // Reinforce own or allied territory
        newProvinces[winnerDest] = addArmiesToProvince(targetProv, winner, winnerArmies);
        newLog.push({
          type: 'reinforce',
          text: `${CLANS[winner]?.name} reinforces ${PROVINCE_DATA[winnerDest]?.name}`
        });
      } else if (targetProv.owner === 'uncontrolled' || getTotalArmies(targetProv) === 0) {
        // Take undefended territory
        const prevOwner = targetProv.owner;
        newProvinces[winnerDest] = { ...targetProv, owner: winner, armyPresence: [{ clan: winner, count: winnerArmies }] };
        if (prevOwner !== 'uncontrolled') {
          newLog.push({
            type: 'auto-win',
            text: `✓ ${CLANS[winner]?.name} takes undefended ${PROVINCE_DATA[winnerDest]?.name} from ${CLANS[prevOwner]?.name}`
          });
        } else {
          newLog.push({
            type: 'claim',
            text: `✓ ${CLANS[winner]?.name} claims ${PROVINCE_DATA[winnerDest]?.name}`
          });
        }
      } else {
        // Must fight the current owner
        const newBattleType = PROVINCE_DATA[winnerDest]?.battleType || 'field';
        newBattles.push({
          id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'attack',
          battleType: newBattleType,
          province: winnerDest,
          attacker: winner,
          defender: targetProv.owner,
          attackerFrom: winnerOrigin,
          attackerArmies: winnerArmies,
          defenderArmies: getTotalArmies(targetProv),
        });
        newLog.push({
          type: 'battle',
          text: `⚔️ ${CLANS[winner]?.name} continues to ${PROVINCE_DATA[winnerDest]?.name} - faces ${CLANS[targetProv.owner]?.name}!`
        });
      }
    } else if (battle.type === 'attack') {
      // Regular attack battle (not collision, not elimination)
      if (winner === battle.attacker) {
        // Attacker wins - takes the province
        // If there are allied attackers, each keeps their own army at the province
        if (battle.attackerArmyBreakdown && battle.attackerArmyBreakdown.length > 1) {
          // Allied victory - primary attacker owns, each clan keeps their armies there
          const primaryClan = battle.attacker;
          
          // Build armyPresence from breakdown
          const newArmyPresence = battle.attackerArmyBreakdown.map(b => ({
            clan: b.clan,
            count: b.armies
          }));
          
          newProvinces[battle.province] = { 
            ...newProvinces[battle.province], 
            owner: primaryClan,
            armyPresence: newArmyPresence
          };
          
          const allyNames = battle.attackerArmyBreakdown.map(b => CLANS[b.clan]?.name).join(' and ');
          newLog.push({
            type: 'result',
            text: `🏆 ${allyNames} conquer ${PROVINCE_DATA[battle.province]?.name}! ${CLANS[battle.attacker]?.name} takes control.`
          });
        } else {
          // Solo attacker
          newProvinces[battle.province] = { 
            ...newProvinces[battle.province], 
            owner: battle.attacker, 
            armyPresence: [{ clan: battle.attacker, count: winnerArmies }]
          };
          newLog.push({
            type: 'result',
            text: `🏆 ${CLANS[winner]?.name} conquers ${PROVINCE_DATA[battle.province]?.name}! ${CLANS[loser]?.name} army destroyed.`
          });
        }
      } else {
        // Defender wins - keeps province, attacker army destroyed
        // Preserve defender army breakdown if it exists (allied defense)
        if (battle.defenderArmyBreakdown && battle.defenderArmyBreakdown.length > 1) {
          // Allied defense - rebuild army presence from breakdown
          // Note: winnerArmies is combined total, but we need to preserve individual counts
          // For now, just keep the breakdown as-is (assuming no casualties on defense)
          const newArmyPresence = battle.defenderArmyBreakdown.map(b => ({
            clan: b.clan,
            count: b.armies
          }));
          newProvinces[battle.province] = { 
            ...newProvinces[battle.province], 
            armyPresence: newArmyPresence
          };
          const defenderNames = battle.defenderArmyBreakdown.map(b => CLANS[b.clan]?.name).join(' and ');
          const attackerNames = battle.attackerArmyBreakdown 
            ? battle.attackerArmyBreakdown.map(b => CLANS[b.clan]?.name).join(' and ')
            : CLANS[battle.attacker]?.name;
          newLog.push({
            type: 'result',
            text: `🛡️ ${defenderNames} defend ${PROVINCE_DATA[battle.province]?.name}! ${attackerNames} army destroyed.`
          });
        } else {
          // Solo defender
          newProvinces[battle.province] = { 
            ...newProvinces[battle.province], 
            armyPresence: [{ clan: battle.defender, count: winnerArmies }]
          };
          const attackerNames = battle.attackerArmyBreakdown 
            ? battle.attackerArmyBreakdown.map(b => CLANS[b.clan]?.name).join(' and ')
            : CLANS[battle.attacker]?.name;
          newLog.push({
            type: 'result',
            text: `🛡️ ${CLANS[winner]?.name} defends ${PROVINCE_DATA[battle.province]?.name}! ${attackerNames} army destroyed.`
          });
        }
      }
      
      // Check for waiting attackers (multi-attacker chain)
      if (battle.waitingAttackers && battle.waitingAttackers.length > 0) {
        const nextAttacker = battle.waitingAttackers[0];
        const remainingAttackers = battle.waitingAttackers.slice(1);
        
        // Next attacker fights the winner (new owner or surviving defender)
        const newDefender = winner;
        const newDefenderArmies = winnerArmies;
        const battleType = PROVINCE_DATA[battle.province]?.battleType || 'field';
        
        // Build chain info for next battle
        const nextInLine = remainingAttackers[0];
        const chainInfo = nextInLine ? {
          attackerWinsNext: `Then fights ${CLANS[nextInLine.clan]?.name} (${nextInLine.armies})`,
          defenderWinsNext: `Then fights ${CLANS[nextInLine.clan]?.name} (${nextInLine.armies})`,
        } : null;
        
        newBattles.push({
          id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'attack',
          battleType: battleType,
          province: battle.province,
          attacker: nextAttacker.clan,
          attackerAllies: nextAttacker.allies || [],
          attackerArmyBreakdown: nextAttacker.armyBreakdown || null,
          defender: newDefender,
          attackerFrom: nextAttacker.from,
          attackerArmies: nextAttacker.armies,
          defenderArmies: newDefenderArmies,
          chainInfo: chainInfo,
          waitingAttackers: remainingAttackers,
        });
        
        const attackerNames = [nextAttacker.clan, ...(nextAttacker.allies || [])].map(c => CLANS[c]?.name).join(' and ');
        newLog.push({
          type: 'battle',
          text: `⚔️ ${attackerNames} (${nextAttacker.armies}) now fights ${CLANS[newDefender]?.name} (${newDefenderArmies}) at ${PROVINCE_DATA[battle.province]?.name}!`
        });
      }
    }
    
    // Handle elimination bracket battles
    if (battle.type === 'elimination') {
      newLog.push({
        type: 'result',
        text: `🏆 ${CLANS[winner]?.name} wins elimination round! ${CLANS[loser]?.name} army destroyed.`
      });
      
      // Check if there are other battles/byes in this bracket
      const sameBracketBattles = newBattles.filter(b => 
        b.bracketTarget === battle.bracketTarget && (b.type === 'elimination' || b.type === 'bye')
      );
      const byeBattle = sameBracketBattles.find(b => b.type === 'bye');
      const otherElimBattles = sameBracketBattles.filter(b => b.type === 'elimination');
      
      if (otherElimBattles.length === 0 && !byeBattle) {
        // This was the last elimination battle - winner fights the claimer
        const claimerProv = newProvinces[battle.bracketTarget];
        newBattles.push({
          id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'attack',
          battleType: PROVINCE_DATA[battle.bracketTarget]?.battleType || 'field',
          province: battle.bracketTarget,
          attacker: winner,
          defender: battle.bracketClaimer,
          attackerFrom: winner === battle.attacker ? battle.attackerFrom : battle.defenderFrom,
          attackerArmies: winnerArmies,
          defenderArmies: battle.bracketClaimerArmies,
        });
        newLog.push({
          type: 'battle',
          text: `⚔️ ${CLANS[winner]?.name} advances to fight ${CLANS[battle.bracketClaimer]?.name} for ${PROVINCE_DATA[battle.bracketTarget]?.name}!`
        });
      } else if (byeBattle) {
        // Winner fights the bye holder
        newBattles = newBattles.filter(b => b.id !== byeBattle.id);
        newBattles.push({
          id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'elimination',
          battleType: 'field',
          province: battle.bracketTarget,
          attacker: winner,
          defender: byeBattle.attacker,
          attackerFrom: winner === battle.attacker ? battle.attackerFrom : battle.defenderFrom,
          defenderFrom: byeBattle.attackerFrom,
          attackerArmies: winnerArmies,
          defenderArmies: byeBattle.attackerArmies,
          bracketRound: (battle.bracketRound || 1) + 1,
          bracketTarget: battle.bracketTarget,
          bracketClaimer: battle.bracketClaimer,
          bracketClaimerArmies: battle.bracketClaimerArmies,
          chainInfo: {
            attackerWinsNext: 'Advances to fight claimer',
            defenderWinsNext: 'Advances to fight claimer',
          }
        });
        newLog.push({
          type: 'battle',
          text: `⚔️ ${CLANS[winner]?.name} vs ${CLANS[byeBattle.attacker]?.name} (bracket semi-final)`
        });
      } else if (otherElimBattles.length === 1) {
        // There's one other elimination battle - wait for it, then winners fight
        // Mark this winner as waiting
        newBattles.push({
          id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'bye',
          battleType: 'field',
          province: battle.bracketTarget,
          attacker: winner,
          attackerFrom: winner === battle.attacker ? battle.attackerFrom : battle.defenderFrom,
          attackerArmies: winnerArmies,
          bracketRound: (battle.bracketRound || 1) + 1,
          bracketTarget: battle.bracketTarget,
          bracketClaimer: battle.bracketClaimer,
          bracketClaimerArmies: battle.bracketClaimerArmies,
        });
        newLog.push({
          type: 'pending',
          text: `⏳ ${CLANS[winner]?.name} awaits other bracket results`
        });
      }
    }
    
    // Add history event for battle result
    if (battle.type === 'collision') {
      addHistoryEvent({
        type: 'collision',
        icon: '⚔️',
        text: `${CLANS[winner]?.name} and ${CLANS[loser]?.name} clash - ${CLANS[winner]?.name} wins`,
        winner,
        loser,
      });
    } else if (battle.type === 'attack') {
      if (winner === battle.attacker) {
        addHistoryEvent({
          type: 'conquest',
          icon: '🏆',
          text: `${CLANS[winner]?.name} defeats ${CLANS[loser]?.name} for ${PROVINCE_DATA[battle.province]?.name}`,
          winner,
          loser,
          province: battle.province,
        });
      } else {
        addHistoryEvent({
          type: 'defense',
          icon: '🛡️',
          text: `${CLANS[winner]?.name} defends ${PROVINCE_DATA[battle.province]?.name} from ${CLANS[loser]?.name}`,
          winner,
          loser,
          province: battle.province,
        });
      }
    } else if (battle.type === 'elimination') {
      addHistoryEvent({
        type: 'elimination',
        icon: '⚔️',
        text: `${CLANS[winner]?.name} defeats ${CLANS[loser]?.name} in bracket for ${PROVINCE_DATA[battle.bracketTarget]?.name}`,
        winner,
        loser,
        province: battle.bracketTarget,
      });
    }
    
    setProvinces(newProvinces);
    setActiveBattles(newBattles);
    setPendingAttacks(newPendingAttacks);
    setMoveLog(newLog);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const svgX = viewBox.x + (mx / rect.width) * viewBox.w;
    const svgY = viewBox.y + (my / rect.height) * viewBox.h;
    const nw = Math.max(200, Math.min(1500, viewBox.w * scale));
    const nh = Math.max(200, Math.min(1600, viewBox.h * scale));
    setViewBox({ x: svgX - (mx / rect.width) * nw, y: svgY - (my / rect.height) * nh, w: nw, h: nh });
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
    const rect = svgRef.current.getBoundingClientRect();
    const dx = (e.clientX - panStart.x) * (viewBox.w / rect.width);
    const dy = (e.clientY - panStart.y) * (viewBox.h / rect.height);
    setViewBox(v => ({ ...v, x: v.x - dx, y: v.y - dy }));
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Advance to next week
  const advanceWeek = () => {
    // Ensure current week has a history entry
    const currentWeekHistory = weekHistory.find(w => w.week === week);
    if (!currentWeekHistory) {
      setWeekHistory(prev => [...prev, { week, events: [] }]);
    }
    
    // Clear current week state
    setMoveLog([]);
    setActiveBattles([]);
    setPendingAttacks([]);
    setPendingMoves([]);
    setCommittedMoves([]);
    
    // Increment week
    setWeek(prev => prev + 1);
    setLastProcessedPhase(null);
    
    // Add week start event to new week
    addHistoryEvent({
      type: 'weekstart',
      icon: '📅',
      text: `Week ${week + 1} begins`,
    });
  };

  const getColor = (provId) => CLANS[provinces[provId]?.owner]?.color || '#5c5347';

  // Calculate available armies at a province for the current clan (total minus already committed/pending)
  const getAvailableArmies = (provId) => {
    const prov = provinces[provId];
    // Get this clan's armies at this province
    const total = getClanArmies(prov, clan);
    const pendingFrom = pendingMoves.filter(m => m.from === provId && m.clan === clan).reduce((sum, m) => sum + (m.armies || 1), 0);
    const committedFrom = committedMoves.filter(m => m.from === provId && m.clan === clan).reduce((sum, m) => sum + (m.armies || 1), 0);
    return total - pendingFrom - committedFrom;
  };

  const handleProvinceClick = (idx) => {
    if (isPanning) return;
    const provId = PATH_TO_PROVINCE[idx];
    if (!provId) return;
    
    if (selectedArmy && provinces[selectedArmy].neighbors.includes(provId)) {
      const availableArmies = getAvailableArmies(selectedArmy);
      
      if (availableArmies <= 0) {
        // No armies available to move
        setSelectedArmy(null);
        setArmySplitCount(1);
        return;
      }
      
      // Create move with the selected army count
      const armiesToMove = Math.min(armySplitCount, availableArmies);
      setPendingMoves([...pendingMoves, { 
        id: Date.now(), 
        from: selectedArmy, 
        to: provId, 
        clan,
        armies: armiesToMove
      }]);
      
      setSelectedArmy(null);
      setArmySplitCount(1);
      return;
    }
    setSelected(provId);
    setSelectedArmy(null);
    setArmySplitCount(1);
  };

  const startArmyMove = (provId) => {
    if (currentPhase.phase === 'BATTLE') return;
    const available = getAvailableArmies(provId);
    // Allow move if this clan has armies here (regardless of ownership)
    if (available > 0) {
      setSelectedArmy(provId);
      setArmySplitCount(available); // Default to all available
    }
  };

  const commitMove = (id) => {
    const move = pendingMoves.find(m => m.id === id);
    if (move) {
      setPendingMoves(pendingMoves.filter(m => m.id !== id));
      setCommittedMoves([...committedMoves, { ...move, committedAt: Date.now() }]);
    }
  };

  const uncommitMove = (id) => {
    const move = committedMoves.find(m => m.id === id);
    if (move && (Date.now() - move.committedAt) / 3600000 < 12) {
      setCommittedMoves(committedMoves.filter(m => m.id !== id));
      setPendingMoves([...pendingMoves, move]);
    }
  };

  const sortedPaths = [...pathData].sort((a, b) => {
    const pA = PATH_TO_PROVINCE[a.index], pB = PATH_TO_PROVINCE[b.index];
    const ownerA = provinces[pA]?.owner, ownerB = provinces[pB]?.owner;
    const unclaimedA = ownerA === 'uncontrolled', unclaimedB = ownerB === 'uncontrolled';
    const selA = pA === selected || pA === selectedArmy, selB = pB === selected || pB === selectedArmy;
    const hovA = hovered === pA, hovB = hovered === pB;
    
    // Selected/hovered ALWAYS on top (even if unclaimed)
    if (selA && !selB) return 1;
    if (selB && !selA) return -1;
    if (hovA && !hovB) return 1;
    if (hovB && !hovA) return -1;
    
    // Then unclaimed render behind claimed
    if (unclaimedA && !unclaimedB) return -1;
    if (unclaimedB && !unclaimedA) return 1;
    
    return 0;
  });

  const isZoomedIn = viewBox.w < 500;
  const clanPending = pendingMoves.filter(m => m.clan === clan);
  const clanCommitted = committedMoves.filter(m => m.clan === clan);

  return (
    <div className="w-full h-screen flex" style={{ background: S.bgPrimary, fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
      <div className="flex-1 relative overflow-hidden">
        
        {/* Header - Cleaner modern design */}
        <div className="absolute top-0 left-0 right-0 z-10" style={{ 
          background: 'linear-gradient(180deg, rgba(15,15,15,0.98) 0%, rgba(15,15,15,0.9) 80%, transparent 100%)',
          padding: '12px 20px',
        }}>
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span style={{ color: S.gold, fontSize: '24px', fontWeight: '700' }}>戦国</span>
              <div style={{ width: 1, height: 24, background: S.border }} />
              <span style={{ color: S.textSecondary, fontSize: '11px', letterSpacing: '2px', fontWeight: 500 }}>SENGOKU</span>
            </div>
            
            {/* Week Badge */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              padding: '6px 14px', 
              background: S.bgTertiary, 
              borderRadius: 6,
              border: `1px solid ${S.border}`,
            }}>
              <span style={{ color: S.textMuted, fontSize: 11 }}>Week</span>
              <span style={{ color: S.textPrimary, fontSize: 16, fontWeight: 700 }}>{week}</span>
            </div>

            {/* Phase Badge */}
            <div style={{ 
              padding: '8px 16px', 
              borderRadius: 6,
              background: currentPhase.phase === 'BATTLE' ? 'rgba(220,38,38,0.15)' : 'rgba(34,197,94,0.15)',
              border: `1px solid ${currentPhase.phase === 'BATTLE' ? S.red : S.green}`,
            }}>
              <span style={{ 
                color: currentPhase.phase === 'BATTLE' ? S.red : S.green, 
                fontSize: 12, 
                fontWeight: 600, 
                letterSpacing: '0.5px' 
              }}>
                {currentPhase.label}
              </span>
            </div>

            {/* Deadline Timer */}
            {currentPhase.phase === 'PLANNING' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: S.textMuted, fontSize: 11 }}>Deadline</span>
                <span style={{ 
                  color: S.gold, 
                  fontSize: 13, 
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {timeUntilDeadline.days}d {timeUntilDeadline.hours}h {timeUntilDeadline.minutes}m
                </span>
              </div>
            )}

            <div className="flex-1" />

            {/* Clan Selector */}
            <select 
              value={clan} 
              onChange={e => setClan(e.target.value)} 
              style={{ 
                background: S.bgTertiary, 
                border: `2px solid ${CLANS[clan]?.color}`, 
                color: S.textPrimary, 
                padding: '8px 16px', 
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
                <option key={id} value={id} style={{ background: S.bgSecondary, color: S.textPrimary }}>{c.name}</option>
              ))}
            </select>

            <button 
              onClick={() => setAdmin(!admin)} 
              style={{ 
                background: admin ? 'rgba(220,38,38,0.15)' : S.bgTertiary, 
                border: `1px solid ${admin ? S.red : S.border}`, 
                color: admin ? S.red : S.textSecondary, 
                padding: '8px 14px', 
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              {admin ? '⚙ ADMIN' : 'ADMIN'}
            </button>
          </div>
        </div>

        {/* Zoom + History + Dashboard - Cleaner pill buttons */}
        <div className="absolute top-20 right-4 z-20 flex flex-col gap-2">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            background: S.bgSecondary, 
            borderRadius: 8, 
            border: `1px solid ${S.border}`,
            overflow: 'hidden',
          }}>
            {[{ l: '+', a: () => setViewBox(v => ({ ...v, w: Math.max(200, v.w * 0.8), h: Math.max(200, v.h * 0.8) })) },
              { l: '−', a: () => setViewBox(v => ({ ...v, w: Math.min(1500, v.w * 1.2), h: Math.min(1600, v.h * 1.2) })) },
              { l: '⌂', a: () => setViewBox({ x: 0, y: 0, w: 732, h: 777 }) }].map((b, i) => (
              <button 
                key={i} 
                onClick={b.a} 
                style={{ 
                  width: 36, 
                  height: 36, 
                  background: 'transparent', 
                  border: 'none',
                  borderBottom: i < 2 ? `1px solid ${S.border}` : 'none',
                  color: S.textSecondary, 
                  fontSize: 16,
                  cursor: 'pointer',
                }}
              >
                {b.l}
              </button>
            ))}
          </div>
          <button 
            onClick={() => { setShowDashboard(!showDashboard); setShowHistory(false); }} 
            style={{ 
              width: 36, 
              height: 36, 
              background: showDashboard ? CLANS[clan]?.color : S.bgSecondary,
              border: `1px solid ${showDashboard ? CLANS[clan]?.color : S.border}`,
              borderRadius: 8,
              color: showDashboard ? '#fff' : S.textSecondary,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            📊
          </button>
          <button 
            onClick={() => { setShowHistory(!showHistory); setShowDashboard(false); }} 
            style={{ 
              width: 36, 
              height: 36, 
              background: showHistory ? S.gold : S.bgSecondary,
              border: `1px solid ${showHistory ? S.gold : S.border}`,
              borderRadius: 8,
              color: showHistory ? S.bgPrimary : S.textSecondary,
              fontSize: 14,
              cursor: 'pointer',
            }} 
            title="History"
          >
            📜
          </button>
        </div>
        
        {/* CSS for pulse animation */}
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}</style>

        {/* Clan Dashboard Panel */}
        {showDashboard && (() => {
          const clanProvinces = Object.entries(provinces).filter(([_, p]) => p.owner === clan);
          const totalArmies = clanProvinces.reduce((sum, [_, p]) => sum + (p.armies || 0), 0);
          const clanPendingLevies = pendingLevies.filter(l => l.clan === clan);
          const clanMoves = [...pendingMoves.filter(m => m.clan === clan), ...committedMoves.filter(m => m.clan === clan)];
          const rallyCap = clanData[clan]?.rallyCap || 0;
          const maxArmies = Math.floor(rallyCap / 20);
          const myAllies = getAllies(clan);
          const incomingRequests = getPendingRequests(clan);
          const otherClans = Object.keys(CLANS).filter(c => c !== clan && c !== 'uncontrolled');
          
          return (
            <div className="absolute top-24 left-4 z-20" style={{ width: 340, maxHeight: 'calc(100vh - 200px)', background: S.woodMid, border: `3px solid ${CLANS[clan]?.color}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '12px 16px', borderBottom: `2px solid ${S.woodLight}`, background: `linear-gradient(135deg, ${CLANS[clan]?.color}40, ${S.woodDark})` }}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 style={{ color: CLANS[clan]?.color, fontSize: '16px', fontWeight: '700' }}>{CLANS[clan]?.name}</h3>
                    <p style={{ color: S.parchmentDark, fontSize: 10 }}>Clan Dashboard</p>
                  </div>
                  <button onClick={() => setShowDashboard(false)} style={{ background: 'none', border: 'none', color: S.parchmentDark, fontSize: 16 }}>×</button>
                </div>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
                {/* Summary Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                  <div style={{ background: S.woodDark, padding: 12, textAlign: 'center' }}>
                    <p style={{ color: S.gold, fontSize: 24, fontWeight: '700' }}>{clanProvinces.length}</p>
                    <p style={{ color: S.parchmentDark, fontSize: 10 }}>Provinces</p>
                  </div>
                  <div style={{ background: S.woodDark, padding: 12, textAlign: 'center' }}>
                    <p style={{ color: S.gold, fontSize: 24, fontWeight: '700' }}>
                      {totalArmies}
                      {clanPendingLevies.length > 0 && <span style={{ color: '#4a7c23', fontSize: 14 }}> +{clanPendingLevies.length}</span>}
                    </p>
                    <p style={{ color: S.parchmentDark, fontSize: 10 }}>Armies</p>
                  </div>
                </div>
                
                {/* Rally Capacity */}
                <div style={{ background: S.woodDark, padding: 12, marginBottom: 16 }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ color: S.parchment, fontSize: 11 }}>Rally Capacity</span>
                    <span style={{ color: S.gold, fontSize: 12, fontWeight: '600' }}>{totalArmies + clanPendingLevies.length} / {maxArmies}</span>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${maxArmies > 0 ? (totalArmies / maxArmies) * 100 : 0}%`, height: '100%', background: S.gold }} />
                    {clanPendingLevies.length > 0 && (
                      <div style={{ width: `${maxArmies > 0 ? (clanPendingLevies.length / maxArmies) * 100 : 0}%`, height: '100%', background: '#4a7c23', marginTop: -8, marginLeft: `${maxArmies > 0 ? (totalArmies / maxArmies) * 100 : 0}%` }} />
                    )}
                  </div>
                  <p style={{ color: S.parchmentDark, fontSize: 9, marginTop: 4 }}>{rallyCap} men total ({maxArmies} armies max)</p>
                </div>
                
                {/* Provinces List */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ color: S.parchmentDark, fontSize: 10, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Your Provinces</p>
                  {clanProvinces.length === 0 ? (
                    <p style={{ color: S.parchmentDark, fontSize: 11, fontStyle: 'italic' }}>No provinces owned</p>
                  ) : (
                    clanProvinces.map(([provId, prov]) => {
                      const hasLevyQueued = pendingLevies.some(l => l.province === provId && l.clan === clan);
                      const canRaiseLevyHere = !hasLevyQueued && (totalArmies + clanPendingLevies.length < maxArmies) && currentPhase.phase === 'PLANNING';
                      const battle = activeBattles.find(b => b.province === provId);
                      
                      return (
                        <div key={provId} style={{ background: 'rgba(0,0,0,0.2)', padding: 8, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ flex: 1 }}>
                            <button 
                              onClick={() => { setSelected(provId); setShowDashboard(false); }}
                              style={{ background: 'none', border: 'none', color: S.parchment, fontSize: 12, fontWeight: '600', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                            >
                              {PROVINCE_DATA[provId]?.name}
                            </button>
                            {battle && <span style={{ color: S.red, fontSize: 9, marginLeft: 6 }}>⚔️</span>}
                            {hasLevyQueued && <span style={{ color: '#4a7c23', fontSize: 9, marginLeft: 6 }}>+1 levy</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span style={{ color: S.gold, fontWeight: '600', fontSize: 14 }}>{prov.armies}</span>
                            {canRaiseLevyHere && (
                              <button 
                                onClick={() => setPendingLevies([...pendingLevies, { id: Date.now(), province: provId, clan }])}
                                style={{ background: '#2d5016', border: 'none', color: S.parchment, fontSize: 9, padding: '2px 6px' }}
                              >
                                +Levy
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                {/* Pending Orders */}
                {(clanMoves.length > 0 || clanPendingLevies.length > 0) && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ color: S.parchmentDark, fontSize: 10, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Pending Orders</p>
                    
                    {clanMoves.map(m => (
                      <div key={m.id} style={{ background: 'rgba(45,80,22,0.2)', padding: 6, marginBottom: 4, fontSize: 10, borderLeft: `2px solid ${m.committedAt ? '#2d5016' : S.gold}` }}>
                        <span style={{ color: S.parchment }}>
                          {PROVINCE_DATA[m.from]?.name} → {PROVINCE_DATA[m.to]?.name}
                          {m.armies > 1 && <span style={{ color: '#4a7c23' }}> ×{m.armies}</span>}
                        </span>
                        <span style={{ color: S.parchmentDark, marginLeft: 8 }}>
                          {m.committedAt ? '✓ committed' : 'pending'}
                        </span>
                      </div>
                    ))}
                    
                    {clanPendingLevies.map(l => (
                      <div key={l.id} style={{ background: 'rgba(45,80,22,0.2)', padding: 6, marginBottom: 4, fontSize: 10, borderLeft: `2px solid #4a7c23` }}>
                        <span style={{ color: S.parchment }}>🚩 Raise levy at {PROVINCE_DATA[l.province]?.name}</span>
                        <button 
                          onClick={() => setPendingLevies(pendingLevies.filter(x => x.id !== l.id))}
                          style={{ background: S.red, border: 'none', color: S.parchment, fontSize: 8, padding: '1px 4px', marginLeft: 8 }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Active Battles */}
                {activeBattles.filter(b => b.attacker === clan || b.defender === clan).length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ color: S.red, fontSize: 10, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Active Battles</p>
                    {activeBattles.filter(b => b.attacker === clan || b.defender === clan).map(b => (
                      <div key={b.id} style={{ background: 'rgba(139,0,0,0.2)', padding: 6, marginBottom: 4, fontSize: 10 }}>
                        <span style={{ color: S.parchment }}>
                          ⚔️ {PROVINCE_DATA[b.province]?.name}: 
                          <span style={{ color: CLANS[b.attacker]?.color }}> {CLANS[b.attacker]?.name}</span>
                          <span style={{ color: S.parchmentDark }}> vs </span>
                          <span style={{ color: CLANS[b.defender]?.color }}>{CLANS[b.defender]?.name}</span>
                        </span>
                        <button 
                          onClick={() => { setSelected(b.province); setShowDashboard(false); }}
                          style={{ background: S.woodDark, border: `1px solid ${S.woodLight}`, color: S.parchment, fontSize: 8, padding: '1px 4px', marginLeft: 8 }}
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Incoming Alliance Requests */}
                {incomingRequests.length > 0 && (
                  <div style={{ marginBottom: 16, background: `rgba(184,134,11,0.2)`, border: `2px solid ${S.gold}`, padding: 12 }}>
                    <p style={{ color: S.gold, fontSize: 10, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>⚠️ Alliance Requests</p>
                    {incomingRequests.map(req => (
                      <div key={req.id} style={{ background: 'rgba(0,0,0,0.2)', padding: 8, marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ color: CLANS[req.from]?.color, fontWeight: '600', fontSize: 12 }}>
                            {CLANS[req.from]?.name}
                          </span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                // Accept alliance
                                setAlliances([...alliances, { clan1: req.from, clan2: req.to, formedAt: Date.now() }]);
                                setAllianceRequests(allianceRequests.filter(r => r.id !== req.id));
                                addHistoryEvent({
                                  type: 'alliance',
                                  icon: '🤝',
                                  text: `${CLANS[req.to]?.name} and ${CLANS[req.from]?.name} form alliance`,
                                  clan1: req.from,
                                  clan2: req.to,
                                });
                              }}
                              style={{ background: '#2d5016', border: 'none', color: S.parchment, fontSize: 9, padding: '4px 8px' }}
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => setAllianceRequests(allianceRequests.filter(r => r.id !== req.id))}
                              style={{ background: S.red, border: 'none', color: S.parchment, fontSize: 9, padding: '4px 8px' }}
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Current Allies */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ color: S.parchmentDark, fontSize: 10, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>🤝 Allies</p>
                  {myAllies.length === 0 ? (
                    <p style={{ color: S.parchmentDark, fontSize: 11, fontStyle: 'italic' }}>No alliances</p>
                  ) : (
                    myAllies.map(allyId => (
                      <div key={allyId} style={{ background: 'rgba(0,0,0,0.2)', padding: 8, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: CLANS[allyId]?.color, fontWeight: '600', fontSize: 12 }}>
                          {CLANS[allyId]?.name}
                        </span>
                        <button 
                          onClick={() => {
                            setAlliances(alliances.filter(a => 
                              !((a.clan1 === clan && a.clan2 === allyId) || (a.clan1 === allyId && a.clan2 === clan))
                            ));
                            addHistoryEvent({
                              type: 'alliance_broken',
                              icon: '💔',
                              text: `${CLANS[clan]?.name} breaks alliance with ${CLANS[allyId]?.name}`,
                              clan1: clan,
                              clan2: allyId,
                            });
                          }}
                          style={{ background: S.red, border: 'none', color: S.parchment, fontSize: 8, padding: '2px 6px' }}
                        >
                          Break
                        </button>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Send Alliance Request */}
                <div>
                  <p style={{ color: S.parchmentDark, fontSize: 10, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Diplomacy</p>
                  {(() => {
                    const availableClans = otherClans.filter(c => !areAllied(clan, c) && !hasRequestPending(clan, c));
                    return availableClans.length > 0 ? (
                      <div className="flex gap-2">
                        <select 
                          id="diplomacy-target"
                          defaultValue=""
                          style={{ flex: 1, padding: 8, background: S.woodDark, border: `1px solid ${S.woodLight}`, color: S.parchment, fontSize: 11 }}
                        >
                          <option value="" disabled>Select clan...</option>
                          {availableClans.map(c => (
                            <option key={c} value={c} style={{ background: S.woodDark }}>{CLANS[c]?.name}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => {
                            const select = document.getElementById('diplomacy-target');
                            if (select.value) {
                              setAllianceRequests([...allianceRequests, {
                                id: Date.now(),
                                from: clan,
                                to: select.value,
                                timestamp: Date.now(),
                              }]);
                              select.value = '';
                            }
                          }}
                          style={{ padding: '8px 12px', background: '#2d5016', border: 'none', color: S.parchment, fontSize: 10 }}
                        >
                          Send Request
                        </button>
                      </div>
                    ) : (
                      <p style={{ color: S.parchmentDark, fontSize: 10, fontStyle: 'italic' }}>No clans available</p>
                    );
                  })()}
                  {allianceRequests.filter(r => r.from === clan).length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <p style={{ color: S.parchmentDark, fontSize: 9, marginBottom: 4 }}>Pending sent:</p>
                      {allianceRequests.filter(r => r.from === clan).map(req => (
                        <span key={req.id} style={{ color: CLANS[req.to]?.color, fontSize: 10, marginRight: 8 }}>
                          {CLANS[req.to]?.name}
                          <button 
                            onClick={() => setAllianceRequests(allianceRequests.filter(r => r.id !== req.id))}
                            style={{ background: 'none', border: 'none', color: S.red, fontSize: 10, marginLeft: 2, cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* History Panel */}
        {showHistory && (
          <div className="absolute top-24 left-4 z-20" style={{ width: 320, maxHeight: 'calc(100vh - 200px)', background: S.woodMid, border: `3px solid ${S.woodLight}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: `2px solid ${S.woodLight}`, background: S.woodDark }}>
              <div className="flex justify-between items-center">
                <h3 style={{ color: S.parchment, fontSize: '14px', fontWeight: '600' }}>📜 Chronicle</h3>
                <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', color: S.parchmentDark, fontSize: 16 }}>×</button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
              {weekHistory.length === 0 ? (
                <p style={{ color: S.parchmentDark, fontSize: 11, fontStyle: 'italic' }}>No events recorded yet</p>
              ) : (
                [...weekHistory].reverse().map(weekData => (
                  <div key={weekData.week} style={{ marginBottom: 16 }}>
                    <div style={{ background: S.woodDark, padding: '6px 10px', marginBottom: 8, borderLeft: `3px solid ${S.gold}` }}>
                      <span style={{ color: S.gold, fontWeight: '600', fontSize: 12 }}>Week {weekData.week}</span>
                    </div>
                    {weekData.events.length === 0 ? (
                      <p style={{ color: S.parchmentDark, fontSize: 10, fontStyle: 'italic', paddingLeft: 8 }}>No events</p>
                    ) : (
                      weekData.events.map((event, idx) => (
                        <div key={idx} style={{ padding: '4px 8px', borderBottom: `1px solid ${S.woodLight}20`, fontSize: 11 }}>
                          <span style={{ marginRight: 6 }}>{event.icon}</span>
                          <span style={{ color: S.parchment }}>{event.text}</span>
                        </div>
                      ))
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Map */}
        <svg ref={svgRef} viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`} className="w-full h-full" style={{ cursor: isPanning ? 'grabbing' : 'default' }}
          onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <defs>
            <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="shadow"><feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.5"/></filter>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill={S.gold} /></marker>
            <marker id="arrow-c" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#2d5016" /></marker>
            
            {/* Land texture pattern */}
            <pattern id="landTexture" patternUnits="userSpaceOnUse" width="100" height="100">
              <rect width="100" height="100" fill="#6b6b6b"/>
              <circle cx="10" cy="10" r="1" fill="#5a5a5a" opacity="0.5"/>
              <circle cx="30" cy="25" r="1.5" fill="#7a7a7a" opacity="0.4"/>
              <circle cx="50" cy="5" r="1" fill="#5a5a5a" opacity="0.5"/>
              <circle cx="70" cy="30" r="1" fill="#7a7a7a" opacity="0.4"/>
              <circle cx="90" cy="15" r="1.5" fill="#5a5a5a" opacity="0.5"/>
              <circle cx="15" cy="50" r="1" fill="#7a7a7a" opacity="0.4"/>
              <circle cx="40" cy="60" r="1.5" fill="#5a5a5a" opacity="0.5"/>
              <circle cx="60" cy="45" r="1" fill="#7a7a7a" opacity="0.4"/>
              <circle cx="80" cy="55" r="1" fill="#5a5a5a" opacity="0.5"/>
              <circle cx="5" cy="80" r="1.5" fill="#7a7a7a" opacity="0.4"/>
              <circle cx="25" cy="90" r="1" fill="#5a5a5a" opacity="0.5"/>
              <circle cx="55" cy="85" r="1" fill="#7a7a7a" opacity="0.4"/>
              <circle cx="75" cy="75" r="1.5" fill="#5a5a5a" opacity="0.5"/>
              <circle cx="95" cy="95" r="1" fill="#7a7a7a" opacity="0.4"/>
              <path d="M0,20 Q25,15 50,20 T100,20" stroke="#5a5a5a" strokeWidth="0.5" fill="none" opacity="0.3"/>
              <path d="M0,50 Q25,45 50,50 T100,50" stroke="#7a7a7a" strokeWidth="0.5" fill="none" opacity="0.2"/>
              <path d="M0,80 Q25,75 50,80 T100,80" stroke="#5a5a5a" strokeWidth="0.5" fill="none" opacity="0.3"/>
            </pattern>
            
            <filter id="landNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
              <feDiffuseLighting in="noise" lightingColor="#6b6b6b" surfaceScale="1.5" result="light">
                <feDistantLight azimuth="45" elevation="60"/>
              </feDiffuseLighting>
              <feBlend in="SourceGraphic" in2="light" mode="multiply"/>
            </filter>
          </defs>

          <image href="/japan-map.jpg" x="-625" y="-150" width="1920" height="1080" style={{ filter: 'brightness(0.9)' }} />

          {/* LAYER 1: Land texture base */}
          {pathData.map(path => {
            const provId = PATH_TO_PROVINCE[path.index];
            if (!provId) return null;
            return (
              <path
                key={`land-${path.index}`}
                d={path.d}
                fill="url(#landTexture)"
                stroke="none"
                style={{ pointerEvents: 'none' }}
              />
            );
          })}

          {/* LAYER 2: Unclaimed province fills */}
          {sortedPaths.map(path => {
            const provId = PATH_TO_PROVINCE[path.index];
            const owner = provId && provinces[provId]?.owner;
            if (owner && owner !== 'uncontrolled') return null;
            const isSel = provId === selected, isHov = hovered === provId;
            const isArmy = provId === selectedArmy;
            
            return (
              <path 
                key={`fill-unclaimed-${path.index}`} 
                id={`province-path-${path.index}`} 
                d={path.d}
                fill={provId ? getColor(provId) : '#5c5347'}
                fillOpacity={isSel || isArmy ? 1 : isHov ? 0.85 : 0.75}
                stroke="none"
                style={{ pointerEvents: 'none' }}
              />
            );
          })}

          {/* LAYER 3: Unclaimed outer borders */}
          {sortedPaths.map(path => {
            const provId = PATH_TO_PROVINCE[path.index];
            const owner = provId && provinces[provId]?.owner;
            if (owner && owner !== 'uncontrolled') return null;
            if (provId === hovered || provId === selected) return null;
            return (
              <path
                key={`outer-border-unclaimed-${path.index}`}
                d={path.d}
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="3"
                strokeLinejoin="round"
                style={{ pointerEvents: 'none' }}
              />
            );
          })}

          {/* LAYER 4: Unclaimed inner borders */}
          {sortedPaths.map(path => {
            const provId = PATH_TO_PROVINCE[path.index];
            const owner = provId && provinces[provId]?.owner;
            if (owner && owner !== 'uncontrolled') return null;
            if (provId === hovered || provId === selected) return null;
            return (
              <path
                key={`inner-border-unclaimed-${path.index}`}
                d={path.d}
                fill="none"
                stroke="#5a5a5a"
                strokeWidth="1.5"
                strokeLinejoin="round"
                style={{ pointerEvents: 'none' }}
              />
            );
          })}

          {/* LAYER 5: Claimed province fills */}
          {sortedPaths.map(path => {
            const provId = PATH_TO_PROVINCE[path.index];
            const owner = provId && provinces[provId]?.owner;
            if (!owner || owner === 'uncontrolled') return null;
            const isSel = provId === selected, isHov = hovered === provId;
            const isArmy = provId === selectedArmy;
            
            return (
              <path 
                key={`fill-claimed-${path.index}`}
                id={`province-path-${path.index}`}
                d={path.d}
                fill={getColor(provId)}
                fillOpacity={isSel || isArmy ? 1 : isHov ? 0.85 : 0.75}
                stroke="none"
                style={{ pointerEvents: 'none' }}
              />
            );
          })}

          {/* LAYER 6: Claimed outer borders */}
          {sortedPaths.map(path => {
            const provId = PATH_TO_PROVINCE[path.index];
            const owner = provId && provinces[provId]?.owner;
            if (!owner || owner === 'uncontrolled') return null;
            if (provId === hovered || provId === selected) return null;
            return (
              <path
                key={`outer-border-claimed-${path.index}`}
                d={path.d}
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="3"
                strokeLinejoin="round"
                style={{ pointerEvents: 'none' }}
              />
            );
          })}
          
          {/* LAYER 7: Claimed inner borders */}
          {sortedPaths.map(path => {
            const provId = PATH_TO_PROVINCE[path.index];
            const owner = provId && provinces[provId]?.owner;
            if (!owner || owner === 'uncontrolled') return null;
            if (provId === hovered || provId === selected) return null;
            const border = CLANS[owner]?.color;
            if (!border) return null;
            return (
              <path
                key={`inner-border-claimed-${path.index}`}
                d={path.d}
                fill="none"
                stroke={border}
                strokeWidth="1.5"
                strokeLinejoin="round"
                style={{ pointerEvents: 'none' }}
              />
            );
          })}

          {/* LAYER 8: Hovered/Selected province border (on top) */}
          {(hovered || selected) && sortedPaths.map(path => {
            const provId = PATH_TO_PROVINCE[path.index];
            if (provId !== hovered && provId !== selected) return null;
            const owner = provId && provinces[provId]?.owner;
            const isUnclaimed = !owner || owner === 'uncontrolled';
            const border = isUnclaimed ? '#8a8a8a' : CLANS[owner]?.color;
            
            return (
              <g key={`hover-border-${path.index}`}>
                <path
                  d={path.d}
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  style={{ pointerEvents: 'none' }}
                />
                <path
                  d={path.d}
                  fill="none"
                  stroke={border}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  style={{ pointerEvents: 'none' }}
                />
              </g>
            );
          })}

          {/* LAYER 9: Interaction overlay (clickable) */}
          {sortedPaths.map(path => {
            const provId = PATH_TO_PROVINCE[path.index];
            const isSel = provId === selected;
            const isArmy = provId === selectedArmy;
            const isTarget = selectedArmy && provId && provId !== selectedArmy && provinces[selectedArmy]?.neighbors?.includes(provId);
            
            return (
              <path 
                key={`interact-${path.index}`} 
                d={path.d}
                fill="transparent"
                stroke={isArmy ? '#2d5016' : isSel ? S.gold : isTarget ? '#4a7c23' : 'none'}
                strokeWidth={isSel || isArmy ? 3 : isTarget ? 2.5 : 0}
                strokeLinejoin="round"
                filter={isSel || isArmy ? 'url(#glow)' : undefined}
                style={{ cursor: provId ? 'pointer' : 'default', transition: 'all 0.15s' }}
                onClick={() => handleProvinceClick(path.index)}
                onMouseEnter={() => provId && setHovered(provId)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}

          {/* LAYER 10: Movement arrows */}
          {clanPending.map(m => {
            const f = provinceCenters[m.from], t = provinceCenters[m.to];
            return f && t ? <line key={m.id} x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke={S.gold} strokeWidth="3" strokeDasharray="8,4" markerEnd="url(#arrow)" opacity="0.8" /> : null;
          })}
          {clanCommitted.map(m => {
            const f = provinceCenters[m.from], t = provinceCenters[m.to];
            return f && t ? <line key={m.id} x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke="#2d5016" strokeWidth="3" markerEnd="url(#arrow-c)" opacity="0.9" /> : null;
          })}

          {/* LAYER 11: Province names and army banners (on top of everything) */}
          {Object.entries(provinceCenters).map(([provId, c]) => {
            const prov = provinces[provId];
            if (!prov) return null;
            const owned = prov.owner !== 'uncontrolled';
            
            // Check if there's an active battle at this province
            const battle = activeBattles.find(b => b.province === provId && b.type !== 'bye');
            
            // Check if there's a pending attack at this province
            const pending = pendingAttacks.find(p => p.to === provId);
            
            // Get all armies contesting this province in bracket (byes + elimination battles)
            const bracketArmies = activeBattles.filter(b => 
              b.bracketTarget === provId || (b.province === provId && (b.type === 'elimination' || b.type === 'bye'))
            );
            
            // Manual position offsets for specific provinces
            const labelOffsets = {
              buzen: { x: 0, y: 8 },      // Move south
              chikuzen: { x: 0, y: -6 },  // Move north
            };
            const offset = labelOffsets[provId] || { x: 0, y: 0 };
            
            // Absolute positions for specific provinces
            const absolutePositions = {
              mutsu: { x: 540.132 },
            };
            const absPos = absolutePositions[provId];
            
            const cx = absPos?.x ?? (c.x + offset.x);
            const cy = absPos?.y ?? (c.y + offset.y);
            
            // Collect all unique clans contesting this province
            const contestingClans = new Set();
            bracketArmies.forEach(b => {
              if (b.attacker) contestingClans.add(b.attacker);
              if (b.defender) contestingClans.add(b.defender);
            });
            const hasMultipleContestants = contestingClans.size > 0;
            
            // Get waiting attackers from any battle at this province
            const battleWithQueue = activeBattles.find(b => b.province === provId && b.waitingAttackers?.length > 0);
            const waitingAttackersList = battleWithQueue?.waitingAttackers || [];
            
            return (
              <g key={provId} style={{ pointerEvents: 'none' }}>
                {isZoomedIn && <text x={cx} y={cy - (owned && getTotalArmies(prov) > 0 ? 6 : 0) - (battle || pending || hasMultipleContestants || waitingAttackersList.length > 0 ? 10 : 0)} textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="600" fill={S.parchment} letterSpacing="0.5" style={{ textShadow: '1px 1px 2px #000, -1px -1px 2px #000' }}>{PROVINCE_DATA[provId]?.name.toUpperCase()}</text>}
                
                {/* Active Battle Indicator - show both armies clashing */}
                {battle && battle.type !== 'bye' && (
                  <g>
                    {/* Battle crossed swords icon */}
                    <text x={cx} y={cy - (isZoomedIn ? 2 : 8)} textAnchor="middle" dominantBaseline="middle" fontSize="10" style={{ filter: 'drop-shadow(0 0 2px #000)' }}>⚔️</text>
                    
                    {/* Attacker banner(s) - show each allied clan separately if breakdown exists */}
                    {battle.attackerArmyBreakdown && battle.attackerArmyBreakdown.length > 1 ? (
                      // Multiple allied attackers - show each one
                      battle.attackerArmyBreakdown.map((ab, idx) => (
                        <g key={`attacker-${ab.clan}`}>
                          <path d={`M${cx - 18 - (idx * 13)} ${cy + (isZoomedIn ? 6 : 0)} h12 v8 l-3 -2 l-3 2 l-3 -2 l-3 2 v-8 z`} fill={CLANS[ab.clan]?.color} stroke="#000" strokeWidth="1" filter="url(#shadow)" />
                          <text x={cx - 12 - (idx * 13)} y={cy + (isZoomedIn ? 11 : 5)} textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="bold" fill="#fff" style={{ textShadow: '0 0 2px #000' }}>{ab.armies}</text>
                        </g>
                      ))
                    ) : (
                      // Single attacker
                      <g>
                        <path d={`M${cx - 18} ${cy + (isZoomedIn ? 6 : 0)} h12 v8 l-3 -2 l-3 2 l-3 -2 l-3 2 v-8 z`} fill={CLANS[battle.attacker]?.color} stroke="#000" strokeWidth="1" filter="url(#shadow)" />
                        <text x={cx - 12} y={cy + (isZoomedIn ? 11 : 5)} textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="bold" fill="#fff" style={{ textShadow: '0 0 2px #000' }}>{battle.attackerArmies}</text>
                      </g>
                    )}
                    
                    {/* Defender banner(s) - show each allied defender separately if breakdown exists */}
                    {battle.defender && (
                      battle.defenderArmyBreakdown && battle.defenderArmyBreakdown.length > 1 ? (
                        // Multiple allied defenders - show each one
                        battle.defenderArmyBreakdown.map((db, idx) => (
                          <g key={`defender-${db.clan}`}>
                            <path d={`M${cx + 6 + (idx * 13)} ${cy + (isZoomedIn ? 6 : 0)} h12 v8 l-3 -2 l-3 2 l-3 -2 l-3 2 v-8 z`} fill={CLANS[db.clan]?.color} stroke="#000" strokeWidth="1" filter="url(#shadow)" />
                            <text x={cx + 12 + (idx * 13)} y={cy + (isZoomedIn ? 11 : 5)} textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="bold" fill="#fff" style={{ textShadow: '0 0 2px #000' }}>{db.armies}</text>
                          </g>
                        ))
                      ) : (
                        // Single defender
                        <g>
                          <path d={`M${cx + 6} ${cy + (isZoomedIn ? 6 : 0)} h12 v8 l-3 -2 l-3 2 l-3 -2 l-3 2 v-8 z`} fill={CLANS[battle.defender]?.color} stroke="#000" strokeWidth="1" filter="url(#shadow)" />
                          <text x={cx + 12} y={cy + (isZoomedIn ? 11 : 5)} textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="bold" fill="#fff" style={{ textShadow: '0 0 2px #000' }}>{battle.defenderArmies}</text>
                        </g>
                      )
                    )}
                    
                    {/* Show waiting armies below - from bracket OR from waitingAttackers queue */}
                    {(bracketArmies.length > 1 || waitingAttackersList.length > 0) && (
                      <g>
                        {/* Bracket waiting armies */}
                        {Array.from(contestingClans).filter(c => c !== battle.attacker && c !== battle.defender).map((clanId, idx) => {
                          const armyData = bracketArmies.find(b => b.attacker === clanId || b.defender === clanId);
                          const armies = armyData?.attacker === clanId ? armyData.attackerArmies : armyData?.defenderArmies;
                          return (
                            <g key={clanId}>
                              <path d={`M${cx - 18 + (idx * 14)} ${cy + (isZoomedIn ? 20 : 14)} h10 v6 l-2.5 -1.5 l-2.5 1.5 l-2.5 -1.5 l-2.5 1.5 v-6 z`} fill={CLANS[clanId]?.color} stroke={S.gold} strokeWidth="0.5" strokeDasharray="1,1" opacity="0.7" />
                              <text x={cx - 13 + (idx * 14)} y={cy + (isZoomedIn ? 24 : 18)} textAnchor="middle" dominantBaseline="middle" fontSize="5" fontWeight="bold" fill="#fff" style={{ textShadow: '0 0 2px #000' }}>{armies || '?'}</text>
                            </g>
                          );
                        })}
                        {/* Queue waiting attackers */}
                        {waitingAttackersList.map((w, idx) => {
                          const offsetIdx = idx + contestingClans.size - 2; // Offset by bracket armies already shown
                          return (
                            <g key={`wait-${w.clan}-${idx}`}>
                              <path d={`M${cx - 18 + (offsetIdx * 14)} ${cy + (isZoomedIn ? 20 : 14)} h10 v6 l-2.5 -1.5 l-2.5 1.5 l-2.5 -1.5 l-2.5 1.5 v-6 z`} fill={CLANS[w.clan]?.color} stroke={S.gold} strokeWidth="0.5" strokeDasharray="1,1" opacity="0.7" />
                              <text x={cx - 13 + (offsetIdx * 14)} y={cy + (isZoomedIn ? 24 : 18)} textAnchor="middle" dominantBaseline="middle" fontSize="5" fontWeight="bold" fill="#fff" style={{ textShadow: '0 0 2px #000' }}>{w.armies}</text>
                            </g>
                          );
                        })}
                      </g>
                    )}
                  </g>
                )}
                
                {/* Pending Attack Indicator - army waiting with hourglass */}
                {pending && !battle && (
                  <g>
                    {/* Hourglass icon */}
                    <text x={cx} y={cy - (isZoomedIn ? 2 : 8)} textAnchor="middle" dominantBaseline="middle" fontSize="10" style={{ filter: 'drop-shadow(0 0 2px #000)' }}>⏳</text>
                    
                    {/* Waiting army banner */}
                    <g>
                      <path d={`M${cx - 6} ${cy + (isZoomedIn ? 6 : 0)} h12 v8 l-3 -2 l-3 2 l-3 -2 l-3 2 v-8 z`} fill={CLANS[pending.clan]?.color} stroke={S.gold} strokeWidth="1.5" strokeDasharray="2,2" filter="url(#shadow)" />
                      <text x={cx} y={cy + (isZoomedIn ? 11 : 5)} textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="bold" fill="#fff" style={{ textShadow: '0 0 2px #000' }}>{pending.armies}</text>
                    </g>
                  </g>
                )}
                
                {/* Normal army banner (only if no battle and no pending) */}
                {!battle && !pending && owned && getTotalArmies(prov) > 0 && (
                  <g>
                    {/* Show each clan's army presence as separate banners */}
                    {(prov.armyPresence || [{ clan: prov.owner, count: prov.armies || 0 }]).map((ap, idx) => {
                      if (ap.count <= 0) return null;
                      const xOffset = idx * 13 - ((prov.armyPresence?.length || 1) - 1) * 6.5;
                      return (
                        <g 
                          key={ap.clan}
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (ap.clan === clan && currentPhase.phase === 'PLANNING') {
                              startArmyMove(provId); 
                            }
                          }} 
                          style={{ cursor: ap.clan === clan && currentPhase.phase === 'PLANNING' ? 'pointer' : 'default', pointerEvents: 'auto' }}
                        >
                          <path d={`M${cx - 6 + xOffset} ${cy + (isZoomedIn ? 2 : -4)} h12 v8 l-3 -2 l-3 2 l-3 -2 l-3 2 v-8 z`} fill={CLANS[ap.clan]?.color} stroke={ap.clan === clan ? S.gold : '#000'} strokeWidth="1" filter="url(#shadow)" />
                          <text x={cx + xOffset} y={cy + (isZoomedIn ? 7 : 1)} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="bold" fill="#fff" style={{ textShadow: '0 0 2px #000' }}>{ap.count}</text>
                        </g>
                      );
                    })}
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div className="fixed z-50 pointer-events-none" style={{ left: tooltip.x + 15, top: tooltip.y + 15, background: S.woodMid, border: `2px solid ${S.woodLight}`, padding: '8px 12px' }}>
            <p style={{ color: S.parchment, fontWeight: '600' }}>{tooltip.province.name}</p>
            <p style={{ color: getColor(tooltip.provId), fontSize: '11px' }}>{CLANS[tooltip.province.owner]?.name || 'Neutral'}</p>
          </div>
        )}

        {/* Army Move UI */}
        {selectedArmy && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20" style={{ background: S.woodMid, border: `3px solid ${S.woodLight}`, padding: '16px 24px', minWidth: 200 }}>
            <p style={{ color: S.parchment }}>進軍元 <span style={{ color: S.gold, fontWeight: '600' }}>{provinces[selectedArmy]?.name}</span></p>
            
            {/* Army split controls */}
            {getAvailableArmies(selectedArmy) > 1 && (
              <div style={{ margin: '12px 0', padding: '8px', background: 'rgba(0,0,0,0.2)', border: `1px solid ${S.woodLight}` }}>
                <p style={{ color: S.parchmentDark, fontSize: '10px', marginBottom: 6 }}>ARMIES TO SEND</p>
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={() => setArmySplitCount(Math.max(1, armySplitCount - 1))}
                    style={{ width: 28, height: 28, background: S.woodDark, border: `1px solid ${S.woodLight}`, color: S.parchment, fontSize: 16 }}
                  >−</button>
                  <span style={{ color: S.gold, fontSize: 20, fontWeight: '700', minWidth: 30, textAlign: 'center' }}>{armySplitCount}</span>
                  <button 
                    onClick={() => setArmySplitCount(Math.min(getAvailableArmies(selectedArmy), armySplitCount + 1))}
                    style={{ width: 28, height: 28, background: S.woodDark, border: `1px solid ${S.woodLight}`, color: S.parchment, fontSize: 16 }}
                  >+</button>
                </div>
                <p style={{ color: S.parchmentDark, fontSize: '9px', marginTop: 4, textAlign: 'center' }}>of {getAvailableArmies(selectedArmy)} available</p>
              </div>
            )}
            
            <p style={{ color: '#4a7c23', fontSize: '12px', margin: '8px 0' }}>Select destination</p>
            <button onClick={() => { setSelectedArmy(null); setArmySplitCount(1); }} style={{ background: S.woodDark, border: `1px solid ${S.woodLight}`, color: S.parchment, padding: '8px 16px', fontSize: '12px', width: '100%' }}>Cancel</button>
          </div>
        )}

        {/* Orders */}
        {(clanPending.length > 0 || clanCommitted.length > 0) && (
          <div className="absolute bottom-4 right-4 z-20" style={{ width: 280, background: S.woodMid, border: `3px solid ${S.woodLight}` }}>
            <div style={{ padding: '12px 16px', borderBottom: `2px solid ${S.woodLight}` }}>
              <h3 style={{ color: S.parchment, fontSize: '14px', fontWeight: '600' }}>軍令 Orders</h3>
            </div>
            <div style={{ padding: 8, maxHeight: 200, overflowY: 'auto' }}>
              {clanPending.map(m => (
                <div key={m.id} style={{ background: 'rgba(184,134,11,0.2)', border: `1px solid ${S.gold}`, marginBottom: 8, padding: 8 }}>
                  <div style={{ color: S.parchment, fontSize: 12 }}>
                    {provinces[m.from]?.name} → {provinces[m.to]?.name}
                    {m.armies > 1 && <span style={{ color: S.gold, marginLeft: 6 }}>×{m.armies}</span>}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => commitMove(m.id)} style={{ flex: 1, background: '#2d5016', border: 'none', color: S.parchment, padding: '4px', fontSize: 10 }}>Commit</button>
                    <button onClick={() => setPendingMoves(pendingMoves.filter(x => x.id !== m.id))} style={{ flex: 1, background: S.red, border: 'none', color: S.parchment, padding: '4px', fontSize: 10 }}>Cancel</button>
                  </div>
                </div>
              ))}
              {clanCommitted.map(m => {
                const hrs = (Date.now() - m.committedAt) / 3600000;
                return (
                  <div key={m.id} style={{ background: 'rgba(45,80,22,0.3)', border: '1px solid #2d5016', marginBottom: 8, padding: 8 }}>
                    <div className="flex justify-between">
                      <span style={{ color: S.parchment, fontSize: 12 }}>
                        {provinces[m.from]?.name} → {provinces[m.to]?.name}
                        {m.armies > 1 && <span style={{ color: '#4a7c23', marginLeft: 6 }}>×{m.armies}</span>}
                      </span>
                      {hrs < 12 && <button onClick={() => uncommitMove(m.id)} style={{ background: S.woodDark, border: `1px solid ${S.woodLight}`, color: S.parchmentDark, padding: '2px 8px', fontSize: 9 }}>Undo</button>}
                    </div>
                    <p style={{ color: '#4a7c23', fontSize: 9, marginTop: 4 }}>Committed {hrs < 12 ? `(${Math.round(12 - hrs)}h left)` : '(locked)'}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Wars Panel (Admin) */}
        {admin && activeBattles.length > 0 && (
          <div className="absolute top-20 right-4 z-20" style={{ width: 340, background: S.woodMid, border: `3px solid ${S.red}` }}>
            <div style={{ padding: '12px 16px', borderBottom: `2px solid ${S.red}`, background: 'rgba(139,0,0,0.3)' }}>
              <h3 style={{ color: S.parchment, fontSize: '14px', fontWeight: '600' }}>⚔️ Active Wars ({activeBattles.length})</h3>
            </div>
            <div style={{ padding: 8, maxHeight: 400, overflowY: 'auto' }}>
              {activeBattles.map(battle => (
                <div key={battle.id} style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${S.woodLight}`, marginBottom: 10, padding: 10 }}>
                  <div style={{ marginBottom: 8 }}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ color: CLANS[battle.attacker]?.color, fontWeight: '600', fontSize: 13 }}>
                        {CLANS[battle.attacker]?.name}
                      </span>
                      {battle.type !== 'bye' && (
                        <>
                          <span style={{ color: S.parchmentDark, fontSize: 10 }}>vs</span>
                          <span style={{ color: CLANS[battle.defender]?.color, fontWeight: '600', fontSize: 13 }}>
                            {CLANS[battle.defender]?.name}
                          </span>
                        </>
                      )}
                    </div>
                    <div style={{ color: S.parchmentDark, fontSize: 10, marginBottom: 4 }}>
                      {battle.type === 'collision' ? '(Meeting Engagement)' : 
                       battle.type === 'elimination' ? `(Elimination Round ${battle.bracketRound || 1})` :
                       battle.type === 'bye' ? '(Bye - Waiting)' :
                       '(Attackers → Defenders)'}
                    </div>
                  </div>
                  
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: 8, marginBottom: 8 }}>
                    <div style={{ color: S.gold, fontSize: 11, fontWeight: '600' }}>
                      {BATTLE_TYPES[battle.battleType]?.icon} {BATTLE_TYPES[battle.battleType]?.name}
                    </div>
                    <div style={{ color: S.parchment, fontSize: 12, marginTop: 2 }}>
                      {battle.type === 'elimination' || battle.type === 'bye' ? 'for' : 'at'} <span style={{ fontWeight: '600' }}>{PROVINCE_DATA[battle.province]?.name}</span>
                      {battle.bracketClaimer && (
                        <span style={{ color: S.parchmentDark, fontSize: 10 }}> (claimed by {CLANS[battle.bracketClaimer]?.name})</span>
                      )}
                    </div>
                    <div style={{ color: S.parchmentDark, fontSize: 9, marginTop: 4 }}>
                      {BATTLE_TYPES[battle.battleType]?.desc}
                    </div>
                  </div>
                  
                  {battle.type !== 'bye' && (
                    <div style={{ color: S.parchmentDark, fontSize: 10, marginBottom: 8 }}>
                      Armies: {battle.attackerArmies} vs {battle.defenderArmies}
                    </div>
                  )}
                  
                  {battle.type === 'bye' && (
                    <div style={{ color: S.gold, fontSize: 10, marginBottom: 8, fontStyle: 'italic' }}>
                      ⏳ Waiting for other bracket results ({battle.attackerArmies} armies)
                    </div>
                  )}
                  
                  {/* Chain Info - what happens next */}
                  {battle.chainInfo && (
                    <div style={{ background: 'rgba(184,134,11,0.2)', border: `1px solid ${S.gold}`, padding: 6, marginBottom: 8, fontSize: 9 }}>
                      <div style={{ color: S.gold, fontWeight: '600', marginBottom: 4 }}>📋 Next:</div>
                      <div style={{ color: CLANS[battle.attacker]?.color }}>
                        If {CLANS[battle.attacker]?.name} wins → {battle.chainInfo.attackerWinsNext}
                      </div>
                      {battle.defender && (
                        <div style={{ color: CLANS[battle.defender]?.color, marginTop: 2 }}>
                          If {CLANS[battle.defender]?.name} wins → {battle.chainInfo.defenderWinsNext}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Waiting Attackers Queue */}
                  {battle.waitingAttackers && battle.waitingAttackers.length > 0 && (
                    <div style={{ background: 'rgba(139,0,0,0.2)', border: `1px solid ${S.red}`, padding: 6, marginBottom: 8, fontSize: 9 }}>
                      <div style={{ color: S.red, fontWeight: '600', marginBottom: 4 }}>⏳ Queue ({battle.waitingAttackers.length} waiting):</div>
                      {battle.waitingAttackers.map((w, idx) => {
                        const names = [w.clan, ...(w.allies || [])].map(c => CLANS[c]?.name).join(' + ');
                        return (
                          <div key={idx} style={{ marginTop: 2 }}>
                            <span style={{ color: CLANS[w.clan]?.color }}>{idx + 1}. {names}</span>
                            {w.armyBreakdown && w.armyBreakdown.length > 1 ? (
                              <span style={{ color: S.parchmentDark }}> ({w.armyBreakdown.map(b => `${b.armies} ${CLANS[b.clan]?.name}`).join(' + ')})</span>
                            ) : (
                              <span style={{ color: S.parchmentDark }}> ({w.armies} armies)</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {battle.type !== 'bye' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => resolveBattle(battle.id, battle.attacker)}
                        style={{ flex: 1, padding: 8, background: CLANS[battle.attacker]?.color, border: 'none', color: '#fff', fontSize: 10, fontWeight: '600' }}
                      >
                        {CLANS[battle.attacker]?.name} Wins
                      </button>
                      <button 
                        onClick={() => resolveBattle(battle.id, battle.defender)}
                        style={{ flex: 1, padding: 8, background: CLANS[battle.defender]?.color, border: 'none', color: '#fff', fontSize: 10, fontWeight: '600' }}
                      >
                        {CLANS[battle.defender]?.name} Wins
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Pending Attacks Section */}
              {pendingAttacks.length > 0 && (
                <div style={{ borderTop: `2px solid ${S.gold}`, marginTop: 8, paddingTop: 8 }}>
                  <div style={{ color: S.gold, fontSize: 11, fontWeight: '600', marginBottom: 6 }}>⏳ Waiting for Battle Results:</div>
                  {pendingAttacks.map(p => (
                    <div key={p.id} style={{ background: 'rgba(184,134,11,0.15)', padding: 6, marginBottom: 4, fontSize: 10 }}>
                      <span style={{ color: CLANS[p.clan]?.color, fontWeight: '600' }}>{CLANS[p.clan]?.name}</span>
                      <span style={{ color: S.parchmentDark }}> at </span>
                      <span style={{ color: S.parchment }}>{PROVINCE_DATA[p.to]?.name}</span>
                      <span style={{ color: S.parchmentDark }}> (waiting for </span>
                      <span style={{ color: CLANS[p.waitingFor]?.color }}>{CLANS[p.waitingFor]?.name}</span>
                      <span style={{ color: S.parchmentDark }}>)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Move Log Panel */}
        {moveLog.length > 0 && (
          <div className="absolute top-20 left-4 z-20" style={{ width: 320, background: S.woodMid, border: `3px solid ${S.woodLight}` }}>
            <div style={{ padding: '12px 16px', borderBottom: `2px solid ${S.woodLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: S.parchment, fontSize: '14px', fontWeight: '600' }}>📜 Moves This Turn</h3>
              <button onClick={() => setMoveLog([])} style={{ background: 'transparent', border: 'none', color: S.parchmentDark, fontSize: 10, cursor: 'pointer' }}>Clear</button>
            </div>
            <div style={{ padding: 8, maxHeight: 300, overflowY: 'auto' }}>
              {moveLog.map((entry, i) => (
                <div key={i} style={{ 
                  padding: '6px 8px', 
                  marginBottom: 4, 
                  fontSize: 11,
                  background: entry.type === 'battle' || entry.type === 'collision' ? 'rgba(139,0,0,0.2)' : 
                              entry.type === 'auto-win' || entry.type === 'claim' ? 'rgba(45,80,22,0.2)' : 
                              entry.type === 'reinforce' ? 'rgba(184,134,11,0.2)' : 'rgba(0,0,0,0.2)',
                  borderLeft: `3px solid ${
                    entry.type === 'battle' || entry.type === 'collision' ? S.red : 
                    entry.type === 'auto-win' || entry.type === 'claim' ? '#2d5016' : 
                    entry.type === 'reinforce' ? S.gold : S.parchmentDark
                  }`,
                  color: S.parchment
                }}>
                  {entry.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend - Cleaner design */}
        <div className="absolute bottom-4 left-4 z-10" style={{ 
          background: S.bgSecondary, 
          border: `1px solid ${S.border}`, 
          borderRadius: 8,
          padding: '12px 16px',
        }}>
          <p style={{ color: S.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 10, fontWeight: 500 }}>CLANS</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
              <div key={id} className="flex items-center gap-2">
                <div style={{ width: 10, height: 10, background: c.color, borderRadius: 2 }} />
                <span style={{ color: S.textSecondary, fontSize: 11 }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Panel - Modern design */}
      {selected && provinces[selected] && (
        <div style={{ 
          width: 360, 
          background: S.bgSecondary, 
          borderLeft: `1px solid ${S.border}`, 
          display: 'flex', 
          flexDirection: 'column',
        }}>
          {/* Province Header */}
          <div style={{ 
            padding: '20px 24px', 
            background: `linear-gradient(135deg, ${getColor(selected)}25, transparent)`,
            borderBottom: `1px solid ${S.border}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h2 style={{ color: S.textPrimary, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{provinces[selected].name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    background: `${getColor(selected)}30`,
                    border: `1px solid ${getColor(selected)}`,
                    borderRadius: 4,
                    color: getColor(selected),
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    <span style={{ width: 8, height: 8, background: getColor(selected), borderRadius: 2 }} />
                    {CLANS[provinces[selected].owner]?.name || 'Neutral'}
                  </span>
                  <span style={{ 
                    padding: '4px 8px',
                    background: S.bgTertiary,
                    borderRadius: 4,
                    color: S.textMuted,
                    fontSize: 10,
                  }}>
                    {BATTLE_TYPES[provinces[selected].battleType]?.icon} {BATTLE_TYPES[provinces[selected].battleType]?.name}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelected(null)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: S.textMuted, 
                  fontSize: 20, 
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                ×
              </button>
            </div>
          </div>
          
          <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
            {/* Army / Rally Display */}
            {(() => {
              const prov = provinces[selected];
              const provOwner = prov.owner;
              
              // Clan-wide rally cap
              const clanRallyCap = clanData[provOwner]?.rallyCap || 0;
              const maxArmiesClanWide = Math.floor(clanRallyCap / 20);
              
              // Count total armies this clan has across all provinces
              const totalClanArmies = Object.values(provinces).filter(p => p.owner === provOwner).reduce((sum, p) => sum + (p.armies || 0), 0);
              
              // Count pending levies for this clan (across all their provinces)
              const totalPendingLevies = pendingLevies.filter(l => l.clan === provOwner).length;
              
              // How many more can this clan raise overall
              const clanCanRaise = maxArmiesClanWide - totalClanArmies - totalPendingLevies;
              
              // Check if THIS province already has a pending levy
              const thisProvHasLevyQueued = pendingLevies.some(l => l.province === selected && l.clan === provOwner);
              
              // Can raise here if: clan has capacity AND this province doesn't already have a pending levy
              const canRaiseHere = clanCanRaise > 0 && !thisProvHasLevyQueued;
              
              // Get army presence (new format) or fall back to old format
              const armyPresence = prov.armyPresence || (prov.armies ? [{ clan: provOwner, count: prov.armies }] : []);
              const currentArmies = getTotalArmies(prov);
              const isOwner = provOwner === clan;
              
              return (
                <div style={{ 
                  background: S.bgTertiary, 
                  border: `1px solid ${S.border}`, 
                  borderRadius: 8,
                  padding: 16, 
                  marginBottom: 16,
                }}>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p style={{ color: S.parchment, fontWeight: '600' }}>軍勢</p>
                      <p style={{ color: S.parchmentDark, fontSize: 10 }}>Armies Here</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: S.gold, fontSize: 28, fontWeight: '700' }}>{currentArmies}</span>
                      {thisProvHasLevyQueued && <span style={{ color: '#4a7c23', fontSize: 16 }}> +1</span>}
                    </div>
                  </div>
                  
                  {/* Show army presence - each clan's armies */}
                  {armyPresence.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                      {armyPresence.map((ap, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.2)', padding: '4px 8px', border: ap.clan === provOwner ? `1px solid ${S.gold}` : '1px solid transparent' }}>
                          <div style={{ width: 16, height: 16, background: CLANS[ap.clan]?.color, border: '1px solid #000' }} />
                          <span style={{ color: CLANS[ap.clan]?.color, fontSize: 11, fontWeight: '600' }}>{CLANS[ap.clan]?.name}: {ap.count}</span>
                          {ap.clan === provOwner && <span style={{ color: S.gold, fontSize: 8 }}>👑</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Clan-wide capacity bar */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ 
                      width: `${maxArmiesClanWide > 0 ? (totalClanArmies / maxArmiesClanWide) * 100 : 0}%`, 
                      height: '100%', 
                      background: S.gold,
                      transition: 'width 0.3s'
                    }} />
                    {totalPendingLevies > 0 && (
                      <div style={{ 
                        width: `${maxArmiesClanWide > 0 ? (totalPendingLevies / maxArmiesClanWide) * 100 : 0}%`, 
                        height: '100%', 
                        background: '#4a7c23',
                        marginTop: -8,
                        marginLeft: `${maxArmiesClanWide > 0 ? (totalClanArmies / maxArmiesClanWide) * 100 : 0}%`,
                        transition: 'width 0.3s'
                      }} />
                    )}
                  </div>
                  
                  <p style={{ color: S.parchmentDark, fontSize: 10, marginBottom: 4 }}>
                    {CLANS[provOwner]?.name} 動員力: {clanRallyCap} men
                  </p>
                  <p style={{ color: S.parchmentDark, fontSize: 10, marginBottom: 8 }}>
                    Clan armies: {totalClanArmies}{totalPendingLevies > 0 ? ` +${totalPendingLevies}` : ''} / {maxArmiesClanWide}
                  </p>
                  
                  {/* Raise Levy Button - only during planning, only for owner, only if no levy already queued here */}
                  {isOwner && currentPhase.phase === 'PLANNING' && canRaiseHere && (
                    <button 
                      onClick={() => setPendingLevies([...pendingLevies, { 
                        id: Date.now(), 
                        province: selected, 
                        clan: provOwner 
                      }])}
                      style={{ 
                        width: '100%', 
                        padding: 10, 
                        background: 'linear-gradient(180deg, #4a3728 0%, #2d1f15 100%)', 
                        border: `2px solid ${S.gold}`, 
                        color: S.gold, 
                        fontSize: 12, 
                        fontWeight: '600',
                        marginTop: 8
                      }}
                    >
                      召集 Raise Levy
                    </button>
                  )}
                  
                  {/* Show pending levy at this province */}
                  {thisProvHasLevyQueued && (
                    <div style={{ marginTop: 8, padding: 8, background: 'rgba(45,80,22,0.2)', border: '1px solid #4a7c23' }}>
                      <p style={{ color: '#4a7c23', fontSize: 10 }}>
                        ⏳ Levy will spawn when battles begin
                      </p>
                      {isOwner && (
                        <button 
                          onClick={() => {
                            const toRemove = pendingLevies.find(l => l.province === selected && l.clan === provOwner);
                            if (toRemove) setPendingLevies(pendingLevies.filter(l => l.id !== toRemove.id));
                          }}
                          style={{ 
                            marginTop: 6, 
                            padding: '4px 8px', 
                            background: S.red, 
                            border: 'none', 
                            color: S.parchment, 
                            fontSize: 10 
                          }}
                        >
                          Cancel Levy
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Info messages */}
                  {isOwner && currentPhase.phase === 'PLANNING' && !canRaiseHere && thisProvHasLevyQueued && (
                    <p style={{ color: S.parchmentDark, fontSize: 10, marginTop: 8, fontStyle: 'italic' }}>
                      One levy per province per turn
                    </p>
                  )}
                  
                  {isOwner && currentPhase.phase === 'PLANNING' && clanCanRaise <= 0 && !thisProvHasLevyQueued && (
                    <p style={{ color: S.red, fontSize: 10, marginTop: 8 }}>
                      ⚠️ Clan at maximum capacity
                    </p>
                  )}
                  
                  {maxArmiesClanWide === 0 && (
                    <p style={{ color: S.parchmentDark, fontSize: 10, marginTop: 8, fontStyle: 'italic' }}>
                      No rally capacity set (admin)
                    </p>
                  )}
                </div>
              );
            })()}

            {/* Battle Type */}
            {PROVINCE_DATA[selected]?.battleType && (
              <div style={{ background: S.woodMid, border: `2px solid ${S.woodLight}`, padding: 16, marginBottom: 16 }}>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 24 }}>{BATTLE_TYPES[PROVINCE_DATA[selected].battleType]?.icon}</span>
                  <div>
                    <p style={{ color: S.parchment, fontWeight: '600' }}>{BATTLE_TYPES[PROVINCE_DATA[selected].battleType]?.name}</p>
                    <p style={{ color: S.parchmentDark, fontSize: 10 }}>{BATTLE_TYPES[PROVINCE_DATA[selected].battleType]?.desc}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Active Battle at this Province */}
            {(() => {
              const battle = activeBattles.find(b => b.province === selected && b.type !== 'bye');
              const pendingHere = pendingAttacks.find(p => p.to === selected);
              
              if (battle) {
                return (
                  <div style={{ background: 'rgba(139,0,0,0.3)', border: `2px solid ${S.red}`, padding: 16, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 20 }}>⚔️</span>
                      <div>
                        <p style={{ color: S.red, fontWeight: '600', fontSize: 14 }}>BATTLE IN PROGRESS</p>
                        <p style={{ color: S.parchmentDark, fontSize: 10 }}>
                          {battle.type === 'collision' ? 'Meeting Engagement' : 
                           battle.type === 'elimination' ? `Elimination Round ${battle.bracketRound || 1}` :
                           'Assault'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Combatants */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        {/* Show individual army banners if there's a breakdown */}
                        {battle.attackerArmyBreakdown && battle.attackerArmyBreakdown.length > 1 ? (
                          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                            {battle.attackerArmyBreakdown.map((b, idx) => (
                              <div key={idx} style={{ textAlign: 'center' }}>
                                <div style={{ width: 32, height: 32, background: CLANS[b.clan]?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #000' }}>
                                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>{b.armies}</span>
                                </div>
                                <p style={{ color: CLANS[b.clan]?.color, fontSize: 9, fontWeight: '600' }}>{CLANS[b.clan]?.name}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ width: 40, height: 40, background: CLANS[battle.attacker]?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #000', margin: '0 auto 4px' }}>
                            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{battle.attackerArmies}</span>
                          </div>
                        )}
                        {!battle.attackerArmyBreakdown || battle.attackerArmyBreakdown.length <= 1 ? (
                          <>
                            <p style={{ color: CLANS[battle.attacker]?.color, fontSize: 11, fontWeight: '600' }}>{CLANS[battle.attacker]?.name}</p>
                            {battle.attackerAllies?.length > 0 && (
                              <p style={{ color: S.parchmentDark, fontSize: 9 }}>
                                + {battle.attackerAllies.map(a => CLANS[a]?.name).join(', ')}
                              </p>
                            )}
                          </>
                        ) : null}
                        <p style={{ color: S.parchmentDark, fontSize: 9 }}>
                          Attacker{(battle.attackerAllies?.length > 0 || (battle.attackerArmyBreakdown?.length > 1)) ? 's' : ''}
                          {battle.attackerArmyBreakdown?.length > 1 && ` (${battle.attackerArmies} total)`}
                        </p>
                      </div>
                      
                      <span style={{ color: S.gold, fontSize: 20, padding: '0 8px' }}>VS</span>
                      
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        {/* Show individual army banners if there's a breakdown */}
                        {battle.defenderArmyBreakdown && battle.defenderArmyBreakdown.length > 1 ? (
                          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                            {battle.defenderArmyBreakdown.map((b, idx) => (
                              <div key={idx} style={{ textAlign: 'center' }}>
                                <div style={{ width: 32, height: 32, background: CLANS[b.clan]?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #000' }}>
                                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>{b.armies}</span>
                                </div>
                                <p style={{ color: CLANS[b.clan]?.color, fontSize: 9, fontWeight: '600' }}>{CLANS[b.clan]?.name}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ width: 40, height: 40, background: CLANS[battle.defender]?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #000', margin: '0 auto 4px' }}>
                            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{battle.defenderArmies}</span>
                          </div>
                        )}
                        {!battle.defenderArmyBreakdown || battle.defenderArmyBreakdown.length <= 1 ? (
                          <>
                            <p style={{ color: CLANS[battle.defender]?.color, fontSize: 11, fontWeight: '600' }}>{CLANS[battle.defender]?.name}</p>
                            {battle.defenderAllies?.length > 0 && (
                              <p style={{ color: S.parchmentDark, fontSize: 9 }}>
                                + {battle.defenderAllies.map(a => CLANS[a]?.name).join(', ')}
                              </p>
                            )}
                          </>
                        ) : null}
                        <p style={{ color: S.parchmentDark, fontSize: 9 }}>
                          Defender{(battle.defenderAllies?.length > 0 || (battle.defenderArmyBreakdown?.length > 1)) ? 's' : ''}
                          {battle.defenderArmyBreakdown?.length > 1 && ` (${battle.defenderArmies} total)`}
                        </p>
                      </div>
                    </div>
                    
                    {/* Battle Type */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: 8, marginBottom: 8 }}>
                      <p style={{ color: S.gold, fontSize: 11 }}>
                        {BATTLE_TYPES[battle.battleType]?.icon} {BATTLE_TYPES[battle.battleType]?.name}
                      </p>
                      <p style={{ color: S.parchmentDark, fontSize: 9 }}>{BATTLE_TYPES[battle.battleType]?.desc}</p>
                    </div>
                    
                    {/* Chain Info */}
                    {battle.chainInfo && (
                      <div style={{ background: 'rgba(184,134,11,0.2)', padding: 8, marginBottom: 8, fontSize: 10 }}>
                        <p style={{ color: S.gold, fontWeight: '600', marginBottom: 4 }}>Next:</p>
                        <p style={{ color: CLANS[battle.attacker]?.color }}>If {CLANS[battle.attacker]?.name} wins → {battle.chainInfo.attackerWinsNext}</p>
                        <p style={{ color: CLANS[battle.defender]?.color }}>If {CLANS[battle.defender]?.name} wins → {battle.chainInfo.defenderWinsNext}</p>
                      </div>
                    )}
                    
                    {/* Waiting Queue */}
                    {battle.waitingAttackers && battle.waitingAttackers.length > 0 && (
                      <div style={{ background: 'rgba(139,0,0,0.2)', padding: 8, marginBottom: 8, fontSize: 10 }}>
                        <p style={{ color: S.red, fontWeight: '600', marginBottom: 4 }}>⏳ Queue:</p>
                        {battle.waitingAttackers.map((w, idx) => {
                          const names = [w.clan, ...(w.allies || [])].map(c => CLANS[c]?.name).join(' + ');
                          const armyText = w.armyBreakdown && w.armyBreakdown.length > 1 
                            ? w.armyBreakdown.map(b => `${b.armies} ${CLANS[b.clan]?.name}`).join(' + ')
                            : w.armies;
                          return (
                            <p key={idx} style={{ color: CLANS[w.clan]?.color }}>{idx + 1}. {names} ({armyText})</p>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Admin: Resolve buttons */}
                    {admin && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <button 
                          onClick={() => resolveBattle(battle.id, battle.attacker)}
                          style={{ flex: 1, padding: 10, background: CLANS[battle.attacker]?.color, border: 'none', color: '#fff', fontSize: 11, fontWeight: '600' }}
                        >
                          {CLANS[battle.attacker]?.name} Wins
                        </button>
                        <button 
                          onClick={() => resolveBattle(battle.id, battle.defender)}
                          style={{ flex: 1, padding: 10, background: CLANS[battle.defender]?.color, border: 'none', color: '#fff', fontSize: 11, fontWeight: '600' }}
                        >
                          {CLANS[battle.defender]?.name} Wins
                        </button>
                      </div>
                    )}
                  </div>
                );
              } else if (pendingHere) {
                return (
                  <div style={{ background: 'rgba(184,134,11,0.2)', border: `2px solid ${S.gold}`, padding: 16, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>⏳</span>
                      <div>
                        <p style={{ color: S.gold, fontWeight: '600', fontSize: 14 }}>ARMY WAITING</p>
                        <p style={{ color: S.parchmentDark, fontSize: 10 }}>Pending battle result</p>
                      </div>
                    </div>
                    <p style={{ color: S.parchment, fontSize: 12 }}>
                      <span style={{ color: CLANS[pendingHere.clan]?.color, fontWeight: '600' }}>{CLANS[pendingHere.clan]?.name}</span> ({pendingHere.armies}) waiting for <span style={{ color: CLANS[pendingHere.waitingFor]?.color, fontWeight: '600' }}>{CLANS[pendingHere.waitingFor]?.name}</span> to return
                    </p>
                  </div>
                );
              }
              return null;
            })()}

            {/* Move Army - show if player has armies here (even if not owner) */}
            {getClanArmies(provinces[selected], clan) > 0 && currentPhase.phase === 'PLANNING' && (
              <button onClick={() => startArmyMove(selected)} style={{ width: '100%', padding: 12, background: 'linear-gradient(180deg, #3d6b1e 0%, #2d5016 100%)', border: `2px solid #4a7c23`, color: S.parchment, fontSize: 14, fontWeight: '600', marginBottom: 16 }}>
                進軍 Move Army ({getClanArmies(provinces[selected], clan)} available)
              </button>
            )}
            
            {/* Gift Land to Ally */}
            {provinces[selected].owner === clan && getAllies(clan).length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: S.parchmentDark, fontSize: 10, marginBottom: 6 }}>🎁 GIFT PROVINCE TO ALLY</p>
                <div className="flex gap-2">
                  <select 
                    id="gift-target-select"
                    defaultValue=""
                    style={{ flex: 1, padding: 8, background: S.woodDark, border: `1px solid ${S.woodLight}`, color: S.parchment, fontSize: 11 }}
                  >
                    <option value="" disabled>Select ally...</option>
                    {getAllies(clan).map(allyId => (
                      <option key={allyId} value={allyId} style={{ background: S.woodDark }}>{CLANS[allyId]?.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => {
                      const select = document.getElementById('gift-target-select');
                      if (select.value) {
                        const recipient = select.value;
                        setProvinces({ 
                          ...provinces, 
                          [selected]: { ...provinces[selected], owner: recipient } 
                        });
                        addHistoryEvent({
                          type: 'gift',
                          icon: '🎁',
                          text: `${CLANS[clan]?.name} gifts ${PROVINCE_DATA[selected]?.name} to ${CLANS[recipient]?.name}`,
                          from: clan,
                          to: recipient,
                          province: selected,
                        });
                        select.value = '';
                      }
                    }}
                    style={{ padding: '8px 12px', background: S.gold, border: 'none', color: S.woodDark, fontSize: 10, fontWeight: '600' }}
                  >
                    Gift
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <p style={{ color: S.parchmentDark, fontSize: 11, marginBottom: 8 }}>NEIGHBORS</p>
              <div className="flex flex-wrap gap-2">
                {PROVINCE_DATA[selected]?.neighbors?.map(n => (
                  <button key={n} onClick={() => setSelected(n)} style={{ padding: '4px 10px', background: S.woodDark, border: `1px solid ${S.woodLight}`, borderLeft: `3px solid ${getColor(n)}`, color: S.parchment, fontSize: 11 }}>
                    {PROVINCE_DATA[n]?.name}
                  </button>
                ))}
              </div>
            </div>

            {admin && (
              <div style={{ borderTop: `2px solid ${S.woodLight}`, paddingTop: 16 }}>
                <p style={{ color: S.red, fontSize: 10, marginBottom: 12 }}>ADMIN</p>
                <select value={provinces[selected].owner} onChange={e => setProvinces({ ...provinces, [selected]: { ...provinces[selected], owner: e.target.value } })} style={{ width: '100%', padding: 8, background: S.woodDark, border: `1px solid ${S.woodLight}`, color: S.parchment, fontSize: 12, marginBottom: 12 }}>
                  {Object.entries(CLANS).map(([id, c]) => <option key={id} value={id} style={{ background: S.woodDark }}>{c.name}</option>)}
                </select>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => {
                    const prov = provinces[selected];
                    const owner = prov.owner;
                    const current = getClanArmies(prov, owner);
                    if (current > 0) {
                      setProvinces({ ...provinces, [selected]: removeArmiesFromProvince(prov, owner, 1) });
                    }
                  }} style={{ flex: 1, padding: 8, background: S.red, border: 'none', color: S.parchment, fontSize: 11 }}>− Army</button>
                  <button onClick={() => {
                    const prov = provinces[selected];
                    const owner = prov.owner;
                    setProvinces({ ...provinces, [selected]: addArmiesToProvince(prov, owner, 1) });
                  }} style={{ flex: 1, padding: 8, background: '#2d5016', border: 'none', color: S.parchment, fontSize: 11 }}>+ Army</button>
                </div>
                
                {/* Clan Rally Cap (for the clan that owns this province) */}
                <div style={{ marginBottom: 12 }}>
                  <p style={{ color: S.parchmentDark, fontSize: 10, marginBottom: 4 }}>
                    {CLANS[provinces[selected].owner]?.name} Rally Cap:
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={clanData[provinces[selected].owner]?.rallyCap || 0} 
                      onChange={e => {
                        const newValue = parseInt(e.target.value) || 0;
                        const clanId = provinces[selected].owner;
                        const oldValue = clanData[clanId]?.rallyCap || 0;
                        if (newValue !== oldValue) {
                          setClanData({ 
                            ...clanData, 
                            [clanId]: { 
                              ...clanData[clanId], 
                              rallyCap: newValue 
                            } 
                          });
                          addHistoryEvent({
                            type: 'rallycap',
                            icon: '📜',
                            text: `${CLANS[clanId]?.name} rally cap changed to ${newValue}`,
                            clan: clanId,
                            oldValue,
                            newValue,
                          });
                        }
                      }} 
                      style={{ flex: 1, padding: 8, background: S.woodDark, border: `1px solid ${S.woodLight}`, color: S.parchment, fontSize: 12 }} 
                      placeholder="Rally Cap (men)" 
                    />
                    <span style={{ color: S.parchmentDark, fontSize: 10, alignSelf: 'center' }}>
                      = {Math.floor((clanData[provinces[selected].owner]?.rallyCap || 0) / 20)} armies
                    </span>
                  </div>
                </div>
                
                {committedMoves.length > 0 && (
                  <button onClick={processMovesIntoBattles} style={{ width: '100%', padding: 10, background: S.red, border: 'none', color: S.parchment, fontSize: 12, fontWeight: '600', marginBottom: 8 }}>
                    ⚔️ Process Moves ({committedMoves.length})
                  </button>
                )}
                <button 
                  onClick={() => setCurrentPhase(prev => ({ 
                    ...prev, 
                    phase: prev.phase === 'PLANNING' ? 'BATTLE' : 'PLANNING',
                    color: prev.phase === 'PLANNING' ? S.red : '#2d5016'
                  }))} 
                  style={{ width: '100%', padding: 10, background: currentPhase.phase === 'PLANNING' ? S.red : '#2d5016', border: 'none', color: S.parchment, fontSize: 12, fontWeight: '600', marginBottom: 8 }}
                >
                  🔄 Toggle Phase → {currentPhase.phase === 'PLANNING' ? 'BATTLE' : 'PLANNING'}
                </button>
                <button 
                  onClick={advanceWeek} 
                  style={{ width: '100%', padding: 10, background: `linear-gradient(180deg, ${S.gold} 0%, #8b6914 100%)`, border: 'none', color: S.woodDark, fontSize: 12, fontWeight: '600' }}
                  disabled={activeBattles.length > 0}
                  title={activeBattles.length > 0 ? 'Resolve all battles first' : ''}
                >
                  📅 Advance to Week {week + 1}
                </button>
                {activeBattles.length > 0 && (
                  <p style={{ color: S.red, fontSize: 9, marginTop: 4 }}>⚠️ Resolve {activeBattles.length} battle(s) first</p>
                )}
              </div>
            )}
          </div>

          <button onClick={() => setSelected(null)} style={{ margin: 16, padding: 12, background: S.woodMid, border: `2px solid ${S.woodLight}`, color: S.parchmentDark, fontSize: 12 }}>Close</button>
        </div>
      )}
    </div>
  );
}
