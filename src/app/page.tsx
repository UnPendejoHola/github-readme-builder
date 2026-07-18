'use client'

import { useState, useRef } from 'react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { Section, SectionType, SECTION_LABELS, SECTION_ICONS, newSection } from '@/lib/types'
import { generateMarkdown } from '@/lib/markdown'
import { THEMES, Theme } from '@/lib/themes'
import {
  HeaderEditor, AboutEditor, TechStackEditor, StatsEditor, ProjectsEditor,
  SocialEditor, CounterEditor, SnakeEditor, QuoteEditor, GraphEditor, FooterEditor,
} from '@/components/sections'

function SectionEditor({ section, onData }: { section: Section; onData: (k: string, v: unknown) => void }) {
  switch (section.type) {
    case 'header': return <HeaderEditor data={section.data} onChange={onData} />
    case 'about': return <AboutEditor data={section.data} onChange={onData} />
    case 'techstack': return <TechStackEditor data={section.data} onChange={onData} />
    case 'stats': return <StatsEditor data={section.data} onChange={onData} />
    case 'projects': return <ProjectsEditor data={section.data} onChange={onData} />
    case 'social': return <SocialEditor data={section.data} onChange={onData} />
    case 'counter': return <CounterEditor data={section.data} onChange={onData} />
    case 'snake': return <SnakeEditor data={section.data} onChange={onData} />
    case 'quote': return <QuoteEditor data={section.data} onChange={onData} />
    case 'graph': return <GraphEditor data={section.data} onChange={onData} />
    case 'footer': return <FooterEditor data={section.data} onChange={onData} />
    default: return null
  }
}

function SortableSection({ section, onData, onRemove, isSelected, onSelect }: {
  section: Section; onData: (id: string, k: string, v: unknown) => void; onRemove: (id: string) => void
  isSelected: boolean; onSelect: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} onClick={() => onSelect(section.id)}
      className={`rounded-lg border transition-all cursor-pointer ${isDragging ? 'z-50 border-cyan-500/50 opacity-90' : isSelected ? 'border-cyan-500/60 bg-zinc-800/60' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40'}`}>
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          </svg>
        </button>
        <span>{SECTION_ICONS[section.type]}</span>
        <span className="flex-1 text-sm text-zinc-300">{SECTION_LABELS[section.type]}</span>
        <button onClick={(e) => { e.stopPropagation(); onRemove(section.id) }}
          className="text-zinc-600 hover:text-red-400 transition-colors">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {isSelected && (
        <div className="border-t border-zinc-700/50 px-3.5 py-3.5">
          <SectionEditor section={section} onData={(k, v) => onData(section.id, k, v)} />
        </div>
      )}
    </div>
  )
}

const ALL_TYPES: SectionType[] = ['header','about','techstack','stats','projects','social','counter','snake','quote','graph','footer']

