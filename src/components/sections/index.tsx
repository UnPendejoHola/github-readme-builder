'use client'

export function HeaderEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div><label className="mb-1.5 block text-xs text-zinc-500">Nombre</label>
        <input type="text" value={(data.name as string) || ''} onChange={(e) => onChange('name', e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="Manuel Contreras" /></div>
      <div><label className="mb-1.5 block text-xs text-zinc-500">Subtitulo</label>
        <input type="text" value={(data.subtitle as string) || ''} onChange={(e) => onChange('subtitle', e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="Full Stack Developer" /></div>
    </div>
  )
}

export function AboutEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div><label className="mb-1.5 block text-xs text-zinc-500">Descripcion</label>
        <textarea value={(data.description as string) || ''} onChange={(e) => onChange('description', e.target.value)} rows={3}
          className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="Cuentate sobre ti..." /></div>
      <div><label className="mb-1.5 block text-xs text-zinc-500">URL del GIF</label>
        <input type="text" value={(data.gif as string) || ''} onChange={(e) => onChange('gif', e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="https://media.giphy.com/media/..." /></div>
      <div><label className="mb-1.5 block text-xs text-zinc-500">Puntos clave (uno por linea)</label>
        <textarea value={(data.bullets as string) || ''} onChange={(e) => onChange('bullets', e.target.value)} rows={4}
          className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="Aprendiendo Nest.js&#10;Gestion de equipos" /></div>
    </div>
  )
}

const CATEGORIES = [
  { label: 'Frontend', techs: ['HTML5','CSS3','JavaScript','TypeScript','React','Next.js','Angular','Vue','TailwindCSS','Bootstrap'] },
  { label: 'Backend', techs: ['Node.js','Express','NestJS','Python','Java','Spring Boot','Go'] },
  { label: 'Bases de Datos', techs: ['MongoDB','PostgreSQL','MySQL','SQLite','Prisma','Redis'] },
  { label: 'DevOps', techs: ['Docker','Git','GitHub_Actions','AWS','Firebase','Linux','NPM','VSCode'] },
]

export function TechStackEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const sel = (data.selected as string[]) || []
  function toggle(t: string) { onChange('selected', sel.includes(t) ? sel.filter((x) => x !== t) : [...sel, t]) }
  return (
    <div className="space-y-4">
      {CATEGORIES.map((cat) => (
        <div key={cat.label}>
          <p className="mb-2 text-xs text-zinc-500">{cat.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {cat.techs.map((t) => {
              const active = sel.includes(t)
              return <button key={t} onClick={() => toggle(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${active ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40' : 'bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300'}`}>{t === 'GitHub_Actions' ? 'GitHub Actions' : t}</button>
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export function StatsEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const toggles = [
    { key: 'showStats', label: 'Stats generales' },
    { key: 'showTopLangs', label: 'Top lenguajes' },
    { key: 'showStreak', label: 'Racha (streak)' },
    { key: 'showTrophies', label: 'Trofeos' },
  ]
  return (
    <div className="space-y-3">
      {toggles.map((t) => (
        <label key={t.key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/30 px-3.5 py-2.5">
          <input type="checkbox" checked={!!(data[t.key] ?? true)} onChange={(e) => onChange(t.key, e.target.checked)}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-cyan-500" />
          <span className="text-sm text-zinc-300">{t.label}</span>
        </label>
      ))}
    </div>
  )
}

export function ProjectsEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const projects = (data.projects as { name: string; desc: string; url: string; techs: string[] }[]) || []
  function upd(i: number, f: string, v: string | string[]) { const n = [...projects]; n[i] = { ...n[i], [f]: v }; onChange('projects', n) }
  return (
    <div className="space-y-3">
      {projects.map((p, i) => (
        <div key={i} className="rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-3.5">
          <div className="space-y-2.5">
            <input type="text" value={p.name} onChange={(e) => upd(i, 'name', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="Nombre" />
            <input type="text" value={p.desc} onChange={(e) => upd(i, 'desc', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="Descripcion" />
            <input type="text" value={p.url} onChange={(e) => upd(i, 'url', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="https://github.com/user/repo" />
            <input type="text" value={p.techs.join(', ')} onChange={(e) => upd(i, 'techs', e.target.value.split(',').map((t: string) => t.trim()))} className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="React, Node.js, MongoDB" />
          </div>
        </div>
      ))}
      <button onClick={() => onChange('projects', [...projects, { name: '', desc: '', url: '', techs: [] }])}
        className="flex w-full items-center justify-center rounded-lg border border-dashed border-zinc-700 py-2.5 text-sm text-zinc-500 hover:border-zinc-600 hover:text-zinc-400">+ Agregar</button>
    </div>
  )
}

export function SocialEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const fields = [
    { key: 'github', label: 'GitHub' }, { key: 'discord', label: 'Discord' },
    { key: 'instagram', label: 'Instagram' }, { key: 'youtube', label: 'YouTube' },
    { key: 'twitter', label: 'Twitter / X' }, { key: 'linkedin', label: 'LinkedIn' },
    { key: 'email', label: 'Email' }, { key: 'website', label: 'Website' },
  ]
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-xs text-zinc-500">{f.label}</label>
            <input type="text" value={(data[f.key] as string) || ''} onChange={(e) => onChange(f.key, e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CounterEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/30 px-3.5 py-2.5">
        <input type="checkbox" checked={!!(data.enabled ?? true)} onChange={(e) => onChange('enabled', e.target.checked)} className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-cyan-500" />
        <span className="text-sm text-zinc-300">Mostrar contador</span>
      </label>
      <div><label className="mb-1 block text-xs text-zinc-500">Texto</label>
        <input type="text" value={(data.label as string) || 'Visitors'} onChange={(e) => onChange('label', e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" /></div>
    </div>
  )
}

export function SnakeEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/30 px-3.5 py-2.5">
      <input type="checkbox" checked={!!(data.enabled ?? true)} onChange={(e) => onChange('enabled', e.target.checked)} className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-cyan-500" />
      <span className="text-sm text-zinc-300">Mostrar snake animation</span>
    </label>
  )
}

export function QuoteEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/30 px-3.5 py-2.5">
      <input type="checkbox" checked={!!(data.enabled ?? true)} onChange={(e) => onChange('enabled', e.target.checked)} className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-cyan-500" />
      <span className="text-sm text-zinc-300">Mostrar frase aleatoria</span>
    </label>
  )
}

export function GraphEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/30 px-3.5 py-2.5">
      <input type="checkbox" checked={!!(data.enabled ?? true)} onChange={(e) => onChange('enabled', e.target.checked)} className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-cyan-500" />
      <span className="text-sm text-zinc-300">Mostrar grafico de contribuciones</span>
    </label>
  )
}

export function FooterEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  return (
    <div><label className="mb-1 block text-xs text-zinc-500">Texto</label>
      <input type="text" value={(data.text as string) || ''} onChange={(e) => onChange('text', e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="Hecho por Manuel" /></div>
  )
}
