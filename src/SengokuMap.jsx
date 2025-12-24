import React, { useState } from 'react';

// Province data with SVG paths for accurate Japan geography
const PROVINCES = {
  // KYUSHU
  satsuma: { id: 'satsuma', name: 'Satsuma', x: 130, y: 520, resource: 'smithing', neighbors: ['osumi', 'higo'], path: 'M115,505 L145,500 L155,520 L150,545 L125,550 L110,535 Z' },
  osumi: { id: 'osumi', name: 'Osumi', x: 165, y: 535, resource: null, neighbors: ['satsuma', 'hyuga'], path: 'M150,545 L155,520 L175,515 L190,530 L180,555 L155,555 Z' },
  hyuga: { id: 'hyuga', name: 'Hyuga', x: 185, y: 490, resource: 'farming', neighbors: ['osumi', 'higo', 'bungo'], path: 'M175,515 L180,475 L200,460 L210,485 L195,520 L190,530 Z' },
  higo: { id: 'higo', name: 'Higo', x: 135, y: 470, resource: 'horses', neighbors: ['satsuma', 'hyuga', 'bungo', 'tsukushi', 'hizen'], path: 'M115,505 L125,470 L155,450 L180,475 L175,515 L155,520 L145,500 Z' },
  bungo: { id: 'bungo', name: 'Bungo', x: 200, y: 450, resource: 'naval', neighbors: ['hyuga', 'higo', 'buzen', 'tsukushi'], path: 'M180,475 L155,450 L170,430 L205,425 L215,450 L200,460 Z' },
  buzen: { id: 'buzen', name: 'Buzen', x: 210, y: 415, resource: 'craftwork', neighbors: ['bungo', 'tsukushi'], path: 'M205,425 L195,405 L215,395 L235,405 L230,425 L215,430 Z' },
  tsukushi: { id: 'tsukushi', name: 'Tsukushi', x: 160, y: 420, resource: 'philosophical', neighbors: ['higo', 'bungo', 'buzen', 'hizen'], path: 'M125,470 L130,435 L155,420 L195,405 L205,425 L170,430 L155,450 Z' },
  hizen: { id: 'hizen', name: 'Hizen', x: 115, y: 435, resource: 'naval', neighbors: ['higo', 'tsukushi'], path: 'M95,460 L100,430 L130,415 L155,420 L130,435 L125,470 L115,475 Z' },
  // SHIKOKU
  tosa: { id: 'tosa', name: 'Tosa', x: 290, y: 465, resource: 'forest', neighbors: ['iyo', 'sanuki', 'awa_shikoku'], path: 'M250,480 L270,450 L310,445 L340,460 L330,490 L280,495 Z' },
  iyo: { id: 'iyo', name: 'Iyo', x: 255, y: 435, resource: 'farming', neighbors: ['tosa', 'sanuki'], path: 'M235,455 L245,420 L280,415 L290,435 L270,450 L250,480 Z' },
  sanuki: { id: 'sanuki', name: 'Sanuki', x: 310, y: 420, resource: 'stone', neighbors: ['tosa', 'iyo', 'awa_shikoku'], path: 'M280,415 L295,400 L340,405 L345,430 L310,445 L290,435 Z' },
  awa_shikoku: { id: 'awa_shikoku', name: 'Awa', x: 345, y: 445, resource: 'horses', neighbors: ['tosa', 'sanuki'], path: 'M340,405 L365,415 L370,450 L340,460 L310,445 L345,430 Z' },
  // CHUGOKU
  nagato: { id: 'nagato', name: 'Nagato', x: 215, y: 370, resource: 'farming', neighbors: ['suo', 'iwami'], path: 'M195,385 L210,355 L245,350 L255,375 L240,390 L215,395 Z' },
  suo: { id: 'suo', name: 'Suo', x: 250, y: 385, resource: 'horses', neighbors: ['nagato', 'aki', 'iwami'], path: 'M240,390 L255,375 L285,370 L295,390 L275,405 L250,400 Z' },
  aki: { id: 'aki', name: 'Aki', x: 285, y: 385, resource: 'hallowed', neighbors: ['suo', 'bingo', 'iwami'], path: 'M275,405 L295,390 L325,385 L335,400 L315,415 L290,410 Z' },
  bingo: { id: 'bingo', name: 'Bingo', x: 330, y: 390, resource: 'naval', neighbors: ['aki', 'bitchu', 'izumo', 'hoki'], path: 'M315,415 L335,400 L360,395 L375,410 L355,425 L330,420 Z' },
  bitchu: { id: 'bitchu', name: 'Bitchu', x: 365, y: 400, resource: 'farming', neighbors: ['bingo', 'bizen', 'mimasaka', 'hoki'], path: 'M355,425 L375,410 L400,405 L410,420 L395,435 L370,430 Z' },
  bizen: { id: 'bizen', name: 'Bizen', x: 400, y: 410, resource: 'smithing', neighbors: ['bitchu', 'mimasaka', 'harima'], path: 'M395,435 L410,420 L440,415 L450,435 L430,450 L405,445 Z' },
  mimasaka: { id: 'mimasaka', name: 'Mimasaka', x: 400, y: 370, resource: 'iron', neighbors: ['bitchu', 'bizen', 'inaba', 'hoki', 'harima', 'tajima'], path: 'M375,390 L395,370 L425,365 L440,385 L410,420 L375,410 Z' },
  iwami: { id: 'iwami', name: 'Iwami', x: 265, y: 350, resource: 'gold', neighbors: ['nagato', 'suo', 'aki', 'izumo'], path: 'M245,350 L260,325 L295,320 L310,345 L285,370 L255,375 Z' },
  izumo: { id: 'izumo', name: 'Izumo', x: 310, y: 335, resource: 'farming', neighbors: ['iwami', 'bingo', 'hoki'], path: 'M295,320 L325,310 L355,320 L360,350 L335,365 L310,345 Z' },
  hoki: { id: 'hoki', name: 'Hoki', x: 360, y: 350, resource: 'craftwork', neighbors: ['izumo', 'bingo', 'bitchu', 'mimasaka', 'inaba'], path: 'M355,320 L380,315 L395,335 L395,370 L360,395 L360,350 Z' },
  inaba: { id: 'inaba', name: 'Inaba', x: 405, y: 335, resource: 'naval', neighbors: ['hoki', 'mimasaka', 'tajima'], path: 'M380,315 L410,305 L435,320 L425,365 L395,370 L395,335 Z' },
  // KINAI
  harima: { id: 'harima', name: 'Harima', x: 440, y: 420, resource: null, neighbors: ['bizen', 'mimasaka', 'tajima', 'tamba', 'settsu'], path: 'M430,450 L450,435 L475,425 L490,445 L470,465 L445,460 Z' },
  tajima: { id: 'tajima', name: 'Tajima', x: 440, y: 350, resource: 'farming', neighbors: ['inaba', 'mimasaka', 'harima', 'tamba', 'tango'], path: 'M410,305 L445,295 L465,315 L455,355 L425,365 L435,320 Z' },
  tamba: { id: 'tamba', name: 'Tamba', x: 480, y: 375, resource: 'farming', neighbors: ['tajima', 'harima', 'settsu', 'kyoto', 'tango', 'wakasa'], path: 'M455,355 L480,340 L510,350 L515,385 L490,400 L475,425 L450,435 L440,415 Z' },
  tango: { id: 'tango', name: 'Tango', x: 495, y: 315, resource: 'farming', neighbors: ['tajima', 'tamba', 'wakasa'], path: 'M465,315 L485,285 L520,290 L520,325 L510,350 L480,340 Z' },
  settsu: { id: 'settsu', name: 'Settsu', x: 500, y: 430, resource: 'philosophical', neighbors: ['harima', 'tamba', 'kawachi', 'kyoto', 'yamato'], path: 'M475,425 L490,400 L515,415 L520,445 L500,455 L490,445 Z' },
  kawachi: { id: 'kawachi', name: 'Kawachi', x: 515, y: 470, resource: 'farming', neighbors: ['settsu', 'yamato', 'kii', 'izumi'], path: 'M500,455 L520,445 L535,460 L530,490 L510,495 L495,475 Z' },
  kyoto: { id: 'kyoto', name: 'Kyoto', x: 540, y: 395, resource: 'philosophical', neighbors: ['tamba', 'settsu', 'omi', 'yamato', 'wakasa'], special: 'capital', path: 'M515,385 L540,370 L565,380 L560,415 L530,425 L515,415 Z' },
  yamato: { id: 'yamato', name: 'Yamato', x: 545, y: 455, resource: 'hallowed', neighbors: ['kyoto', 'settsu', 'kawachi', 'kii', 'iga'], path: 'M520,445 L545,430 L570,445 L565,480 L530,490 L535,460 Z' },
  kii: { id: 'kii', name: 'Kii', x: 535, y: 520, resource: 'ninja', neighbors: ['kawachi', 'yamato', 'iga', 'ise'], path: 'M495,520 L530,490 L565,480 L580,510 L560,550 L510,545 Z' },
  iga: { id: 'iga', name: 'Iga', x: 580, y: 470, resource: 'ninja', neighbors: ['yamato', 'kii', 'ise', 'omi'], path: 'M565,480 L570,445 L595,450 L600,480 L580,510 Z' },
  // TOKAI
  omi: { id: 'omi', name: 'Omi', x: 580, y: 410, resource: 'ninja', neighbors: ['kyoto', 'iga', 'ise', 'mino', 'wakasa', 'echizen'], path: 'M540,370 L570,355 L600,365 L610,400 L595,450 L570,445 L560,415 Z' },
  wakasa: { id: 'wakasa', name: 'Wakasa', x: 545, y: 340, resource: 'farming', neighbors: ['tango', 'tamba', 'kyoto', 'omi', 'echizen'], path: 'M520,325 L550,310 L575,320 L570,355 L540,370 L515,350 Z' },
  echizen: { id: 'echizen', name: 'Echizen', x: 590, y: 335, resource: 'craftwork', neighbors: ['wakasa', 'omi', 'mino', 'kaga', 'hida'], path: 'M550,310 L580,290 L610,300 L620,335 L600,365 L570,355 L575,320 Z' },
  ise: { id: 'ise', name: 'Ise', x: 625, y: 465, resource: 'hallowed', neighbors: ['iga', 'omi', 'mino', 'owari', 'kii'], path: 'M595,450 L610,430 L640,440 L650,480 L600,480 Z' },
  mino: { id: 'mino', name: 'Mino', x: 635, y: 400, resource: 'farming', neighbors: ['omi', 'echizen', 'ise', 'owari', 'hida', 's_shinano'], path: 'M600,365 L620,355 L655,365 L660,400 L640,440 L610,430 L610,400 Z' },
  owari: { id: 'owari', name: 'Owari', x: 670, y: 445, resource: null, neighbors: ['ise', 'mino', 'mikawa', 's_shinano'], path: 'M640,440 L660,425 L690,435 L695,465 L660,475 L650,480 Z' },
  mikawa: { id: 'mikawa', name: 'Mikawa', x: 710, y: 465, resource: 'horses', neighbors: ['owari', 'totomi', 's_shinano'], path: 'M695,465 L690,435 L720,430 L735,455 L720,475 L700,480 Z' },
  totomi: { id: 'totomi', name: 'Totomi', x: 750, y: 465, resource: 'farming', neighbors: ['mikawa', 'suruga', 's_shinano'], path: 'M720,475 L735,455 L765,450 L780,470 L760,490 L740,485 Z' },
  suruga: { id: 'suruga', name: 'Suruga', x: 795, y: 460, resource: 'philosophical', neighbors: ['totomi', 'izu', 'kai', 's_shinano'], path: 'M765,450 L780,430 L810,435 L820,460 L795,480 L780,470 Z' },
  izu: { id: 'izu', name: 'Izu', x: 840, y: 485, resource: 'gold', neighbors: ['suruga', 'sagami'], path: 'M820,460 L840,455 L855,480 L845,510 L820,505 L815,485 Z' },
  // HOKURIKU
  kaga: { id: 'kaga', name: 'Kaga', x: 625, y: 305, resource: 'smithing', neighbors: ['echizen', 'noto', 'etchu', 'hida'], path: 'M580,290 L605,270 L640,275 L650,305 L620,335 L610,300 Z' },
  noto: { id: 'noto', name: 'Noto', x: 650, y: 260, resource: 'farming', neighbors: ['kaga', 'etchu'], path: 'M605,270 L625,235 L665,230 L670,260 L640,275 Z' },
  etchu: { id: 'etchu', name: 'Etchu', x: 680, y: 290, resource: 'farming', neighbors: ['kaga', 'noto', 'hida', 'echigo', 'n_shinano'], path: 'M640,275 L670,260 L705,265 L715,300 L680,320 L650,305 Z' },
  hida: { id: 'hida', name: 'Hida', x: 665, y: 355, resource: 'forest', neighbors: ['echizen', 'kaga', 'etchu', 'mino', 'n_shinano', 's_shinano'], path: 'M620,335 L650,305 L680,320 L685,360 L655,365 Z' },
  // SHINANO
  n_shinano: { id: 'n_shinano', name: 'N. Shinano', x: 725, y: 350, resource: 'farming', neighbors: ['etchu', 'hida', 's_shinano', 'echigo', 'kozuke'], path: 'M680,320 L715,300 L750,310 L755,355 L720,375 L685,360 Z' },
  s_shinano: { id: 's_shinano', name: 'S. Shinano', x: 725, y: 410, resource: 'stone', neighbors: ['mino', 'owari', 'mikawa', 'totomi', 'suruga', 'kai', 'hida', 'n_shinano', 'kozuke'], path: 'M685,360 L720,375 L755,385 L760,430 L720,430 L690,435 L660,425 L655,365 Z' },
  kai: { id: 'kai', name: 'Kai', x: 800, y: 425, resource: 'horses', neighbors: ['suruga', 's_shinano', 'sagami', 'musashi', 'kozuke'], path: 'M755,385 L785,375 L815,390 L820,430 L780,430 L760,430 Z' },
  // KANTO
  sagami: { id: 'sagami', name: 'Sagami', x: 855, y: 455, resource: 'smithing', neighbors: ['izu', 'kai', 'musashi'], path: 'M815,390 L845,400 L865,435 L855,465 L820,460 L810,435 L820,430 Z' },
  musashi: { id: 'musashi', name: 'Musashi', x: 870, y: 410, resource: 'farming', neighbors: ['sagami', 'kai', 'kozuke', 'shimotsuke', 'shimosa', 'kazusa'], path: 'M815,390 L830,365 L870,355 L895,380 L890,420 L865,435 L845,400 Z' },
  kozuke: { id: 'kozuke', name: 'Kozuke', x: 805, y: 355, resource: 'philosophical', neighbors: ['n_shinano', 's_shinano', 'kai', 'musashi', 'shimotsuke', 'echigo'], path: 'M750,310 L780,295 L820,305 L830,365 L815,390 L785,375 L755,355 Z' },
  shimotsuke: { id: 'shimotsuke', name: 'Shimotsuke', x: 880, y: 350, resource: 'hallowed', neighbors: ['kozuke', 'musashi', 'shimosa', 'hitachi', 'echigo', 'iwashiro'], path: 'M820,305 L855,295 L895,310 L900,355 L870,355 L830,365 Z' },
  shimosa: { id: 'shimosa', name: 'Shimosa', x: 920, y: 395, resource: 'farming', neighbors: ['musashi', 'shimotsuke', 'hitachi', 'kazusa'], path: 'M895,380 L925,365 L945,390 L935,420 L905,430 L890,420 Z' },
  kazusa: { id: 'kazusa', name: 'Kazusa', x: 925, y: 445, resource: null, neighbors: ['musashi', 'shimosa', 'awa_kanto'], path: 'M890,420 L905,430 L935,420 L940,455 L915,475 L890,460 L865,435 Z' },
  awa_kanto: { id: 'awa_kanto', name: 'Awa', x: 935, y: 495, resource: 'naval', neighbors: ['kazusa'], path: 'M915,475 L940,470 L955,495 L940,520 L915,510 Z' },
  hitachi: { id: 'hitachi', name: 'Hitachi', x: 945, y: 355, resource: 'craftwork', neighbors: ['shimotsuke', 'shimosa', 'iwashiro', 'iwaki'], path: 'M895,310 L920,290 L955,305 L960,355 L945,390 L925,365 L900,355 Z' },
  // TOHOKU
  echigo: { id: 'echigo', name: 'Echigo', x: 760, y: 285, resource: 'naval', neighbors: ['etchu', 'n_shinano', 'kozuke', 'shimotsuke', 'uzen', 'ugo', 'sado'], path: 'M705,265 L730,240 L780,235 L810,260 L820,305 L780,295 L750,310 L715,300 Z' },
  sado: { id: 'sado', name: 'Sado', x: 710, y: 230, resource: 'gold', neighbors: ['echigo'], path: 'M680,205 L710,200 L720,225 L700,240 L675,235 Z' },
  ugo: { id: 'ugo', name: 'Ugo', x: 795, y: 205, resource: 'stone', neighbors: ['echigo', 'uzen', 'rikuchu'], path: 'M750,220 L775,180 L820,175 L830,215 L800,245 L780,235 Z' },
  uzen: { id: 'uzen', name: 'Uzen', x: 850, y: 245, resource: 'hallowed', neighbors: ['echigo', 'shimotsuke', 'ugo', 'iwashiro', 'rikuzen', 'rikuchu'], path: 'M800,245 L830,215 L870,225 L885,265 L855,295 L820,305 L810,260 Z' },
  iwashiro: { id: 'iwashiro', name: 'Iwashiro', x: 890, y: 295, resource: 'forest', neighbors: ['shimotsuke', 'uzen', 'hitachi', 'iwaki', 'rikuzen'], path: 'M855,295 L885,265 L915,275 L920,310 L895,310 Z' },
  iwaki: { id: 'iwaki', name: 'Iwaki', x: 955, y: 310, resource: 'iron', neighbors: ['hitachi', 'iwashiro', 'rikuzen'], path: 'M920,290 L950,275 L970,295 L960,330 L955,305 Z' },
  rikuzen: { id: 'rikuzen', name: 'Rikuzen', x: 925, y: 245, resource: 'naval', neighbors: ['uzen', 'iwashiro', 'iwaki', 'rikuchu'], path: 'M885,265 L905,225 L945,220 L960,260 L950,275 L920,290 L915,275 Z' },
  rikuchu: { id: 'rikuchu', name: 'Rikuchu', x: 885, y: 185, resource: 'horses', neighbors: ['ugo', 'uzen', 'rikuzen', 'mutsu'], path: 'M830,215 L845,165 L895,150 L925,175 L945,220 L905,225 L870,225 Z' },
  mutsu: { id: 'mutsu', name: 'Mutsu', x: 885, y: 130, resource: 'smithing', neighbors: ['rikuchu'], path: 'M845,165 L855,115 L900,95 L935,120 L930,165 L895,150 Z' },
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
  uncontrolled: { id: 'uncontrolled', name: 'Neutral', color: '#52525B', provinces: [] },
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

  const color = (id) => CLANS[provinces[id]?.owner]?.color || '#52525B';

  const clickProv = (id) => {
    if (selArmy && !moveTarget && provinces[selArmy.prov].neighbors.includes(id)) { setMoveTarget(id); return; }
    setSelected(id); setSelArmy(null); setMoveTarget(null); setBuildMenu(false);
  };

  const clickArmy = (e, id) => {
    e.stopPropagation();
    if (provinces[id].owner === clan && provinces[id].armies > 0) {
      setSelArmy({ prov: id }); setSelected(id); setMoveTarget(null);
    }
  };

  const confirmMove = () => {
    if (selArmy && moveTarget) {
      setMoves([...moves, { id: Date.now(), from: selArmy.prov, to: moveTarget, clan }]);
      setSelArmy(null); setMoveTarget(null);
    }
  };

  const build = (type) => {
    if (!selected || provinces[selected].owner !== clan || provinces[selected].constructing) return;
    setProvinces({ ...provinces, [selected]: { ...provinces[selected], constructing: { type, days: BUILDINGS[type].time } } });
    setBuildMenu(false);
  };

  const changeOwner = (id, newOwner) => setProvinces({ ...provinces, [id]: { ...provinces[id], owner: newOwner } });

  return (
    <div className="w-full h-screen bg-stone-950 relative overflow-hidden" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-stone-900 to-transparent z-10 flex items-center justify-center">
        <h1 className="text-3xl font-bold" style={{ color: '#C9A227', textShadow: '2px 2px 6px #000' }}>
          戦国 <span className="text-xl text-stone-400">SENGOKU</span>
        </h1>
      </div>

      {/* Map */}
      <svg viewBox="70 80 920 500" className="w-full h-full" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)' }}>
        <defs>
          <pattern id="water" patternUnits="userSpaceOnUse" width="40" height="40">
            <rect width="40" height="40" fill="#0c1929" />
            <circle cx="20" cy="20" r="1" fill="#1e3a5f" opacity="0.3" />
          </pattern>
          <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#fbbf24" /></marker>
        </defs>
        
        <rect x="0" y="0" width="1000" height="600" fill="url(#water)" />

        {/* Provinces */}
        {Object.entries(PROVINCES).map(([id, p]) => {
          const isSel = selected === id, isHov = hovered === id;
          const isTarget = selArmy && provinces[selArmy.prov]?.neighbors.includes(id);
          const isMoveT = moveTarget === id;
          return (
            <path key={id} d={p.path} fill={color(id)} fillOpacity={isSel ? 0.9 : isHov ? 0.8 : 0.6}
              stroke={isSel ? '#fbbf24' : isMoveT ? '#22c55e' : isTarget ? '#fbbf24' : '#374151'}
              strokeWidth={isSel ? 3 : isTarget ? 2 : 1} filter={isSel || isHov ? 'url(#glow)' : undefined}
              style={{ cursor: 'pointer', transition: 'all 0.15s' }}
              onClick={() => clickProv(id)} onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)} />
          );
        })}

        {/* Labels & Armies */}
        {Object.entries(PROVINCES).map(([id, p]) => {
          const pr = provinces[id], isMine = pr.owner === clan;
          return (
            <g key={`lbl-${id}`} style={{ pointerEvents: 'none' }}>
              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fill="#fff" style={{ textShadow: '1px 1px 2px #000' }}>{p.name}</text>
              {p.resource && <text x={p.x + 22} y={p.y - 6} fontSize="9">{RESOURCES[p.resource]?.icon}</text>}
              {p.special === 'capital' && <text x={p.x} y={p.y + 18} textAnchor="middle" fontSize="12">👑</text>}
              {pr.armies > 0 && (
                <g style={{ pointerEvents: 'auto', cursor: isMine ? 'pointer' : 'default' }} onClick={(e) => clickArmy(e, id)}>
                  <circle cx={p.x} cy={p.y + 6} r={9} fill="#1f2937" stroke={isMine ? '#fbbf24' : '#6b7280'} strokeWidth={1.5} />
                  <text x={p.x} y={p.y + 10} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">{pr.armies}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Movement arrows */}
        {moves.filter(m => m.clan === clan).map(m => (
          <line key={m.id} x1={PROVINCES[m.from].x} y1={PROVINCES[m.from].y} x2={PROVINCES[m.to].x} y2={PROVINCES[m.to].y}
            stroke={CLANS[m.clan]?.color} strokeWidth={3} strokeDasharray="8,4" markerEnd="url(#arrow)" opacity={0.8} />
        ))}
        {selArmy && moveTarget && (
          <line x1={PROVINCES[selArmy.prov].x} y1={PROVINCES[selArmy.prov].y} x2={PROVINCES[moveTarget].x} y2={PROVINCES[moveTarget].y}
            stroke="#22c55e" strokeWidth={4} strokeDasharray="10,5" markerEnd="url(#arrow)" />
        )}
      </svg>

      {/* Top controls */}
      <div className="absolute top-16 left-4 flex gap-2 z-20">
        <div className="bg-stone-900/90 rounded border border-stone-700 px-3 py-2">
          <p className="text-stone-500 text-xs">Week</p>
          <p className="text-amber-400 font-bold text-xl">{week}</p>
        </div>
        <div className="bg-stone-900/90 rounded border border-stone-700 px-3 py-2">
          <p className="text-stone-500 text-xs">Clan</p>
          <select value={clan} onChange={e => setClan(e.target.value)} className="bg-transparent font-bold" style={{ color: CLANS[clan]?.color }}>
            {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
              <option key={id} value={id} style={{ color: '#fff', background: '#1c1917' }}>{c.name}</option>
            ))}
          </select>
        </div>
        <button onClick={() => setAdmin(!admin)} className={`px-3 py-2 rounded border ${admin ? 'bg-red-900/80 border-red-600 text-red-300' : 'bg-stone-900/90 border-stone-700 text-stone-400'}`}>
          {admin ? '🔓 Admin' : '🔒'}
        </button>
      </div>

      {/* Province panel */}
      {selected && (
        <div className="absolute top-16 right-4 w-72 bg-stone-900/95 rounded border border-stone-700 shadow-xl z-20 overflow-hidden">
          <div className="p-3 border-b border-stone-700" style={{ background: color(selected) + '30' }}>
            <h2 className="text-xl font-bold text-white">{PROVINCES[selected].name} {PROVINCES[selected].special === 'capital' && '👑'}</h2>
            <p className="text-sm text-stone-300">Owner: <span style={{ color: color(selected) }}>{CLANS[provinces[selected].owner]?.name}</span></p>
          </div>
          <div className="p-3 space-y-3">
            {PROVINCES[selected].resource && (
              <div className="flex items-center gap-2 p-2 bg-stone-800/50 rounded">
                <span className="text-xl">{RESOURCES[PROVINCES[selected].resource]?.icon}</span>
                <span className="text-white">{RESOURCES[PROVINCES[selected].resource]?.name}</span>
              </div>
            )}
            <div className="flex justify-between"><span className="text-stone-400">Armies:</span><span className="text-white font-bold">{provinces[selected].armies}</span></div>
            <div><p className="text-stone-400 text-sm mb-1">Borders:</p>
              <div className="flex flex-wrap gap-1">
                {PROVINCES[selected].neighbors.map(n => <button key={n} onClick={() => setSelected(n)} className="text-xs px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300">{PROVINCES[n]?.name}</button>)}
              </div>
            </div>
            {provinces[selected].owner === clan && (
              <div className="pt-2 border-t border-stone-700 space-y-2">
                {!provinces[selected].constructing && <button onClick={() => setBuildMenu(!buildMenu)} className="w-full py-2 bg-amber-700 hover:bg-amber-600 rounded text-white">🏗️ Build</button>}
                {buildMenu && (
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(BUILDINGS).map(([id, b]) => <button key={id} onClick={() => build(id)} className="p-2 bg-stone-800 hover:bg-stone-700 rounded text-sm text-white">{b.icon} {b.name}</button>)}
                  </div>
                )}
                {provinces[selected].armies > 0 && !selArmy && <button onClick={e => clickArmy(e, selected)} className="w-full py-2 bg-blue-700 hover:bg-blue-600 rounded text-white">🎌 Move Army</button>}
              </div>
            )}
            {admin && (
              <div className="pt-2 border-t border-red-900">
                <p className="text-red-400 text-xs mb-1">Admin: Change Owner</p>
                <select value={provinces[selected].owner} onChange={e => changeOwner(selected, e.target.value)} className="w-full p-2 bg-stone-800 text-white rounded border border-stone-600">
                  {Object.entries(CLANS).map(([id, c]) => <option key={id} value={id}>{c.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Move confirmation */}
      {selArmy && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-stone-900/95 rounded border border-stone-700 p-4 z-20">
          <p className="text-white mb-2">Move from <span className="text-blue-400 font-bold">{PROVINCES[selArmy.prov]?.name}</span>
            {moveTarget && <> → <span className="text-green-400 font-bold">{PROVINCES[moveTarget]?.name}</span></>}
          </p>
          {!moveTarget && <p className="text-amber-400 text-sm mb-2">Click neighboring province</p>}
          <div className="flex gap-2">
            {moveTarget && <button onClick={confirmMove} className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded text-white">✓ Confirm</button>}
            <button onClick={() => { setSelArmy(null); setMoveTarget(null); }} className="px-4 py-2 bg-stone-700 hover:bg-stone-600 rounded text-white">✕ Cancel</button>
          </div>
        </div>
      )}

      {/* Planned moves */}
      {moves.filter(m => m.clan === clan).length > 0 && (
        <div className="absolute bottom-4 right-4 w-56 bg-stone-900/95 rounded border border-stone-700 z-20">
          <div className="p-2 border-b border-stone-700"><h3 className="text-white font-bold text-sm">📋 Orders</h3></div>
          <div className="p-2 space-y-1 max-h-32 overflow-y-auto">
            {moves.filter(m => m.clan === clan).map(m => (
              <div key={m.id} className="flex items-center justify-between bg-stone-800 rounded px-2 py-1">
                <span className="text-xs text-white">{PROVINCES[m.from]?.name} → {PROVINCES[m.to]?.name}</span>
                <button onClick={() => setMoves(moves.filter(x => x.id !== m.id))} className="text-red-400 text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-stone-900/90 rounded border border-stone-700 p-2 z-20">
        <p className="text-stone-400 text-xs mb-1">Clans</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          {Object.entries(CLANS).filter(([id]) => id !== 'uncontrolled').map(([id, c]) => (
            <div key={id} className="flex items-center gap-1"><div className="w-2 h-2 rounded" style={{ background: c.color }} /><span className="text-xs text-stone-300">{c.name}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}
