export type SectionType =
  | 'header'
  | 'about'
  | 'techstack'
  | 'stats'
  | 'projects'
  | 'social'
  | 'counter'
  | 'snake'
  | 'quote'
  | 'graph'
  | 'footer'

export interface Section {
  id: string
  type: SectionType
  data: Record<string, unknown>
}

export interface Template {
  id: string
  name: string
  desc: string
  sections: Section[]
}

export interface BadgeStyle {
  label: string
  value: string
}

export const SECTION_LABELS: Record<SectionType, string> = {
  header: 'Header',
  about: 'About Me',
  techstack: 'Tech Stack',
  stats: 'GitHub Stats',
  projects: 'Proyectos',
  social: 'Redes Sociales',
  counter: 'Contador de Visitas',
  snake: 'Snake Animation',
  quote: 'Frase Aleatoria',
  graph: 'Contribution Graph',
  footer: 'Footer',
}

export const SECTION_ICONS: Record<SectionType, string> = {
  header: '\u{1F3E0}',
  about: '\u{1F464}',
  techstack: '\u{1F6E0}️',
  stats: '\u{1F4CA}',
  projects: '\u{1F4BB}',
  social: '\u{1F517}',
  counter: '\u{1F441}️',
  snake: '\u{1F40D}',
  quote: '\u{1F4AC}',
  graph: '\u{1F4C8}',
  footer: '\u{1F4C4}',
}

export function genId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export function newSection(type: SectionType): Section {
  const defaults: Record<string, unknown> = {}
  switch (type) {
    case 'header':
      defaults.name = ''; defaults.subtitle = ''; defaults.color = '#00e5ff'
      break
    case 'about':
      defaults.description = ''; defaults.gif = ''; defaults.bullets = ''
      break
    case 'techstack':
      defaults.selected = []
      break
    case 'stats':
      defaults.showStats = true; defaults.showStreak = true; defaults.showTopLangs = true; defaults.showTrophies = true; defaults.theme = 'dark'
      break
    case 'projects':
      defaults.projects = []
      break
    case 'social':
      defaults.github = ''; defaults.discord = ''; defaults.instagram = ''; defaults.email = ''; defaults.website = ''
      break
    case 'counter':
      defaults.enabled = true; defaults.label = 'Visitors'
      break
    case 'snake':
      defaults.enabled = true
      break
    case 'quote':
      defaults.enabled = true; defaults.theme = 'dark'
      break
    case 'graph':
      defaults.enabled = true; defaults.color = '#00e5ff'
      break
    case 'footer':
      defaults.text = ''
      break
  }
  return { id: genId(), type, data: defaults }
}
