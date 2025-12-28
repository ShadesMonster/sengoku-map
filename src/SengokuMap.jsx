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
  awa_shikoku: { name: 'Awa', neighbors: ['tosa', 'sanuki'], battleType: 'field' },
  
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
  awa_kanto: { name: 'Awa', neighbors: ['kazusa'], battleType: 'village' },
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

// Style constants
const S = {
  woodDark: '#2c1810',
  woodMid: '#4a3728',
  woodLight: '#6b4c3a',
  parchment: '#d4c4a8',
  parchmentDark: '#b8a88c',
  red: '#8B0000',
  gold: '#ffd700',
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
      init[id] = { ...p, id, owner, armies: owner !== 'uncontrolled' ? 1 : 0, rallyCapacity: 100 };
    });
    return init;
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
  const [lastProcessedPhase, setLastProcessedPhase] = useState(null);
  const [moveLog, setMoveLog] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilDeadline(getTimeUntilDeadline());
      setCurrentPhase(getCurrentPhase());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Process moves when battle phase starts
  useEffect(() => {
    if (currentPhase.phase === 'BATTLE' && lastProcessedPhase !== `${week}-BATTLE` && committedMoves.length > 0) {
      processMovesIntoBattles();
      setLastProcessedPhase(`${week}-BATTLE`);
    }
  }, [currentPhase.phase, week]);

  const processMovesIntoBattles = () => {
    const battles = [];
    const pendingAttacks = []; // Attacks waiting for collision to resolve
    const log = [];
    const movesToProcess = [...committedMoves];
    const newProvinces = { ...provinces };
    
    // Log all moves first
    movesToProcess.forEach(m => {
      log.push({
        type: 'move',
        clan: m.clan,
        from: m.from,
        to: m.to,
        text: `${CLANS[m.clan]?.name} moves army from ${PROVINCE_DATA[m.from]?.name} to ${PROVINCE_DATA[m.to]?.name}`
      });
    });
    
    // STEP 1: Identify all collisions (A→B and B→A)
    const collisions = [];
    const collisionMoveIds = new Set();
    const collisionClans = new Set(); // Track clans involved in collisions
    const collisionDestinations = new Map(); // Map destination -> collision info
    
    movesToProcess.forEach(m => {
      if (collisionMoveIds.has(m.id)) return;
      const opposing = movesToProcess.find(om => 
        om.from === m.to && om.to === m.from && om.clan !== m.clan && !collisionMoveIds.has(om.id)
      );
      if (opposing) {
        collisions.push({ move1: m, move2: opposing });
        collisionMoveIds.add(m.id);
        collisionMoveIds.add(opposing.id);
        collisionClans.add(m.clan);
        collisionClans.add(opposing.clan);
        // Both destinations are involved in this collision
        collisionDestinations.set(m.to, { collision: { move1: m, move2: opposing }, returningClan: opposing.clan });
        collisionDestinations.set(opposing.to, { collision: { move1: m, move2: opposing }, returningClan: m.clan });
      }
    });
    
    // STEP 2: Process collisions - create Sanryō battles
    collisions.forEach(({ move1, move2 }) => {
      const army1 = newProvinces[move1.from]?.armies || 1;
      const army2 = newProvinces[move2.from]?.armies || 1;
      
      // Battle happens "in the field" between the two provinces
      const battleProvince = move1.to; // Use move1's destination as battle location
      
      // Find any pending attacks on either origin province
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
        // Chain info - what happens after this battle
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
      
      // Remove armies from source provinces (they're now in the field)
      newProvinces[move1.from] = { ...newProvinces[move1.from], armies: 0 };
      newProvinces[move2.from] = { ...newProvinces[move2.from], armies: 0 };
      
      log.push({
        type: 'collision',
        text: `⚔️ ${CLANS[move1.clan]?.name} and ${CLANS[move2.clan]?.name} armies collide! Sanryō battle`
      });
    });
    
    // STEP 3: Process remaining moves (non-collision)
    const remainingMoves = movesToProcess.filter(m => !collisionMoveIds.has(m.id));
    
    remainingMoves.forEach(m => {
      const sourceProv = newProvinces[m.from];
      const targetProv = newProvinces[m.to];
      const armyCount = sourceProv?.armies || 0;
      
      if (armyCount === 0) {
        log.push({
          type: 'skip',
          text: `${CLANS[m.clan]?.name} order cancelled - no army at ${PROVINCE_DATA[m.from]?.name}`
        });
        return;
      }
      
      if (targetProv.owner === m.clan) {
        // REINFORCEMENT
        newProvinces[m.to] = { ...targetProv, armies: targetProv.armies + armyCount };
        newProvinces[m.from] = { ...sourceProv, armies: 0 };
        log.push({
          type: 'reinforce',
          text: `${CLANS[m.clan]?.name} reinforces ${PROVINCE_DATA[m.to]?.name} (+${armyCount} armies)`
        });
      } else if (targetProv.owner === 'uncontrolled') {
        // CLAIM UNCONTROLLED
        newProvinces[m.to] = { ...targetProv, owner: m.clan, armies: armyCount };
        newProvinces[m.from] = { ...sourceProv, armies: 0 };
        log.push({
          type: 'claim',
          text: `✓ ${CLANS[m.clan]?.name} claims uncontrolled ${PROVINCE_DATA[m.to]?.name}`
        });
      } else {
        // ATTACK ENEMY TERRITORY
        const defenderInCollision = collisionClans.has(targetProv.owner) && 
          collisions.some(c => 
            (c.move1.clan === targetProv.owner && c.move1.from === m.to) ||
            (c.move2.clan === targetProv.owner && c.move2.from === m.to)
          );
        
        if (defenderInCollision) {
          // Defender left for collision - this is a PENDING attack
          // Army moves there and waits
          pendingAttacks.push({
            id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            clan: m.clan,
            from: m.from,
            to: m.to,
            armies: armyCount,
            waitingFor: targetProv.owner, // Waiting to see if this clan returns
          });
          
          // Move army to destination (they're waiting there)
          newProvinces[m.from] = { ...sourceProv, armies: 0 };
          // Don't change ownership yet - waiting for collision result
          
          log.push({
            type: 'pending',
            text: `⏳ ${CLANS[m.clan]?.name} arrives at ${PROVINCE_DATA[m.to]?.name} - waiting for ${CLANS[targetProv.owner]?.name} to return from battle`
          });
        } else if (targetProv.armies === 0) {
          // AUTO-WIN - no defenders
          newProvinces[m.to] = { ...targetProv, owner: m.clan, armies: armyCount };
          newProvinces[m.from] = { ...sourceProv, armies: 0 };
          log.push({
            type: 'auto-win',
            text: `✓ ${CLANS[m.clan]?.name} takes undefended ${PROVINCE_DATA[m.to]?.name} from ${CLANS[targetProv.owner]?.name}`
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
            defender: targetProv.owner,
            attackerFrom: m.from,
            attackerArmies: armyCount,
            defenderArmies: targetProv.armies,
          });
          
          newProvinces[m.from] = { ...sourceProv, armies: 0 };
          
          log.push({
            type: 'battle',
            text: `⚔️ ${CLANS[m.clan]?.name} attacks ${CLANS[targetProv.owner]?.name} at ${PROVINCE_DATA[m.to]?.name} - ${BATTLE_TYPES[battleType]?.name}!`
          });
        }
      }
    });
    
    setProvinces(newProvinces);
    setActiveBattles(battles);
    setPendingAttacks(pendingAttacks);
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
        if (s.week) setWeek(s.week);
        if (s.committedMoves) setCommittedMoves(s.committedMoves);
        if (s.pendingMoves) setPendingMoves(s.pendingMoves);
        if (s.activeBattles) setActiveBattles(s.activeBattles);
        if (s.pendingAttacks) setPendingAttacks(s.pendingAttacks);
        if (s.lastProcessedPhase) setLastProcessedPhase(s.lastProcessedPhase);
        if (s.moveLog) setMoveLog(s.moveLog);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sengoku-game-state', JSON.stringify({ provinces, week, committedMoves, pendingMoves, activeBattles, pendingAttacks, lastProcessedPhase, moveLog }));
  }, [provinces, week, committedMoves, pendingMoves, activeBattles, pendingAttacks, lastProcessedPhase, moveLog]);

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
        newProvinces[winnerDest] = { ...targetProv, owner: winner, armies: winnerArmies };
      } else if (targetProv.owner === winner) {
        // Reinforce own territory
        newProvinces[winnerDest] = { ...targetProv, armies: targetProv.armies + winnerArmies };
        newLog.push({
          type: 'reinforce',
          text: `${CLANS[winner]?.name} reinforces ${PROVINCE_DATA[winnerDest]?.name}`
        });
      } else if (targetProv.owner === 'uncontrolled' || targetProv.armies === 0) {
        // Take undefended territory
        const prevOwner = targetProv.owner;
        newProvinces[winnerDest] = { ...targetProv, owner: winner, armies: winnerArmies };
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
          defenderArmies: targetProv.armies,
        });
        newLog.push({
          type: 'battle',
          text: `⚔️ ${CLANS[winner]?.name} continues to ${PROVINCE_DATA[winnerDest]?.name} - faces ${CLANS[targetProv.owner]?.name}!`
        });
      }
    } else {
      // Regular attack battle
      if (winner === battle.attacker) {
        // Attacker wins - takes the province
        newProvinces[battle.province] = { 
          ...newProvinces[battle.province], 
          owner: battle.attacker, 
          armies: winnerArmies
        };
        newLog.push({
          type: 'result',
          text: `🏆 ${CLANS[winner]?.name} conquers ${PROVINCE_DATA[battle.province]?.name}! ${CLANS[loser]?.name} army destroyed.`
        });
      } else {
        // Defender wins - keeps province, attacker army destroyed
        newProvinces[battle.province] = { 
          ...newProvinces[battle.province], 
          armies: winnerArmies
        };
        newLog.push({
          type: 'result',
          text: `🛡️ ${CLANS[winner]?.name} defends ${PROVINCE_DATA[battle.province]?.name}! ${CLANS[loser]?.name} army destroyed.`
        });
      }
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

  const getColor = (provId) => CLANS[provinces[provId]?.owner]?.color || '#5c5347';

  const handleProvinceClick = (idx) => {
    if (isPanning) return;
    const provId = PATH_TO_PROVINCE[idx];
    if (!provId) return;
    if (selectedArmy && provinces[selectedArmy].neighbors.includes(provId)) {
      const existing = pendingMoves.find(m => m.from === selectedArmy && m.clan === clan);
      if (existing) {
        setPendingMoves(pendingMoves.map(m => m.id === existing.id ? { ...m, to: provId } : m));
      } else {
        setPendingMoves([...pendingMoves, { id: Date.now(), from: selectedArmy, to: provId, clan }]);
      }
      setSelectedArmy(null);
      return;
    }
    setSelected(provId);
    setSelectedArmy(null);
  };

  const startArmyMove = (provId) => {
    if (currentPhase.phase === 'BATTLE') return;
    if (provinces[provId].owner === clan && provinces[provId].armies > 0) setSelectedArmy(provId);
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
    <div className="w-full h-screen flex" style={{ background: '#1a1a1a', fontFamily: "'Cinzel', serif" }}>
      <div className="flex-1 relative overflow-hidden">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10" style={{ background: `linear-gradient(180deg, ${S.woodMid} 0%, ${S.woodDark} 100%)`, borderBottom: `3px solid ${S.woodLight}` }}>
          <div className="flex items-center px-6 py-3 gap-6">
            <div className="flex items-center gap-3">
              <span style={{ color: S.gold, fontSize: '28px', fontWeight: '700' }}>戦国</span>
              <span style={{ color: S.parchment, fontSize: '14px', letterSpacing: '3px' }}>SENGOKU</span>
            </div>
            
            <div className="relative flex items-center justify-center" style={{ width: '60px', height: '60px' }}>
              <svg viewBox="0 0 60 60" className="absolute inset-0">
                <circle cx="30" cy="30" r="25" fill="none" stroke={S.gold} strokeWidth="2" strokeDasharray="4 2" />
              </svg>
              <div className="text-center">
                <div style={{ color: S.parchmentDark, fontSize: '8px' }}>WEEK</div>
                <div style={{ color: S.gold, fontSize: '20px', fontWeight: '700' }}>{week}</div>
              </div>
            </div>

            <div style={{ 
              background: currentPhase.color, 
              padding: '10px 24px', 
              clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              border: currentPhase.phase === 'BATTLE' ? '1px solid #ff4444' : '1px solid #4a7c23'
            }}>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: '700', letterSpacing: '2px' }}>{currentPhase.label}</span>
            </div>

            {currentPhase.phase === 'PLANNING' && (
              <div style={{ color: S.parchmentDark, fontSize: '11px' }}>
                <span style={{ opacity: 0.7 }}>Orders lock: </span>
                <span style={{ color: S.gold, fontFamily: 'monospace' }}>{timeUntilDeadline.days}d {timeUntilDeadline.hours}h {timeUntilDeadline.minutes}m</span>
              </div>
            )}

            <div className="flex-1" />

            <select value={clan} onChange={e => setClan(e.target.value)} style={{ background: S.woodDark, border: `1px solid ${S.woodLight}`, color: CLANS[clan]?.color, padding: '6px 12px', fontFamily: 'inherit', fontWeight: '600' }}>
              {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
                <option key={id} value={id} style={{ background: S.woodDark, color: S.parchment }}>{c.name}</option>
              ))}
            </select>

            <button onClick={() => setAdmin(!admin)} style={{ background: admin ? S.red : S.woodDark, border: `1px solid ${S.woodLight}`, color: S.parchment, padding: '6px 14px', fontSize: '11px' }}>
              {admin ? 'ADMIN ON' : 'ADMIN'}
            </button>
          </div>
        </div>

        {/* Zoom */}
        <div className="absolute top-24 right-4 z-20 flex flex-col gap-1">
          {[{ l: '+', a: () => setViewBox(v => ({ ...v, w: Math.max(200, v.w * 0.8), h: Math.max(200, v.h * 0.8) })) },
            { l: '−', a: () => setViewBox(v => ({ ...v, w: Math.min(1500, v.w * 1.2), h: Math.min(1600, v.h * 1.2) })) },
            { l: '◯', a: () => setViewBox({ x: 0, y: 0, w: 732, h: 777 }) }].map((b, i) => (
            <button key={i} onClick={b.a} style={{ width: 32, height: 32, background: S.woodMid, border: `1px solid ${S.woodLight}`, color: S.parchment, fontSize: 16 }}>{b.l}</button>
          ))}
        </div>

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
            const battle = activeBattles.find(b => b.province === provId);
            
            // Check if there's a pending attack at this province
            const pending = pendingAttacks.find(p => p.to === provId);
            
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
            
            return (
              <g key={provId} style={{ pointerEvents: 'none' }}>
                {isZoomedIn && <text x={cx} y={cy - (owned && prov.armies > 0 ? 6 : 0) - (battle || pending ? 10 : 0)} textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="600" fill={S.parchment} letterSpacing="0.5" style={{ textShadow: '1px 1px 2px #000, -1px -1px 2px #000' }}>{PROVINCE_DATA[provId]?.name.toUpperCase()}</text>}
                
                {/* Active Battle Indicator - show both armies clashing */}
                {battle && (
                  <g>
                    {/* Battle crossed swords icon */}
                    <text x={cx} y={cy - (isZoomedIn ? 2 : 8)} textAnchor="middle" dominantBaseline="middle" fontSize="10" style={{ filter: 'drop-shadow(0 0 2px #000)' }}>⚔️</text>
                    
                    {/* Attacker banner (left) */}
                    <g>
                      <path d={`M${cx - 18} ${cy + (isZoomedIn ? 6 : 0)} h12 v8 l-3 -2 l-3 2 l-3 -2 l-3 2 v-8 z`} fill={CLANS[battle.attacker]?.color} stroke="#000" strokeWidth="1" filter="url(#shadow)" />
                      <text x={cx - 12} y={cy + (isZoomedIn ? 11 : 5)} textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="bold" fill="#fff" style={{ textShadow: '0 0 2px #000' }}>{battle.attackerArmies}</text>
                    </g>
                    
                    {/* Defender banner (right) */}
                    <g>
                      <path d={`M${cx + 6} ${cy + (isZoomedIn ? 6 : 0)} h12 v8 l-3 -2 l-3 2 l-3 -2 l-3 2 v-8 z`} fill={CLANS[battle.defender]?.color} stroke="#000" strokeWidth="1" filter="url(#shadow)" />
                      <text x={cx + 12} y={cy + (isZoomedIn ? 11 : 5)} textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="bold" fill="#fff" style={{ textShadow: '0 0 2px #000' }}>{battle.defenderArmies}</text>
                    </g>
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
                {!battle && !pending && owned && prov.armies > 0 && (
                  <g onClick={(e) => { e.stopPropagation(); startArmyMove(provId); }} style={{ cursor: prov.owner === clan && currentPhase.phase === 'PLANNING' ? 'pointer' : 'default', pointerEvents: 'auto' }}>
                    <path d={`M${cx - 6} ${cy + (isZoomedIn ? 2 : -4)} h12 v8 l-3 -2 l-3 2 l-3 -2 l-3 2 v-8 z`} fill={CLANS[prov.owner]?.color} stroke={prov.owner === clan ? S.gold : '#000'} strokeWidth="1" filter="url(#shadow)" />
                    <text x={cx} y={cy + (isZoomedIn ? 7 : 1)} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="bold" fill="#fff" style={{ textShadow: '0 0 2px #000' }}>{prov.armies}</text>
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
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20" style={{ background: S.woodMid, border: `3px solid ${S.woodLight}`, padding: '16px 24px' }}>
            <p style={{ color: S.parchment }}>進軍元 <span style={{ color: S.gold, fontWeight: '600' }}>{provinces[selectedArmy]?.name}</span></p>
            <p style={{ color: '#4a7c23', fontSize: '12px', margin: '8px 0' }}>Select destination</p>
            <button onClick={() => setSelectedArmy(null)} style={{ background: S.woodDark, border: `1px solid ${S.woodLight}`, color: S.parchment, padding: '8px 16px', fontSize: '12px' }}>Cancel</button>
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
                  <div style={{ color: S.parchment, fontSize: 12 }}>{provinces[m.from]?.name} → {provinces[m.to]?.name}</div>
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
                      <span style={{ color: S.parchment, fontSize: 12 }}>{provinces[m.from]?.name} → {provinces[m.to]?.name}</span>
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
                      <span style={{ color: S.parchmentDark, fontSize: 10 }}>vs</span>
                      <span style={{ color: CLANS[battle.defender]?.color, fontWeight: '600', fontSize: 13 }}>
                        {CLANS[battle.defender]?.name}
                      </span>
                    </div>
                    <div style={{ color: S.parchmentDark, fontSize: 10, marginBottom: 4 }}>
                      {battle.type === 'collision' ? '(Meeting Engagement)' : '(Attackers → Defenders)'}
                    </div>
                  </div>
                  
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: 8, marginBottom: 8 }}>
                    <div style={{ color: S.gold, fontSize: 11, fontWeight: '600' }}>
                      {BATTLE_TYPES[battle.battleType]?.icon} {BATTLE_TYPES[battle.battleType]?.name}
                    </div>
                    <div style={{ color: S.parchment, fontSize: 12, marginTop: 2 }}>
                      at <span style={{ fontWeight: '600' }}>{PROVINCE_DATA[battle.province]?.name}</span>
                    </div>
                    <div style={{ color: S.parchmentDark, fontSize: 9, marginTop: 4 }}>
                      {BATTLE_TYPES[battle.battleType]?.desc}
                    </div>
                  </div>
                  
                  <div style={{ color: S.parchmentDark, fontSize: 10, marginBottom: 8 }}>
                    Armies: {battle.attackerArmies} vs {battle.defenderArmies}
                  </div>
                  
                  {/* Chain Info - what happens next */}
                  {battle.chainInfo && (
                    <div style={{ background: 'rgba(184,134,11,0.2)', border: `1px solid ${S.gold}`, padding: 6, marginBottom: 8, fontSize: 9 }}>
                      <div style={{ color: S.gold, fontWeight: '600', marginBottom: 4 }}>📋 Next:</div>
                      <div style={{ color: CLANS[battle.attacker]?.color }}>
                        If {CLANS[battle.attacker]?.name} wins → {battle.chainInfo.attackerWinsNext}
                      </div>
                      <div style={{ color: CLANS[battle.defender]?.color, marginTop: 2 }}>
                        If {CLANS[battle.defender]?.name} wins → {battle.chainInfo.defenderWinsNext}
                      </div>
                    </div>
                  )}
                  
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

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10" style={{ background: S.woodMid, border: `3px solid ${S.woodLight}`, padding: '12px 16px' }}>
          <p style={{ color: S.parchmentDark, fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>CLANS</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
              <div key={id} className="flex items-center gap-2">
                <div style={{ width: 12, height: 12, background: c.color, border: '1px solid rgba(255,255,255,0.3)' }} />
                <span style={{ color: S.parchment, fontSize: 11 }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      {selected && provinces[selected] && (
        <div style={{ width: 320, background: `linear-gradient(180deg, ${S.woodDark} 0%, #1a0f0a 100%)`, borderLeft: `4px solid ${S.woodLight}`, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 20, background: `linear-gradient(135deg, ${getColor(selected)}40, transparent)`, borderBottom: `3px solid ${S.woodLight}` }}>
            <h2 style={{ color: S.parchment, fontSize: 24, fontWeight: '700' }}>{provinces[selected].name}</h2>
            <p style={{ color: S.parchmentDark, fontSize: 12 }}>領主 <span style={{ color: getColor(selected), fontWeight: '600' }}>{CLANS[provinces[selected].owner]?.name || 'None'}</span></p>
          </div>
          
          <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
            <div style={{ background: S.woodMid, border: `2px solid ${S.woodLight}`, padding: 16, marginBottom: 16 }}>
              <div className="flex justify-between items-center">
                <div><p style={{ color: S.parchment, fontWeight: '600' }}>駐留軍</p><p style={{ color: S.parchmentDark, fontSize: 10 }}>Armies</p></div>
                <span style={{ color: S.gold, fontSize: 28, fontWeight: '700' }}>{provinces[selected].armies}</span>
              </div>
            </div>

            <div style={{ background: S.woodMid, border: `2px solid ${S.woodLight}`, padding: 16, marginBottom: 16 }}>
              <div className="flex justify-between items-center">
                <div><p style={{ color: S.parchment, fontWeight: '600' }}>動員力</p><p style={{ color: S.parchmentDark, fontSize: 10 }}>Rally Cap</p></div>
                <span style={{ color: S.parchment, fontSize: 24, fontWeight: '600' }}>{provinces[selected].rallyCapacity || 0}</span>
              </div>
            </div>

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

            {provinces[selected].owner === clan && provinces[selected].armies > 0 && currentPhase.phase === 'PLANNING' && (
              <button onClick={() => startArmyMove(selected)} style={{ width: '100%', padding: 12, background: 'linear-gradient(180deg, #3d6b1e 0%, #2d5016 100%)', border: `2px solid #4a7c23`, color: S.parchment, fontSize: 14, fontWeight: '600', marginBottom: 16 }}>
                進軍 Move Army
              </button>
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
                  <button onClick={() => provinces[selected].armies > 0 && setProvinces({ ...provinces, [selected]: { ...provinces[selected], armies: provinces[selected].armies - 1 } })} style={{ flex: 1, padding: 8, background: S.red, border: 'none', color: S.parchment, fontSize: 11 }}>− Army</button>
                  <button onClick={() => setProvinces({ ...provinces, [selected]: { ...provinces[selected], armies: provinces[selected].armies + 1 } })} style={{ flex: 1, padding: 8, background: '#2d5016', border: 'none', color: S.parchment, fontSize: 11 }}>+ Army</button>
                </div>
                <input type="number" value={provinces[selected].rallyCapacity || 0} onChange={e => setProvinces({ ...provinces, [selected]: { ...provinces[selected], rallyCapacity: parseInt(e.target.value) || 0 } })} style={{ width: '100%', padding: 8, background: S.woodDark, border: `1px solid ${S.woodLight}`, color: S.parchment, fontSize: 12, marginBottom: 12 }} placeholder="Rally Capacity" />
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
                <button onClick={() => setWeek(w => w + 1)} style={{ width: '100%', padding: 10, background: `linear-gradient(180deg, ${S.gold} 0%, #8b6914 100%)`, border: 'none', color: S.woodDark, fontSize: 12, fontWeight: '600' }}>
                  Week {week} → {week + 1}
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setSelected(null)} style={{ margin: 16, padding: 12, background: S.woodMid, border: `2px solid ${S.woodLight}`, color: S.parchmentDark, fontSize: 12 }}>Close</button>
        </div>
      )}
    </div>
  );
}
