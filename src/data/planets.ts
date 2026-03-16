export interface MoonData {
  name: string;
  radius: number;
  distance: number;
  speed: number;
  color: number;
}

export interface StructureLayer {
  name: string;
  r: number;
  color: string;
  temp: string;
  comp: string;
  thick: string;
}

export interface QuizItem {
  q: string;
  opts: string[];
  ans: number;
}

export interface Milestone {
  year: string;
  event: string;
}

export interface PlanetInfo {
  diameter: string;
  mass: string;
  orbit?: string;
  distSun?: string;
  gravity: string;
  moons?: string;
  type?: string;
  temp?: string;
  age?: string;
  atmosphere?: string;
}

export interface PlanetData {
  id: string;
  name: string;
  nameEn: string;
  radius: number;
  distance: number;
  speed: number;
  rotSpeed: number;
  color: number;
  emissive?: number;
  roughness?: number;
  isStar?: boolean;
  hasAtmosphere?: boolean;
  hasBands?: boolean;
  hasRing?: boolean;
  ringOpacity?: number;
  inclination: number;
  axialTilt: number;
  mass: number;
  diameterKm: number;
  type: string;
  gravity: number;
  tempC: number;
  moons?: MoonData[];
  info: PlanetInfo;
  structure: StructureLayer[];
  funFacts: string[];
  milestones: Milestone[];
  quiz: QuizItem[];
}

