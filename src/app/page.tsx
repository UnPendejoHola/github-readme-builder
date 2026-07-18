'use client'

import { useState } from 'react'
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
import {
  HeaderEditor, AboutEditor, TechStackEditor, StatsEditor, ProjectsEditor,
  SocialEditor, CounterEditor, SnakeEditor, QuoteEditor, GraphEditor, FooterEditor,
} from '@/components/sections'

function SectionEditor({ section, onData }: {
  section: Section
  onData: (key: string, val: unknown) => void
}) {
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

function SortableSection({ section, onData, onRemove }: {
  section: Section
  onData: (id: string, key: string, val: unknown) => void
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style}
      className={`rounded-xl border bg-zinc-900/80 backdrop-blur-sm transition-all ${isDragging ? 'z-50 border-cyan-500/50 shadow-xl shadow-cyan-500/20 scale-[1.02]' : 'border-zinc-800 hover:border-zinc-700'}`}>
      <div className="flex items-center gap-3 border-b border-zinc-800/50 px-4 py-3">
        <button {...attributes} {...listeners}
          className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          </svg>
        </button>
        <span className="text-lg">{SECTION_ICONS[section.type]}</span>
        <span className="flex-1 text-sm font-medium text-zinc-300">{SECTION_LABELS[section.type]}</span>
        <button onClick={() => onRemove(section.id)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <SectionEditor section={section} onData={(key, val) => onData(section.id, key, val)} />
      </div>
    </div>
  )
}

const ALL_TYPES: SectionType[] = ['header','about','techstack','stats','projects','social','counter','snake','quote','graph','footer']

export default function Home() {
  const [username, setUsername] = useState('UnPendejoHola')
  const [sections, setSections] = useState<Section[]>(() =>
    (['header','about','techstack','social'] as SectionType[]).map((t) => newSection(t))
  )
  const [copied, setCopied] = useState(false)
  const [showRaw, setShowRaw] = useState(false)

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
    setSections((prev) => [...prev, newSection(type)])
  }

  function removeSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id))
  }

  function updateData(id: string, key: string, val: unknown) {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, data: { ...s.data, [key]: val } } : s))
  }

  const markdown = generateMarkdown(sections, username)

  async function copyMd() {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea'); el.value = markdown
      document.body.appendChild(el); el.select(); document.execCommand('copy')
      document.body.removeChild(el); setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }

  function downloadMd() {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'README.md'
    a.click(); URL.revokeObjectURL(url)
  }

  const available = ALL_TYPES.filter((t) => !sections.some((s) => s.type === t))

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                GitHub Profile Builder
              </span>
            </h1>
            <p className="text-sm text-zinc-600 mt-1">Arma tu perfil de GitHub sin escribir codigo</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2">
              <label className="mr-2 text-xs text-zinc-500">Usuario:</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-36 bg-transparent text-sm text-zinc-200 outline-none" />
            </div>
            {available.length > 0 && (
              <div className="relative group">
                <button className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition-all hover:bg-zinc-700 hover:border-zinc-600">
                  + Agregar
                </button>
                <div className="absolute right-0 top-full z-50 mt-1.5 hidden w-56 rounded-xl border border-zinc-700 bg-zinc-800 p-1.5 shadow-2xl shadow-black/50 group-hover:block">
                  {available.map((t) => (
                    <button key={t} onClick={() => addSection(t)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-700">
                      <span className="text-base">{SECTION_ICONS[t]}</span>
                      {SECTION_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setShowRaw(!showRaw)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${showRaw ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}>
              {showRaw ? 'Preview' : 'Codigo'}
            </button>
            <button onClick={copyMd}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 shadow-lg shadow-cyan-500/20">
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
            <button onClick={downloadMd} title="Descargar README.md"
              className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 transition-all hover:bg-zinc-800">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </header>

        <div className="flex flex-1 gap-6">
          <div className="flex-1 space-y-3 min-w-0">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                {sections.map((s) => (
                  <SortableSection key={s.id} section={s} onData={updateData} onRemove={removeSection} />
                ))}
              </SortableContext>
            </DndContext>
            {sections.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 py-24">
                <p className="text-lg text-zinc-600">No hay secciones</p>
                <p className="mt-1 text-sm text-zinc-700">Agrega secciones desde el boton + Agregar</p>
              </div>
            )}
          </div>

          <div className="w-[480px] shrink-0 hidden xl:block">
            <div className="sticky top-6 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
              <div className="border-b border-zinc-800/50 px-5 py-3.5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {showRaw ? 'Codigo Markdown' : 'Vista previa'}
                  </h2>
                  <span className="text-xs text-zinc-600">{sections.length} secciones</span>
                </div>
              </div>
              {showRaw ? (
                <pre className="max-h-[calc(100vh-220px)] overflow-auto p-5 text-xs leading-relaxed text-zinc-400 font-mono">
                  <code>{markdown || 'Agrega secciones para generar el markdown'}</code>
                </pre>
              ) : (
                <div className="max-h-[calc(100vh-220px)] overflow-auto p-5">
                  <div className="rounded-lg bg-zinc-950 p-6">
                    {markdown ? (
                      <div className="prose prose-invert prose-sm max-w-none [&_img]:inline-block [&_img]:m-1 [&_table]:w-full [&_td]:p-1">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                          {markdown}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-12 text-zinc-600">
                        Agrega secciones para empezar
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
