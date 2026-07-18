export interface Theme {
  id: string
  name: string
  desc: string
  primary: string
  secondary: string
  bg: string
  text: string
  badgeStyle: 'for-the-badge' | 'flat' | 'flat-square' | 'plastic' | 'social'
  bannerGradient: string
  statsTheme: string
  trophyTheme: string
  separator: string
  accent: string
  previewBg: string
}

export const THEMES: Theme[] = [
  {
    id: 'dark-modern',
    name: 'Dark Modern',
    desc: 'Oscuro con acentos cyan, el clasico',
    primary: '#00e5ff',
    secondary: '#0d7377',
    bg: '#0d1117',
    text: '#c9d1d9',
    badgeStyle: 'for-the-badge',
    bannerGradient: '0:0d1117,50:1a1b41,100:0d7377',
    statsTheme: 'dark',
    trophyTheme: 'algolia',
    separator: '---',
    accent: '#1a1b41',
    previewBg: '#0d1117',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    desc: 'Neon rosa, morado y verde fosfo',
    primary: '#ff00ff',
    secondary: '#00ff88',
    bg: '#0a0015',
    text: '#e0e0e0',
    badgeStyle: 'for-the-badge',
    bannerGradient: '0:0a0015,50:2d0030,100:003020',
    statsTheme: 'radical',
    trophyTheme: 'radical',
    separator: '---',
    accent: '#2d0030',
    previewBg: '#0a0015',
  },
  {
    id: 'matrix',
    name: 'Matrix',
    desc: 'Verde fosfo sobre negro, hackea el perfil',
    primary: '#00ff41',
    secondary: '#003b00',
    bg: '#000000',
    text: '#00ff41',
    badgeStyle: 'flat-square',
    bannerGradient: '0:000000,50:001a00,100:003b00',
    statsTheme: 'green',
    trophyTheme: 'matrix',
    separator: '```',
    accent: '#001a00',
    previewBg: '#000000',
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    desc: 'Azul profundo con turquesa',
    primary: '#00b4d8',
    secondary: '#03045e',
    bg: '#001233',
    text: '#e0e0e0',
    badgeStyle: 'for-the-badge',
    bannerGradient: '0:001233,50:002855,100:0077b6',
    statsTheme: 'github_dark',
    trophyTheme: 'onestar',
    separator: '---',
    accent: '#002855',
    previewBg: '#001233',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Limpio, blanco, profesional',
    primary: '#0366d6',
    secondary: '#6a737d',
    bg: '#ffffff',
    text: '#24292e',
    badgeStyle: 'flat',
    bannerGradient: '0:f6f8fa,50:e1e4e8,90:d1d5da',
    statsTheme: 'default',
    trophyTheme: 'flat',
    separator: '---',
    accent: '#f6f8fa',
    previewBg: '#ffffff',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    desc: 'Tonos calidos naranja y rojo',
    primary: '#ff6b35',
    secondary: '#f7c59f',
    bg: '#1a0a00',
    text: '#f5e6d3',
    badgeStyle: 'for-the-badge',
    bannerGradient: '0:1a0a00,50:4a1500,100:8b2500',
    statsTheme: 'monokai',
    trophyTheme: 'dracula',
    separator: '---',
    accent: '#4a1500',
    previewBg: '#1a0a00',
  },
]