export const PLANETS: PlanetData[] = [
  {
    id: 'sun',
    name: '\u592a\u9633',
    nameEn: 'Sun',
    radius: 8,
    distance: 0,
    speed: 0,
    rotSpeed: .002,
    color: 0xfdb813,
    emissive: 0xff8800,
    isStar: true,
    inclination: 0,
    axialTilt: 7.25,
    mass: 333000,
    diameterKm: 1392700,
    type: '\u6052\u661f',
    gravity: 274,
    tempC: 5500,
    info: {
      diameter: '1,392,700 km',
      mass: '1.989\u00d710\u00b3\u2070 kg',
      type: '\u9ec4\u77ee\u661f (G2V)',
      temp: '\u8868\u9762 5,500\u00b0C',
      gravity: '274 m/s\u00b2',
      age: '45.7\u4ebf\u5e74',
    },
    structure: [
      { name: '\u6838\u5fc3', r: .25, color: '#ff4411', temp: '1500\u4e07\u00b0C', comp: '\u6c22\u805a\u53d8\u4e3a\u6c26', thick: '\u592a\u9633\u534a\u5f8425%' },
      { name: '\u8f90\u5c04\u5c42', r: .5, color: '#ff7733', temp: '700\u4e07\u2192200\u4e07\u00b0C', comp: '\u5149\u5b50\u7f13\u6162\u4f20\u9012\u80fd\u91cf', thick: '\u592a\u9633\u534a\u5f8425%' },
      { name: '\u5bf9\u6d41\u5c42', r: .75, color: '#ffaa44', temp: '200\u4e07\u21925500\u00b0C', comp: '\u7b49\u79bb\u5b50\u4f53\u5bf9\u6d41', thick: '\u592a\u9633\u534a\u5f8425%' },
      { name: '\u5149\u7403\u5c42', r: 1, color: '#ffdd66', temp: '5,500\u00b0C', comp: '\u53ef\u89c1\u5149\u53d1\u5c04\u5c42', thick: '\u7ea6500km' },
    ],
    funFacts: [
      '\u592a\u9633\u6bcf\u79d2\u5c06400\u4e07\u5428\u7269\u8d28\u8f6c\u5316\u4e3a\u80fd\u91cf',
      '\u592a\u9633\u5149\u5230\u8fbe\u5730\u7403\u9700\u89818\u520620\u79d2',
      '\u592a\u9633\u7cfb99.86%\u7684\u8d28\u91cf\u96c6\u4e2d\u5728\u592a\u9633',
      '\u592a\u9633\u8868\u9762\u79ef\u662f\u5730\u7403\u768412,000\u500d',
    ],
    milestones: [
      { year: '1610', event: '\u4f3d\u5229\u7565\u9996\u6b21\u89c2\u6d4b\u592a\u9633\u9ed1\u5b50' },
      { year: '1868', event: '\u65e5\u98df\u89c2\u6d4b\u4e2d\u53d1\u73b0\u6c26\u5143\u7d20' },
      { year: '2018', event: '\u5e15\u514b\u592a\u9633\u63a2\u6d4b\u5668\u53d1\u5c04' },
    ],
    quiz: [
      { q: '\u592a\u9633\u5c5e\u4e8e\u4ec0\u4e48\u7c7b\u578b\u7684\u6052\u661f\uff1f', opts: ['\u7ea2\u77ee\u661f', '\u9ec4\u77ee\u661f', '\u84dd\u5de8\u661f', '\u767d\u77ee\u661f'], ans: 1 },
    ],
  },
  {
    id: 'mercury',
    name: '\u6c34\u661f',
    nameEn: 'Mercury',
    radius: .6,
    distance: 16,
    speed: 4.15,
    rotSpeed: .0017,
    color: 0x8c7e6d,
    roughness: .9,
    inclination: 7,
    axialTilt: .034,
    mass: .055,
    diameterKm: 4879,
    type: '\u5ca9\u77f3\u884c\u661f',
    gravity: 3.7,
    tempC: 167,
    info: {
      diameter: '4,879 km',
      mass: '3.285\u00d710\u00b2\u00b3 kg',
      orbit: '87.97\u5929',
      distSun: '5,790\u4e07km',
      gravity: '3.7 m/s\u00b2',
      moons: '0',
    },
    structure: [
      { name: '\u94c1\u6838', r: .42, color: '#aaa', temp: '\u7ea62000\u00b0C', comp: '\u94c1\u954d\u5408\u91d1', thick: '\u534a\u5f8475%' },
      { name: '\u7845\u9178\u76d0\u5730\u5e54', r: .8, color: '#aa9988', temp: '~1000\u00b0C', comp: '\u7845\u9178\u76d0\u5ca9\u77f3', thick: '\u7ea6500km' },
      { name: '\u5730\u58f3', r: 1, color: '#bbbbbb', temp: '-180~430\u00b0C', comp: '\u7384\u6b66\u5ca9', thick: '\u7ea630km' },
    ],
    funFacts: [
      '\u6c34\u661f\u662f\u6700\u5c0f\u7684\u884c\u661f',
      '\u6c34\u661f\u8868\u9762\u6e29\u5dee\u8d85\u8fc7600\u00b0C',
      '\u6c34\u661f\u4e0a\u4e00\u5929\u7b49\u4e8e176\u4e2a\u5730\u7403\u65e5',
      '\u6c34\u661f\u5bc6\u5ea6\u4ec5\u6b21\u4e8e\u5730\u7403',
    ],
    milestones: [
      { year: '1974', event: '\u6c34\u624b10\u53f7\u9996\u6b21\u98de\u8d8a\u6c34\u661f' },
      { year: '2011', event: '\u4fe1\u4f7f\u53f7\u8fdb\u5165\u6c34\u661f\u8f68\u9053' },
    ],
    quiz: [
      { q: '\u6c34\u661f\u6709\u591a\u5c11\u9897\u536b\u661f\uff1f', opts: ['0', '1', '2', '3'], ans: 0 },
    ],
  },
  {
    id: 'venus',
    name: '\u91d1\u661f',
    nameEn: 'Venus',
    radius: 1.2,
    distance: 22,
    speed: 1.62,
    rotSpeed: -.0004,
    color: 0xc8a55a,
    roughness: .6,
    hasAtmosphere: true,
    inclination: 3.39,
    axialTilt: 177.4,
    mass: .815,
    diameterKm: 12104,
    type: '\u5ca9\u77f3\u884c\u661f',
    gravity: 8.87,
    tempC: 462,
    info: {
      diameter: '12,104 km',
      mass: '4.867\u00d710\u00b2\u2074 kg',
      orbit: '224.7\u5929',
      distSun: '1.082\u4ebfkm',
      gravity: '8.87 m/s\u00b2',
      moons: '0',
      atmosphere: '96.5% CO\u2082',
    },
    structure: [
      { name: '\u94c1\u6838', r: .32, color: '#aa7744', temp: '~5000\u00b0C', comp: '\u94c1\u954d', thick: '\u7ea63000km' },
      { name: '\u5730\u5e54', r: .75, color: '#cc9955', temp: '~3000\u00b0C', comp: '\u7845\u9178\u76d0', thick: '\u7ea63000km' },
      { name: '\u5730\u58f3', r: .9, color: '#ddaa66', temp: '462\u00b0C', comp: '\u7384\u6b66\u5ca9', thick: '~30km' },
      { name: '\u7a20\u5bc6\u5927\u6c14', r: 1, color: '#eeccaa', temp: '462\u00b0C', comp: 'CO\u2082 + \u786b\u9178\u4e91', thick: '~250km' },
    ],
    funFacts: [
      '\u91d1\u661f\u662f\u6700\u70ed\u7684\u884c\u661f(462\u00b0C)',
      '\u91d1\u661f\u81ea\u8f6c\u65b9\u5411\u4e0e\u5176\u4ed6\u884c\u661f\u76f8\u53cd',
      '\u91d1\u661f\u4e0a\u4e00\u5929\u6bd4\u4e00\u5e74\u957f',
      '\u91d1\u661f\u5927\u6c14\u538b\u662f\u5730\u740392\u500d',
    ],
    milestones: [
      { year: '1962', event: '\u6c34\u624b2\u53f7\u9996\u6b21\u98de\u8d8a\u91d1\u661f' },
      { year: '1970', event: '\u91d1\u661f7\u53f7\u9996\u6b21\u7740\u9646\u91d1\u661f\u8868\u9762' },
    ],
    quiz: [
      { q: '\u91d1\u661f\u8868\u9762\u6e29\u5ea6\u7ea6\u4e3a\uff1f', opts: ['200\u00b0C', '350\u00b0C', '460\u00b0C', '600\u00b0C'], ans: 2 },
    ],
  },
  {
    id: 'earth',
    name: '\u5730\u7403',
    nameEn: 'Earth',
    radius: 1.3,
    distance: 30,
    speed: 1,
    rotSpeed: .01,
    color: 0x2266cc,
    roughness: .5,
    hasAtmosphere: true,
    inclination: 0,
    axialTilt: 23.44,
    mass: 1,
    diameterKm: 12756,
    type: '\u5ca9\u77f3\u884c\u661f',
    gravity: 9.8,
    tempC: 15,
    moons: [
      { name: '\u6708\u7403', radius: .35, distance: 3, speed: 2.5, color: 0xccccbb },
    ],
    info: {
      diameter: '12,756 km',
      mass: '5.972\u00d710\u00b2\u2074 kg',
      orbit: '365.25\u5929',
      distSun: '1.496\u4ebfkm',
      gravity: '9.8 m/s\u00b2',
      moons: '1',
      atmosphere: '78% N\u2082, 21% O\u2082',
    },
    structure: [
      { name: '\u5185\u6838', r: .19, color: '#ff6633', temp: '5400\u00b0C', comp: '\u56fa\u6001\u94c1\u954d', thick: '1220km' },
      { name: '\u5916\u6838', r: .35, color: '#ee8844', temp: '4000-5000\u00b0C', comp: '\u6db2\u6001\u94c1\u954d', thick: '2180km' },
      { name: '\u4e0b\u5730\u5e54', r: .7, color: '#cc6633', temp: '1000-3700\u00b0C', comp: '\u7845\u9178\u76d0', thick: '2230km' },
      { name: '\u4e0a\u5730\u5e54', r: .88, color: '#996644', temp: '500-900\u00b0C', comp: '\u6a44\u6984\u5ca9', thick: '670km' },
      { name: '\u5730\u58f3', r: 1, color: '#336699', temp: '15\u00b0C(\u8868\u9762)', comp: '\u82b1\u5c97\u5ca9/\u7384\u6b66\u5ca9', thick: '5-70km' },
    ],
    funFacts: [
      '\u5730\u7403\u662f\u5df2\u77e5\u552f\u4e00\u5b58\u5728\u751f\u547d\u7684\u884c\u661f',
      '\u5730\u7403\u81ea\u8f6c\u6b63\u9010\u6e10\u51cf\u6162',
      '\u5730\u7403\u78c1\u573a\u6b63\u4ee55%/\u4e16\u7eaa\u901f\u5ea6\u51cf\u5f31',
      '71%\u7684\u8868\u9762\u88ab\u6c34\u8986\u76d6',
    ],
    milestones: [
      { year: '1957', event: '\u65af\u666e\u7279\u5c3c\u514b1\u53f7 \u2014 \u9996\u9897\u4eba\u9020\u536b\u661f' },
      { year: '1961', event: '\u52a0\u52a0\u6797\u6210\u4e3a\u9996\u4f4d\u8fdb\u5165\u592a\u7a7a\u7684\u4eba\u7c7b' },
      { year: '1969', event: '\u963f\u6ce2\u7f5711\u53f7 \u2014 \u4eba\u7c7b\u9996\u6b21\u767b\u6708' },
      { year: '1990', event: '\u65c5\u884c\u80051\u53f7\u62cd\u6444\u201c\u6697\u6de1\u84dd\u70b9\u201d' },
    ],
    quiz: [
      { q: '\u5730\u7403\u5927\u6c14\u4e2d\u542b\u91cf\u6700\u9ad8\u7684\u6c14\u4f53\uff1f', opts: ['\u6c27\u6c14', '\u4e8c\u6c27\u5316\u78b3', '\u6c2e\u6c14', '\u6c29\u6c14'], ans: 2 },
    ],
  },
  {
    id: 'mars',
    name: '\u706b\u661f',
    nameEn: 'Mars',
    radius: .9,
    distance: 40,
    speed: .53,
    rotSpeed: .009,
    color: 0xc1440e,
    roughness: .85,
    inclination: 1.85,
    axialTilt: 25.19,
    mass: .107,
    diameterKm: 6792,
    type: '\u5ca9\u77f3\u884c\u661f',
    gravity: 3.72,
    tempC: -63,
    moons: [
      { name: '\u706b\u536b\u4e00', radius: .12, distance: 1.8, speed: 3, color: 0x998877 },
      { name: '\u706b\u536b\u4e8c', radius: .08, distance: 2.5, speed: 2, color: 0x887766 },
    ],
    info: {
      diameter: '6,792 km',
      mass: '6.39\u00d710\u00b2\u00b3 kg',
      orbit: '687\u5929',
      distSun: '2.279\u4ebfkm',
      gravity: '3.72 m/s\u00b2',
      moons: '2',
      atmosphere: '95.3% CO\u2082',
    },
    structure: [
      { name: '\u94c1\u6838', r: .35, color: '#cc5533', temp: '~1500\u00b0C', comp: '\u94c1\u786b\u5408\u91d1', thick: '~1800km' },
      { name: '\u7845\u9178\u76d0\u5730\u5e54', r: .8, color: '#bb6644', temp: '~800\u00b0C', comp: '\u7845\u9178\u76d0', thick: '~1500km' },
      { name: '\u5730\u58f3', r: 1, color: '#cc4422', temp: '-63\u00b0C(\u8868\u9762)', comp: '\u7384\u6b66\u5ca9+\u6c27\u5316\u94c1', thick: '~50km' },
    ],
    funFacts: [
      '\u5965\u6797\u5339\u65af\u5c71\u9ad821.9km\uff0c\u592a\u9633\u7cfb\u6700\u9ad8',
      '\u706b\u661f\u4e0a\u53d1\u73b0\u6db2\u6001\u6c34\u8bc1\u636e',
      '\u706b\u661f\u4e00\u5929\u7ea624h37min',
      '\u6c34\u624b\u53f7\u5ce1\u8c37\u957f4000km\u6df17km',
    ],
    milestones: [
      { year: '1971', event: '\u6c34\u624b9\u53f7\u9996\u4e2a\u73af\u7ed5\u706b\u661f\u63a2\u6d4b\u5668' },
      { year: '2012', event: '\u597d\u5947\u53f7\u7740\u9646\u76d6\u5c14\u649e\u51fb\u5751' },
      { year: '2021', event: '\u673a\u667a\u53f7\u5b9e\u73b0\u9996\u6b21\u5916\u661f\u98de\u884c' },
    ],
    quiz: [
      { q: '\u592a\u9633\u7cfb\u6700\u9ad8\u7684\u5c71\u5728\u54ea\u9897\u884c\u661f\uff1f', opts: ['\u5730\u7403', '\u91d1\u661f', '\u706b\u661f', '\u6728\u661f'], ans: 2 },
    ],
  },
  {
    id: 'jupiter',
    name: '\u6728\u661f',
    nameEn: 'Jupiter',
    radius: 4,
    distance: 58,
    speed: .084,
    rotSpeed: .024,
    color: 0xc9b08b,
    roughness: .4,
    hasBands: true,
    inclination: 1.31,
    axialTilt: 3.13,
    mass: 317.8,
    diameterKm: 142984,
    type: '\u6c14\u6001\u5de8\u884c\u661f',
    gravity: 24.79,
    tempC: -110,
    moons: [
      { name: '\u6728\u536b\u4e00', radius: .3, distance: 6.5, speed: 2.8, color: 0xddcc44 },
      { name: '\u6728\u536b\u4e8c', radius: .25, distance: 8, speed: 2.2, color: 0xbbaa88 },
      { name: '\u6728\u536b\u4e09', radius: .4, distance: 10, speed: 1.6, color: 0x998877 },
      { name: '\u6728\u536b\u56db', radius: .35, distance: 12, speed: 1.1, color: 0x887766 },
    ],
    info: {
      diameter: '142,984 km',
      mass: '1.898\u00d710\u00b2\u2077 kg',
      orbit: '11.86\u5e74',
      distSun: '7.786\u4ebfkm',
      gravity: '24.79 m/s\u00b2',
      moons: '95',
      atmosphere: '89% H\u2082, 10% He',
    },
    structure: [
      { name: '\u5ca9\u77f3\u6838\u5fc3', r: .15, color: '#886644', temp: '~24000\u00b0C', comp: '\u5ca9\u77f3+\u91d1\u5c5e', thick: '~1.5\u4e07km' },
      { name: '\u91d1\u5c5e\u6c22\u5c42', r: .5, color: '#aabb99', temp: '~10000\u00b0C', comp: '\u6db2\u6001\u91d1\u5c5e\u6c22', thick: '~4\u4e07km' },
      { name: '\u6db2\u6001\u6c22\u5c42', r: .78, color: '#ccbb99', temp: '~2000\u00b0C', comp: '\u6db2\u6001\u5206\u5b50\u6c22', thick: '~2\u4e07km' },
      { name: '\u6c14\u6001\u5927\u6c14', r: 1, color: '#d4a574', temp: '-110\u00b0C(\u4e91\u9876)', comp: 'H\u2082/He+NH\u2083\u4e91', thick: '~5000km' },
    ],
    funFacts: [
      '\u6728\u661f\u8d28\u91cf\u662f\u5176\u4f59\u884c\u661f\u4e4b\u548c\u76842.5\u500d',
      '\u5927\u7ea2\u6591\u6301\u7eed\u81f3\u5c11350\u5e74',
      '\u6728\u661f\u4e00\u5929\u4e0d\u523010\u5c0f\u65f6',
      '\u6728\u536b\u4e8c\u51b0\u5c42\u4e0b\u53ef\u80fd\u6709\u6db2\u6001\u6c34\u6d77\u6d0b',
    ],
    milestones: [
      { year: '1610', event: '\u4f3d\u5229\u7565\u53d1\u73b0\u56db\u5927\u536b\u661f' },
      { year: '1979', event: '\u65c5\u884c\u8005\u53f7\u98de\u8d8a\u6728\u661f' },
      { year: '2016', event: '\u6731\u8bfa\u53f7\u8fdb\u5165\u6728\u661f\u6781\u8f68\u9053' },
    ],
    quiz: [
      { q: '\u6728\u661f\u5927\u7ea2\u6591\u5b9e\u9645\u4e0a\u662f\u4ec0\u4e48\uff1f', opts: ['\u706b\u5c71', '\u649e\u51fb\u5751', '\u5de8\u578b\u98ce\u66b4', '\u5927\u9646'], ans: 2 },
    ],
  },
  {
    id: 'saturn',
    name: '\u571f\u661f',
    nameEn: 'Saturn',
    radius: 3.4,
    distance: 76,
    speed: .034,
    rotSpeed: .022,
    color: 0xead6b8,
    roughness: .35,
    hasRing: true,
    inclination: 2.49,
    axialTilt: 26.73,
    mass: 95.2,
    diameterKm: 120536,
    type: '\u6c14\u6001\u5de8\u884c\u661f',
    gravity: 10.44,
    tempC: -140,
    moons: [
      { name: '\u571f\u536b\u516d', radius: .4, distance: 8, speed: 1.5, color: 0xddaa55 },
      { name: '\u571f\u536b\u4e8c', radius: .15, distance: 5.5, speed: 2.5, color: 0xeeeedd },
    ],
    info: {
      diameter: '120,536 km',
      mass: '5.683\u00d710\u00b2\u2076 kg',
      orbit: '29.46\u5e74',
      distSun: '14.34\u4ebfkm',
      gravity: '10.44 m/s\u00b2',
      moons: '146',
      atmosphere: '96% H\u2082, 3% He',
    },
    structure: [
      { name: '\u5ca9\u77f3\u6838\u5fc3', r: .15, color: '#886655', temp: '~12000\u00b0C', comp: '\u5ca9\u77f3+\u51b0', thick: '~1.5\u4e07km' },
      { name: '\u91d1\u5c5e\u6c22\u5c42', r: .4, color: '#aaaa88', temp: '~8000\u00b0C', comp: '\u6db2\u6001\u91d1\u5c5e\u6c22', thick: '~2\u4e07km' },
      { name: '\u6db2\u6001\u6c22\u5c42', r: .7, color: '#cccc99', temp: '~2000\u00b0C', comp: '\u6db2\u6001\u5206\u5b50\u6c22', thick: '~1.5\u4e07km' },
      { name: '\u6c14\u6001\u5927\u6c14', r: 1, color: '#e8d5a0', temp: '-140\u00b0C(\u4e91\u9876)', comp: 'H\u2082/He+NH\u2083\u51b0\u6676', thick: '~3000km' },
    ],
    funFacts: [
      '\u571f\u661f\u5bc6\u5ea6\u6bd4\u6c34\u4f4e\uff0c\u7406\u8bba\u4e0a\u80fd\u6f02\u6d6e',
      '\u571f\u661f\u73af\u5bbd28\u4e07km\u4f46\u539a\u5ea6\u4ec510-20\u7c73',
      '\u571f\u661f\u6709\u65f6\u51fa\u73b0\u5927\u767d\u6591\u98ce\u66b4',
      '\u571f\u536b\u516d\u662f\u552f\u4e00\u6709\u6d53\u5bc6\u5927\u6c14\u7684\u536b\u661f',
    ],
    milestones: [
      { year: '1610', event: '\u4f3d\u5229\u7565\u9996\u6b21\u89c2\u6d4b\u571f\u661f\u73af' },
      { year: '2004', event: '\u5361\u897f\u5c3c\u53f7\u8fdb\u5165\u571f\u661f\u8f68\u9053' },
      { year: '2005', event: '\u60e0\u66f4\u65af\u53f7\u7740\u9646\u571f\u536b\u516d' },
    ],
    quiz: [
      { q: '\u5982\u679c\u628a\u571f\u661f\u653e\u8fdb\u6c34\u4e2d\u4f1a\uff1f', opts: ['\u6c89\u5165\u6c34\u5e95', '\u6f02\u6d6e\u8d77\u6765', '\u6eb6\u89e3', '\u7206\u70b8'], ans: 1 },
    ],
  },
  {
    id: 'uranus',
    name: '\u5929\u738b\u661f',
    nameEn: 'Uranus',
    radius: 2.2,
    distance: 96,
    speed: .012,
    rotSpeed: .014,
    color: 0x73c2d0,
    roughness: .3,
    hasRing: true,
    ringOpacity: .15,
    inclination: .77,
    axialTilt: 97.77,
    mass: 14.5,
    diameterKm: 51118,
    type: '\u51b0\u5de8\u661f',
    gravity: 8.87,
    tempC: -224,
    info: {
      diameter: '51,118 km',
      mass: '8.681\u00d710\u00b2\u2075 kg',
      orbit: '84.01\u5e74',
      distSun: '28.71\u4ebfkm',
      gravity: '8.87 m/s\u00b2',
      moons: '28',
      atmosphere: '83% H\u2082, 15% He, 2% CH\u2084',
    },
    structure: [
      { name: '\u5ca9\u77f3\u6838\u5fc3', r: .2, color: '#667788', temp: '~5000\u00b0C', comp: '\u7845\u9178\u76d0+\u94c1', thick: '~7500km' },
      { name: '\u51b0\u5c42(\u6c34/\u6c28/\u7532\u70f7)', r: .65, color: '#88bbcc', temp: '~2000\u00b0C', comp: '\u8d85\u4e34\u754c\u6c34+\u6c28+\u7532\u70f7', thick: '~1\u4e07km' },
      { name: '\u6c22/\u6c26\u5927\u6c14', r: 1, color: '#88ccdd', temp: '-224\u00b0C(\u4e91\u9876)', comp: 'H\u2082+He+CH\u2084', thick: '~5000km' },
    ],
    funFacts: [
      '\u81ea\u8f6c\u8f74\u503e\u659c97.77\u00b0\u51e0\u4e4e\u6a2a\u8eba',
      '\u84dd\u7eff\u8272\u56e0\u7532\u70f7\u5438\u6536\u7ea2\u5149',
      '\u6700\u51b7\u884c\u661f-224\u00b0C',
      '\u5149\u73af\u6697\u6de1\u4e0d\u6613\u89c2\u6d4b',
    ],
    milestones: [
      { year: '1781', event: '\u8d6b\u6b47\u5c14\u53d1\u73b0\u5929\u738b\u661f' },
      { year: '1986', event: '\u65c5\u884c\u80052\u53f7\u98de\u8d8a\u5929\u738b\u661f' },
    ],
    quiz: [
      { q: '\u5929\u738b\u661f\u84dd\u7eff\u8272\u662f\u56e0\u4e3a\u542b\u6709\uff1f', opts: ['\u6c27\u6c14', '\u7532\u70f7', '\u6c2e\u6c14', '\u6c34\u84b8\u6c14'], ans: 1 },
    ],
  },
  {
    id: 'neptune',
    name: '\u6d77\u738b\u661f',
    nameEn: 'Neptune',
    radius: 2.1,
    distance: 116,
    speed: .006,
    rotSpeed: .015,
    color: 0x3f54ba,
    roughness: .3,
    inclination: 1.77,
    axialTilt: 28.32,
    mass: 17.1,
    diameterKm: 49528,
    type: '\u51b0\u5de8\u661f',
    gravity: 11.15,
    tempC: -214,
    moons: [
      { name: '\u6d77\u536b\u4e00', radius: .25, distance: 4.5, speed: 1.8, color: 0xbbbbaa },
    ],
    info: {
      diameter: '49,528 km',
      mass: '1.024\u00d710\u00b2\u2076 kg',
      orbit: '164.8\u5e74',
      distSun: '44.95\u4ebfkm',
      gravity: '11.15 m/s\u00b2',
      moons: '16',
      atmosphere: '80% H\u2082, 19% He, 1% CH\u2084',
    },
    structure: [
      { name: '\u5ca9\u77f3\u6838\u5fc3', r: .2, color: '#445566', temp: '~5000\u00b0C', comp: '\u7845\u9178\u76d0+\u94c1', thick: '~7000km' },
      { name: '\u51b0\u5c42(\u6c34/\u6c28/\u7532\u70f7)', r: .65, color: '#4466aa', temp: '~2000\u00b0C', comp: '\u8d85\u4e34\u754c\u6d41\u4f53', thick: '~1\u4e07km' },
      { name: '\u6c22/\u6c26\u5927\u6c14', r: 1, color: '#3355cc', temp: '-214\u00b0C(\u4e91\u9876)', comp: 'H\u2082+He+CH\u2084', thick: '~5000km' },
    ],
    funFacts: [
      '\u98ce\u901f\u53ef\u8fbe2100 km/h\uff0c\u592a\u9633\u7cfb\u6700\u5f3a',
      '\u901a\u8fc7\u6570\u5b66\u9884\u6d4b\u88ab\u53d1\u73b0',
      '\u81ea\u53d1\u73b0\u4ee5\u6765\u521a\u5b8c\u6210\u7b2c\u4e00\u5708\u516c\u8f6c(2011)',
      '\u6d77\u536b\u4e00\u9006\u884c\u516c\u8f6c',
    ],
    milestones: [
      { year: '1846', event: '\u6839\u636e\u6570\u5b66\u9884\u6d4b\u53d1\u73b0\u6d77\u738b\u661f' },
      { year: '1989', event: '\u65c5\u884c\u80052\u53f7\u98de\u8d8a\u6d77\u738b\u661f' },
    ],
    quiz: [
      { q: '\u6d77\u738b\u661f\u662f\u901a\u8fc7\u4ec0\u4e48\u65b9\u5f0f\u53d1\u73b0\u7684\uff1f', opts: ['\u5076\u7136\u89c2\u6d4b', '\u6570\u5b66\u9884\u6d4b', '\u592a\u7a7a\u63a2\u6d4b', '\u65e5\u98df'], ans: 1 },
    ],
  },
];
