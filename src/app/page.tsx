'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type SectionType = 'header' | 'about' | 'techstack' | 'social' | 'footer'

interface Section {
  id: string
  type: SectionType
}

interface SectionData {
  [key: string]: Record<string, string | string[]>
}

const SECTION_LABELS: Record<SectionType, string> = {
  header: 'Header',
  about: 'About Me',
  techstack: 'Tech Stack',
  social: 'Redes Sociales',
  footer: 'Footer',
}

const SECTION_ICONS: Record<SectionType, string> = {
  header: '\u{1F3E0}',
  about: '\u{1F464}',
  techstack: '\u{1F6E0}️',
  social: '\u{1F517}',
  footer: '\u{1F4C4}',
}

const TECH_CATEGORIES = [
  { label: 'Frontend', techs: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Angular', 'TailwindCSS'] },
  { label: 'Backend', techs: ['Node.js', 'Express', 'NestJS', 'Python', 'Java', 'Spring Boot'] },
  { label: 'Bases de Datos', techs: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Prisma'] },
  { label: 'Tools & DevOps', techs: ['Docker', 'Git', 'GitHub Actions', 'Linux', 'NPM'] },
]

const TECH_COLORS: Record<string, string> = {
  'HTML5': 'E34F26', 'CSS3': '1572B6', 'JavaScript': 'F7DF1E', 'TypeScript': '3178C6',
  'React': '61DAFB', 'Next.js': '000000', 'Angular': 'DD0031', 'TailwindCSS': '38B2AC',
  'Node.js': '339933', 'Express': '000000', 'NestJS': 'E0234E',
  'Python': '3776AB', 'Java': 'ED8B00', 'Spring Boot': '6DB33F',
  'MongoDB': '47A248', 'PostgreSQL': '316192', 'MySQL': '4479A1', 'SQLite': '003B57', 'Prisma': '2D3748',
  'Docker': '2496ED', 'Git': 'F05032', 'GitHub Actions': '2088FF', 'Linux': 'FCC624', 'NPM': 'CB3837',
}

function SortableSection({
  section,
  data,
  onUpdateData,
  onRemove,
}: {
  section: Section
  data: Record<string, string | string[]>
  onUpdateData: (id: string, field: string, value: string | string[]) => void
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function editor() {
    switch (section.type) {
      case 'header':
        return (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Nombre</label>
              <input type="text" value={(data.name as string) || ''} onChange={(e) => onUpdateData(section.id, 'name', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="Manuel Contreras" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Subtitulo</label>
              <input type="text" value={(data.subtitle as string) || ''} onChange={(e) => onUpdateData(section.id, 'subtitle', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="Full Stack Developer" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Color (hex)</label>
              <input type="text" value={(data.color as string) || '#00e5ff'} onChange={(e) => onUpdateData(section.id, 'color', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" />
            </div>
          </div>
        )
      case 'about':
        return (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Descripcion</label>
              <textarea value={(data.description as string) || ''} onChange={(e) => onUpdateData(section.id, 'description', e.target.value)} rows={3} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500 resize-none" placeholder="Cuentate sobre ti..." />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">URL del GIF</label>
              <input type="text" value={(data.gif as string) || ''} onChange={(e) => onUpdateData(section.id, 'gif', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="https://media.giphy.com/media/..." />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Puntos clave (uno por linea)</label>
              <textarea value={(data.bullets as string) || ''} onChange={(e) => onUpdateData(section.id, 'bullets', e.target.value)} rows={4} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500 resize-none" placeholder={'Aprendiendo Nest.js\nGestion de equipos\nHobbies: videojuegos'} />
            </div>
          </div>
        )
      case 'techstack': {
        const selected = (data.selected as string[]) || []
        function toggleTech(tech: string) {
          const next = selected.includes(tech) ? selected.filter((t) => t !== tech) : [...selected, tech]
          onUpdateData(section.id, 'selected', next)
        }
        return (
          <div className="space-y-4">
            {TECH_CATEGORIES.map((cat) => (
              <div key={cat.label}>
                <p className="mb-2 text-xs font-medium text-zinc-500">{cat.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.techs.map((tech) => {
                    const active = selected.includes(tech)
                    return (
                      <button key={tech} onClick={() => toggleTech(tech)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${active ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300'}`}
                      >
                        {tech}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            {selected.length === 0 && <p className="text-xs text-zinc-600">Selecciona las tecnologias que sabes</p>}
          </div>
        )
      }
      case 'social':
        return (
          <div className="space-y-3">
            {[{key:'github',label:'GitHub'},{key:'discord',label:'Discord'},{key:'instagram',label:'Instagram'},{key:'email',label:'Email'},{key:'website',label:'Website'}].map(({key,label}) => (
              <div key={key}>
                <label className="mb-1 block text-xs text-zinc-500">{label}</label>
                <input type="text" value={(data[key] as string) || ''} onChange={(e) => onUpdateData(section.id, key, e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" />
              </div>
            ))}
          </div>
        )
      case 'footer':
        return (
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Texto del footer</label>
            <input type="text" value={(data.text as string) || ''} onChange={(e) => onUpdateData(section.id, 'text', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="Hecho con " />
          </div>
        )
    }
  }

  return (
    <div ref={setNodeRef} style={style} className={`rounded-xl border bg-zinc-900 transition-all ${isDragging ? 'z-50 border-cyan-500/50 shadow-xl shadow-cyan-500/10 opacity-90' : 'border-zinc-800'}`}>
      <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          </svg>
        </button>
        <span className="text-lg">{SECTION_ICONS[section.type]}</span>
        <span className="flex-1 text-sm font-medium text-zinc-300">{SECTION_LABELS[section.type]}</span>
        <button onClick={() => onRemove(section.id)} className="text-zinc-600 hover:text-red-400 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="p-4">{editor()}</div>
    </div>
  )
}

function generateMarkdown(sections: Section[], sectionsData: SectionData): string {
  let md = ''

  for (const section of sections) {
    const d = sectionsData[section.id] || {}

    switch (section.type) {
      case 'header': {
        const name = (d.name as string) || 'Tu Nombre'
        const subtitle = (d.subtitle as string) || ''
        const color = ((d.color as string) || '#00e5ff').replace('#', '')
        md += `<div align="center">\n`
        md += `  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a1b41,100:0d7377&height=250&section=header&text=${encodeURIComponent(name)}&fontSize=70&fontAlignY=35&fontColor=${color}&animation=fadeIn${subtitle ? `&desc=${encodeURIComponent(subtitle)}&descAlignY=55&descAlign=50&descSize=20` : ''}" width="100%" />\n`
        md += `</div>\n\n`
        break
      }
      case 'about': {
        const desc = (d.description as string) || ''
        const gif = (d.gif as string) || ''
        const bullets = (d.bullets as string) || ''
        md += `<table align="center">\n  <tr>\n    <td width="55%" valign="top">\n`
        md += `      <h2>About Me</h2>\n`
        md += `      <p>${desc}</p>\n`
        if (bullets) {
          md += `      <ul>\n`
          bullets.split('\n').filter(Boolean).forEach((b) => { md += `        <li>${b.trim()}</li>\n` })
          md += `      </ul>\n`
        }
        md += `    </td>\n`
        if (gif) {
          md += `    <td width="45%" align="center">\n`
          md += `      <img src="${gif}" width="100%" />\n`
          md += `    </td>\n`
        }
        md += `  </tr>\n</table>\n\n`
        break
      }
      case 'techstack': {
        const selected = (d.selected as string[]) || []
        if (selected.length > 0) {
          md += `<h2 align="center">Tech Stack</h2>\n\n`
          for (const cat of TECH_CATEGORIES) {
            const techs = cat.techs.filter((t) => selected.includes(t))
            if (techs.length === 0) continue
            md += `<div align="center">\n  <h3>${cat.label}</h3>\n`
            for (const tech of techs) {
              const c = TECH_COLORS[tech] || 'FFFFFF'
              const lc = tech === 'JavaScript' ? 'black' : 'white'
              md += `  <img src="https://img.shields.io/badge/${tech}-${c}?style=for-the-badge&logo=${tech.toLowerCase()}&logoColor=${lc}" />\n`
            }
            md += `</div>\n\n`
          }
        }
        break
      }
      case 'social': {
        const gh = d.github as string
        const dc = d.discord as string
        const ig = d.instagram as string
        const em = d.email as string
        const wb = d.website as string
        if (gh || dc || ig || em || wb) {
          md += `<h2 align="center">Connect With Me</h2>\n\n<div align="center">\n`
          if (gh) md += `  <a href="https://github.com/${gh}"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a>\n`
          if (dc) md += `  <a href="https://discord.com/users/${dc}"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" /></a>\n`
          if (ig) md += `  <a href="https://www.instagram.com/${ig}"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" /></a>\n`
          if (em) md += `  <a href="mailto:${em}"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>\n`
          if (wb) md += `  <a href="${wb}"><img src="https://img.shields.io/badge/Website-00e5ff?style=for-the-badge&logo=google-chrome&logoColor=black" /></a>\n`
          md += `</div>\n\n`
        }
        break
      }
      case 'footer': {
        const text = (d.text as string) || ''
        md += `<div align="center">\n  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d7377,50:1a1b41,100:0d1117&height=150&section=footer&animation=fadeIn" width="100%" />\n</div>\n`
        if (text) md += `\n<p align="center">\n  ${text}\n</p>\n`
        break
      }
    }
  }

  return md
}

function genId() {
  return Math.random().toString(36).substring(2, 10)
}

export default function Home() {
  const [sections, setSections] = useState<Section[]>(['header','about','techstack','social','footer'].map((t) => ({ id: genId(), type: t as SectionType })))
  const [sectionsData, setSectionsData] = useState<SectionData>({})
  const [copied, setCopied] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id)
      const newIndex = prev.findIndex((s) => s.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      const next = [...prev]; const [moved] = next.splice(oldIndex, 1); next.splice(newIndex, 0, moved)
      return next
    })
  }

  function addSection(type: SectionType) {
    const id = genId()
    setSections((prev) => [...prev, { id, type }])
    setSectionsData((prev) => ({ ...prev, [id]: {} }))
  }

  function removeSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id))
    setSectionsData((prev) => { const n = { ...prev }; delete n[id]; return n })
  }

  function updateSectionData(id: string, field: string, value: string | string[]) {
    setSectionsData((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }))
  }

  const markdown = generateMarkdown(sections, sectionsData)

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea'); el.value = markdown
      document.body.appendChild(el); el.select(); document.execCommand('copy')
      document.body.removeChild(el); setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }

  const availableTypes = (['header','about','techstack','social','footer'] as SectionType[]).filter((t) => !sections.some((s) => s.type === t))

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Profile README Builder</span>
            </h1>
            <p className="text-sm text-zinc-600">Arma tu perfil de GitHub visualmente</p>
          </div>
          <div className="flex gap-2">
            {availableTypes.length > 0 && (
              <div className="relative group">
                <button className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700">+ Agregar seccion</button>
                <div className="absolute right-0 top-full z-50 mt-1 hidden w-48 rounded-xl border border-zinc-700 bg-zinc-800 p-1 shadow-xl group-hover:block">
                  {availableTypes.map((t) => (
                    <button key={t} onClick={() => addSection(t)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-700">
                      <span>{SECTION_ICONS[t]}</span> {SECTION_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button onClick={copyMarkdown} className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90">
              {copied ? 'Copiado' : 'Copiar Markdown'}
            </button>
          </div>
        </header>

        <div className="flex flex-1 gap-6">
          <div className="flex-1 space-y-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                {sections.map((s) => (
                  <SortableSection key={s.id} section={s} data={sectionsData[s.id] || {}} onUpdateData={updateSectionData} onRemove={removeSection} />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          <div className="w-[500px] shrink-0">
            <div className="sticky top-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <div className="border-b border-zinc-800 px-4 py-3">
                <h2 className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Markdown generado
                </h2>
              </div>
              <pre className="max-h-[calc(100vh-200px)] overflow-auto p-4 text-xs leading-relaxed text-zinc-400 font-mono">
                <code>{markdown || 'Agrega secciones para ver el markdown'}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
