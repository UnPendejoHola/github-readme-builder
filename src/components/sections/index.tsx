'use client'

export function HeaderEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, val: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-500">Nombre</label>
        <input type="text" value={(data.name as string) || ''} onChange={(e) => onChange('name', e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-cyan-500 focus:bg-zinc-800" placeholder="Manuel Contreras" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-500">Subtitulo</label>
        <input type="text" value={(data.subtitle as string) || ''} onChange={(e) => onChange('subtitle', e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-cyan-500 focus:bg-zinc-800" placeholder="Full Stack Developer | Minecraft Manager" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-500">Color del header</label>
        <div className="flex gap-3">
          <input type="text" value={(data.color as string) || '#00e5ff'} onChange={(e) => onChange('color', e.target.value)}
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-cyan-500 focus:bg-zinc-800" placeholder="#00e5ff" />
          <input type="color" value={(data.color as string) || '#00e5ff'} onChange={(e) => onChange('color', e.target.value)}
            className="h-[42px] w-[42px] cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800" />
        </div>
      </div>
    </div>
  )
}

export function AboutEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, val: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-500">Descripcion</label>
        <textarea value={(data.description as string) || ''} onChange={(e) => onChange('description', e.target.value)} rows={3}
          className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-cyan-500 focus:bg-zinc-800" placeholder="Cuentate sobre ti..." />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-500">URL del GIF animado</label>
        <input type="text" value={(data.gif as string) || ''} onChange={(e) => onChange('gif', e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-cyan-500 focus:bg-zinc-800" placeholder="https://media.giphy.com/media/..." />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-500">Puntos clave (uno por linea)</label>
        <textarea value={(data.bullets as string) || ''} onChange={(e) => onChange('bullets', e.target.value)} rows={4}
          className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-cyan-500 focus:bg-zinc-800" placeholder={'Aprendiendo Nest.js y Angular\nGestion de equipos\nHobbies: videojuegos'} />
      </div>
    </div>
  )
}

const CATEGORIES = [
  { label: 'Frontend', techs: ['HTML5','CSS3','JavaScript','TypeScript','React','Next.js','Angular','Vue','TailwindCSS','Bootstrap','Sass'] },
  { label: 'Backend', techs: ['Node.js','Express','NestJS','Python','Java','Spring Boot','Go'] },
  { label: 'Bases de Datos', techs: ['MongoDB','PostgreSQL','MySQL','SQLite','Prisma','Redis'] },
  { label: 'DevOps & Cloud', techs: ['Docker','Git','GitHub_Actions','AWS','Firebase','Linux','NPM','VSCode'] },
]

export function TechStackEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, val: unknown) => void }) {
  const selected = (data.selected as string[]) || []
  function toggle(t: string) {
    onChange('selected', selected.includes(t) ? selected.filter((x) => x !== t) : [...selected, t])
  }
  return (
    <div className="space-y-5">
      {CATEGORIES.map((cat) => (
        <div key={cat.label}>
          <p className="mb-2.5 text-xs font-medium text-zinc-500">{cat.label}</p>
          <div className="flex flex-wrap gap-2">
            {cat.techs.map((t) => {
              const active = selected.includes(t)
              return (
                <button key={t} onClick={() => toggle(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    active ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40 shadow-sm shadow-cyan-500/10' : 'bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300'
                  }`}>
                  {t === 'GitHub_Actions' ? 'GitHub Actions' : t}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <p className="text-xs text-zinc-600 italic">
        {selected.length === 0 ? 'Selecciona las tecnologias que sabes' : `${selected.length} tecnologias seleccionadas`}
      </p>
    </div>
  )
}

export function StatsEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, val: unknown) => void }) {
  const toggles = [
    { key: 'showStats', label: 'Estadisticas generales' },
    { key: 'showTopLangs', label: 'Lenguajes mas usados' },
    { key: 'showStreak', label: 'Racha (streak)' },
    { key: 'showTrophies', label: 'Trofeos' },
  ]
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2.5 text-xs font-medium text-zinc-500">Mostrar</p>
        <div className="space-y-2">
          {toggles.map((t) => (
            <label key={t.key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/30 px-3.5 py-2.5 transition-colors hover:bg-zinc-800/60">
              <input type="checkbox" checked={!!(data[t.key] ?? true)} onChange={(e) => onChange(t.key, e.target.checked)}
                className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-cyan-500 focus:ring-cyan-500/30" />
              <span className="text-sm text-zinc-300">{t.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProjectsEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, val: unknown) => void }) {
  const projects = (data.projects as { name: string; desc: string; url: string; techs: string[] }[]) || []
  function updateProject(i: number, field: string, val: string | string[]) {
    const next = [...projects]
    next[i] = { ...next[i], [field]: val }
    onChange('projects', next)
  }
  function addProject() {
    onChange('projects', [...projects, { name: '', desc: '', url: '', techs: [] }])
  }
  function removeProject(i: number) {
    onChange('projects', projects.filter((_, idx) => idx !== i))
  }
  return (
    <div className="space-y-4">
      {projects.map((p, i) => (
        <div key={i} className="rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-3.5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Proyecto {i + 1}</span>
            <button onClick={() => removeProject(i)} className="text-xs text-red-400 hover:text-red-300">Eliminar</button>
          </div>
          <div className="space-y-2.5">
            <input type="text" value={p.name} onChange={(e) => updateProject(i, 'name', e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="Nombre del proyecto" />
            <input type="text" value={p.desc} onChange={(e) => updateProject(i, 'desc', e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="Descripcion corta" />
            <input type="text" value={p.url} onChange={(e) => updateProject(i, 'url', e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="https://github.com/user/repo" />
            <input type="text" value={p.techs.join(', ')} onChange={(e) => updateProject(i, 'techs', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="React, Node.js, MongoDB" />
          </div>
        </div>
      ))}
      <button onClick={addProject} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 py-3 text-sm text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-400">
        + Agregar proyecto
      </button>
    </div>
  )
}

export function SocialEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, val: unknown) => void }) {
  const fields = [
    { key: 'github', label: 'GitHub', ph: 'UnPendejoHola' },
    { key: 'discord', label: 'Discord ID o link', ph: '1046488706078482505' },
    { key: 'instagram', label: 'Instagram', ph: 'usuario' },
    { key: 'youtube', label: 'YouTube', ph: 'tuCanal' },
    { key: 'twitter', label: 'Twitter / X', ph: 'usuario' },
    { key: 'linkedin', label: 'LinkedIn', ph: 'tuperfil' },
    { key: 'email', label: 'Email', ph: 'email@ejemplo.com' },
    { key: 'website', label: 'Website', ph: 'https://tusitio.com' },
  ]
  return (
    <div className="space-y-3">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="mb-1 block text-xs text-zinc-500">{f.label}</label>
          <input type="text" value={(data[f.key] as string) || ''} onChange={(e) => onChange(f.key, e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-cyan-500 focus:bg-zinc-800" placeholder={f.ph} />
        </div>
      ))}
    </div>
  )
}

export function CounterEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, val: unknown) => void }) {
  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/30 px-3.5 py-2.5 transition-colors hover:bg-zinc-800/60">
        <input type="checkbox" checked={!!(data.enabled ?? true)} onChange={(e) => onChange('enabled', e.target.checked)}
          className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-cyan-500" />
        <span className="text-sm text-zinc-300">Mostrar contador de visitas</span>
      </label>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-500">Texto de la etiqueta</label>
        <input type="text" value={(data.label as string) || 'Visitors'} onChange={(e) => onChange('label', e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-500" />
      </div>
    </div>
  )
}

export function SnakeEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, val: unknown) => void }) {
  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/30 px-3.5 py-2.5 transition-colors hover:bg-zinc-800/60">
        <input type="checkbox" checked={!!(data.enabled ?? true)} onChange={(e) => onChange('enabled', e.target.checked)}
          className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-cyan-500" />
        <span className="text-sm text-zinc-300">Mostrar snake animation</span>
      </label>
      <p className="text-xs text-zinc-600 italic">Requiere un workflow de GitHub Actions para generar la imagen</p>
    </div>
  )
}

export function QuoteEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, val: unknown) => void }) {
  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/30 px-3.5 py-2.5 transition-colors hover:bg-zinc-800/60">
        <input type="checkbox" checked={!!(data.enabled ?? true)} onChange={(e) => onChange('enabled', e.target.checked)}
          className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-cyan-500" />
        <span className="text-sm text-zinc-300">Mostrar frase aleatoria de programacion</span>
      </label>
    </div>
  )
}

export function GraphEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, val: unknown) => void }) {
  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/30 px-3.5 py-2.5 transition-colors hover:bg-zinc-800/60">
        <input type="checkbox" checked={!!(data.enabled ?? true)} onChange={(e) => onChange('enabled', e.target.checked)}
          className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-cyan-500" />
        <span className="text-sm text-zinc-300">Mostrar grafico de contribuciones</span>
      </label>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-500">Color del grafico</label>
        <div className="flex gap-3">
          <input type="text" value={(data.color as string) || '#00e5ff'} onChange={(e) => onChange('color', e.target.value)}
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-500" placeholder="#00e5ff" />
          <input type="color" value={(data.color as string) || '#00e5ff'} onChange={(e) => onChange('color', e.target.value)}
            className="h-[42px] w-[42px] cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800" />
        </div>
      </div>
    </div>
  )
}

export function FooterEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (key: string, val: unknown) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-500">Texto personalizado</label>
      <input type="text" value={(data.text as string) || ''} onChange={(e) => onChange('text', e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-cyan-500 focus:bg-zinc-800" placeholder="Hecho con  por Manuel Contreras" />
    </div>
  )
}