export default function Home() {
  const [username, setUsername] = useState('UnPendejoHola')
  const [sections, setSections] = useState<Section[]>(() =>
    (['header','about','techstack','social'] as SectionType[]).map((t) => newSection(t))
  )
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>(THEMES[0])
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    setSections((prev) => {
      const oi = prev.findIndex((s) => s.id === active.id)
      const ni = prev.findIndex((s) => s.id === over.id)
      if (oi === -1 || ni === -1) return prev
      const next = [...prev]; const [m] = next.splice(oi, 1); next.splice(ni, 0, m)
      return next
    })
  }

  function addSection(type: SectionType) {
    const s = newSection(type)
    setSections((prev) => [...prev, s])
    setSelectedSection(s.id)
  }

  function removeSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id))
    if (selectedSection === id) setSelectedSection(null)
  }

  function updateData(id: string, key: string, val: unknown) {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, data: { ...s.data, [key]: val } } : s))
  }

  const markdown = generateMarkdown(sections, username, theme)
  const available = ALL_TYPES.filter((t) => !sections.some((s) => s.type === t))

  async function copyMd() {
    try {
      await navigator.clipboard.writeText(markdown); setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea'); el.value = markdown
      document.body.appendChild(el); el.select(); document.execCommand('copy')
      document.body.removeChild(el); setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }

  function downloadMd() {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = url; a.download = 'README.md'; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <aside className="w-72 border-r border-zinc-800 flex flex-col bg-zinc-900/30">
        <div className="p-4 border-b border-zinc-800">
          <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">Profile Builder</h1>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
            <span className="text-xs text-zinc-500">@</span>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="flex-1 bg-transparent text-sm text-zinc-200 outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {sections.map((s) => (
                <SortableSection key={s.id} section={s} onData={updateData} onRemove={removeSection}
                  isSelected={selectedSection === s.id} onSelect={setSelectedSection} />
              ))}
            </SortableContext>
          </DndContext>

          {sections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-zinc-600">No hay secciones</p>
              <p className="text-xs text-zinc-700 mt-1">Agrega una abajo</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-800">
          {available.length > 0 && (
            <div className="relative group">
              <button className="w-full rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 px-4 py-2.5 text-sm text-cyan-300 transition-all hover:from-cyan-500/30 hover:to-blue-600/30">
                + Agregar seccion
              </button>
              <div className="absolute bottom-full left-0 right-0 z-50 mb-2 hidden rounded-xl border border-zinc-700 bg-zinc-800 p-1.5 shadow-2xl shadow-black/50 group-hover:block">
                {available.map((t) => (
                  <button key={t} onClick={() => addSection(t)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-700">
                    <span>{SECTION_ICONS[t]}</span> {SECTION_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="flex items-center justify-end gap-3 px-5 py-3 border-b border-zinc-800 bg-zinc-900/30">
          <div className="flex gap-1 rounded-lg border border-zinc-700 p-0.5">
            {THEMES.slice(0, 3).map((t) => (
              <button key={t.id} onClick={() => setTheme(t)}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${theme.id === t.id ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}>{t.name}</button>
            ))}
            {THEMES.length > 3 && (
              <div className="relative group">
                <button className="px-4 py-1.5 rounded-md text-xs text-zinc-500 hover:text-zinc-300">+{THEMES.length - 3}</button>
                <div className="absolute right-0 top-full z-50 mt-1 hidden w-44 rounded-xl border border-zinc-700 bg-zinc-800 p-1.5 shadow-xl group-hover:block">
                  {THEMES.slice(3).map((t) => (
                    <button key={t.id} onClick={() => setTheme(t)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs text-zinc-300 hover:bg-zinc-700">
                      <span className="flex h-4 w-4 rounded-full border border-zinc-600" style={{ backgroundColor: t.primary }} />
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowCode(!showCode)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${showCode ? 'bg-zinc-700 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'}`}>
              {showCode ? 'Preview' : 'Codigo'}
            </button>
            <button onClick={copyMd}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white transition-all hover:opacity-90">
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
            <button onClick={downloadMd}
              className="px-3 py-1.5 rounded-lg text-xs text-zinc-500 border border-zinc-700 hover:text-zinc-300">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={previewRef} className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: theme.previewBg }}>
          <div className="mx-auto max-w-4xl">
            {showCode ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                <div className="border-b border-zinc-800 px-5 py-3">
                  <h3 className="text-xs text-zinc-500 font-mono">README.md</h3>
                </div>
                <pre className="p-5 text-xs leading-relaxed text-zinc-400 font-mono overflow-x-auto whitespace-pre-wrap">
                  {markdown || 'Agrega secciones para generar el codigo'}
                </pre>
              </div>
            ) : (
              <div className="min-h-[600px] rounded-xl border border-zinc-800/50 bg-zinc-950/80 p-8">
                <div className="prose prose-invert prose-sm max-w-none [&_img]:inline-block [&_img]:m-1">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                    {markdown || 'Agrega secciones para empezar'}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
