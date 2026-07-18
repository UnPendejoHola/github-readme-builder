import { Section } from './types'

const TECH_COLORS: Record<string, string> = {
  'HTML5': 'E34F26', 'CSS3': '1572B6', 'JavaScript': 'F7DF1E', 'TypeScript': '3178C6',
  'React': '61DAFB', 'Next.js': '000000', 'Angular': 'DD0031', 'Vue': '4FC08D',
  'TailwindCSS': '38B2AC', 'Bootstrap': '7952B3', 'Sass': 'CC6699',
  'Node.js': '339933', 'Express': '000000', 'NestJS': 'E0234E',
  'Python': '3776AB', 'Java': 'ED8B00', 'Spring Boot': '6DB33F', 'Go': '00ADD8',
  'MongoDB': '47A248', 'PostgreSQL': '316192', 'MySQL': '4479A1', 'SQLite': '003B57', 'Prisma': '2D3748',
  'Docker': '2496ED', 'Git': 'F05032', 'GitHub_Actions': '2088FF',
  'AWS': 'FF9900', 'Firebase': 'FFCA28', 'Redis': 'DC382D', 'GraphQL': 'E10098',
  'NPM': 'CB3837', 'Linux': 'FCC624', 'VSCode': '007ACC',
}

const TECH_LOGOS: Record<string, string> = {
  'GitHub_Actions': 'githubactions',
  'Next.js': 'nextdotjs', 'TailwindCSS': 'tailwindcss', 'Spring Boot': 'springboot',
}

function techLogo(t: string): string {
  return TECH_LOGOS[t] || t.toLowerCase().replace(/\s+/g, '')
}

function techColor(t: string): string {
  return TECH_COLORS[t] || 'FFFFFF'
}

function badgeUrl(label: string, color: string, logo: string, logoColor = 'white'): string {
  return `https://img.shields.io/badge/${encodeURIComponent(label)}-${color}?style=for-the-badge&logo=${logo}&logoColor=${logoColor}`
}

function socialBadgeUrl(platform: string, color: string, logo: string): string {
  return `https://img.shields.io/badge/${platform}-${color}?style=for-the-badge&logo=${logo}&logoColor=white`
}

export function generateMarkdown(sections: Section[], username: string): string {
  const lines: string[] = []

  for (const s of sections) {
    const d = s.data

    switch (s.type) {
      case 'header': {
        const name = (d.name as string) || username
        const sub = d.subtitle as string
        const color = ((d.color as string) || '#00e5ff').replace('#', '')
        lines.push('<div align="center">')
        lines.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a1b41,100:0d7377&height=250&section=header&text=${encodeURIComponent(name)}&fontSize=70&fontAlignY=35&fontColor=${color}&animation=fadeIn${sub ? `&desc=${encodeURIComponent(sub)}&descAlignY=55&descAlign=50&descSize=20` : ''}" width="100%" />`)
        lines.push('</div>')
        lines.push('')
        break
      }

      case 'about': {
        const desc = d.description as string
        const gif = d.gif as string
        const bullets = d.bullets as string
        lines.push('<table align="center">')
        lines.push('  <tr>')
        lines.push('    <td width="55%" valign="top">')
        lines.push('      <h2>About Me</h2>')
        if (desc) lines.push(`      <p>${desc}</p>`)
        if (bullets) {
          lines.push('      <ul>')
          bullets.split('\n').filter(Boolean).forEach((b) => lines.push(`        <li>${b.trim()}</li>`))
          lines.push('      </ul>')
        }
        lines.push('    </td>')
        if (gif) {
          lines.push('    <td width="45%" align="center">')
          lines.push(`      <img src="${gif}" width="100%" style="border-radius: 15px;" />`)
          lines.push('    </td>')
        }
        lines.push('  </tr>')
        lines.push('</table>')
        lines.push('')
        break
      }

      case 'techstack': {
        const selected = d.selected as string[] | undefined
        if (!selected || selected.length === 0) break
        const categories = [
          { label: 'Frontend', techs: ['HTML5','CSS3','JavaScript','TypeScript','React','Next.js','Angular','TailwindCSS'] },
          { label: 'Backend', techs: ['Node.js','Express','NestJS','Python','Java','Spring Boot'] },
          { label: 'Bases de Datos', techs: ['MongoDB','PostgreSQL','MySQL','SQLite','Prisma'] },
          { label: 'DevOps & Tools', techs: ['Docker','Git','GitHub_Actions','Linux','NPM','VSCode'] },
        ]
        lines.push('<h2 align="center">Tech Stack</h2>')
        lines.push('')
        for (const cat of categories) {
          const techs = cat.techs.filter((t) => selected.includes(t))
          if (techs.length === 0) continue
          lines.push('<div align="center">')
          lines.push(`  <h3>${cat.label}</h3>`)
          const badgeLine = techs.map((t) => {
            const lc = t === 'JavaScript' ? 'black' : 'white'
            return `  <img src="${badgeUrl(t, techColor(t), techLogo(t), lc)}" />`
          }).join('\n')
          lines.push(badgeLine)
          lines.push('</div>')
          lines.push('')
        }
        break
      }

      case 'stats': {
        lines.push('<h2 align="center">GitHub Analytics</h2>')
        lines.push('')
        if (d.showStats) {
          lines.push('<div align="center">')
          lines.push(`  <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&hide_border=true&title_color=00e5ff&icon_color=00e5ff&text_color=c9d1d9&bg_color=0d1117" height="180" />`)
          if (d.showTopLangs) {
            lines.push(`  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&hide_border=true&title_color=00e5ff&text_color=00e5ff&bg_color=0d1117" height="180" />`)
          }
          lines.push('</div>')
          lines.push('')
        }
        if (d.showStreak) {
          lines.push('<div align="center">')
          lines.push(`  <img src="https://streak-stats.demolab.com?user=${username}&hide_border=true&ring=00e5ff&fire=00e5ff&currStreakLabel=00e5ff&sideNums=00e5ff&sideLabels=FFFFFF&dates=8b949e&background=0d1117" height="190" />`)
          if (d.showTrophies) {
            lines.push(`  <img src="https://github-profile-trophy.vercel.app/?username=${username}&theme=algolia&no-frame=true&no-bg=true&row=2&column=3" height="190" />`)
          }
          lines.push('</div>')
          lines.push('')
        }
        break
      }

      case 'projects': {
        const projects = d.projects as { name: string; desc: string; url: string; techs: string[] }[] | undefined
        if (!projects || projects.length === 0) break
        lines.push('<h2 align="center">Proyectos Destacados</h2>')
        lines.push('')
        for (const p of projects) {
          if (!p.name) continue
          lines.push('<p align="center">')
          lines.push(`  <a href="${p.url || '#'}"><b>${p.name}</b></a>`)
          if (p.desc) lines.push(`  &mdash; ${p.desc}`)
          lines.push('</p>')
          if (p.techs && p.techs.length > 0) {
            lines.push('<p align="center">')
            lines.push(p.techs.map((t) => `  <img src="${badgeUrl(t, techColor(t), techLogo(t), t === 'JavaScript' ? 'black' : 'white')}" />`).join('\n'))
            lines.push('</p>')
          }
          lines.push('')
        }
        break
      }

      case 'social': {
        const gh = d.github as string; const dc = d.discord as string
        const ig = d.instagram as string; const em = d.email as string
        const wb = d.website as string; const yt = d.youtube as string
        const tw = d.twitter as string; const li = d.linkedin as string
        const hasAny = gh || dc || ig || em || wb || yt || tw || li
        if (!hasAny) break
        lines.push('<h2 align="center">Connect With Me</h2>')
        lines.push('')
        lines.push('<div align="center">')
        if (gh) lines.push(`  <a href="https://github.com/${gh}"><img src="${socialBadgeUrl('GitHub','100000','github')}" /></a>`)
        if (dc) lines.push(`  <a href="${dc.startsWith('http') ? dc : `https://discord.com/users/${dc}`}"><img src="${socialBadgeUrl('Discord','5865F2','discord')}" /></a>`)
        if (ig) lines.push(`  <a href="https://www.instagram.com/${ig}"><img src="${socialBadgeUrl('Instagram','E4405F','instagram')}" /></a>`)
        if (yt) lines.push(`  <a href="https://youtube.com/@${yt}"><img src="${socialBadgeUrl('YouTube','FF0000','youtube')}" /></a>`)
        if (tw) lines.push(`  <a href="https://twitter.com/${tw}"><img src="${socialBadgeUrl('Twitter','1DA1F2','twitter')}" /></a>`)
        if (li) lines.push(`  <a href="https://linkedin.com/in/${li}"><img src="${socialBadgeUrl('LinkedIn','0077B5','linkedin')}" /></a>`)
        if (em) lines.push(`  <a href="mailto:${em}"><img src="${socialBadgeUrl('Email','D14836','gmail')}" /></a>`)
        if (wb) lines.push(`  <a href="${wb}"><img src="${socialBadgeUrl('Website','00e5ff','google-chrome')}" /></a>`)
        lines.push('</div>')
        lines.push('')
        break
      }

      case 'counter': {
        if (d.enabled) {
          lines.push(`<p align="center">`)
          lines.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&color=00e5ff&style=flat-square&label=${encodeURIComponent(d.label as string || 'Visitors')}" />`)
          lines.push('</p>')
          lines.push('')
        }
        break
      }

      case 'snake': {
        if (d.enabled) {
          lines.push('<div align="center">')
          lines.push('  <picture>')
          lines.push(`    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake-dark.svg" />`)
          lines.push(`    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake.svg" />`)
          lines.push(`    <img src="https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake.svg" />`)
          lines.push('  </picture>')
          lines.push('</div>')
          lines.push('')
        }
        break
      }

      case 'quote': {
        if (d.enabled) {
          lines.push('<div align="center">')
          lines.push('  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=dark" width="75%" />')
          lines.push('</div>')
          lines.push('')
        }
        break
      }

      case 'graph': {
        if (d.enabled) {
          const color = ((d.color as string) || '#00e5ff').replace('#', '')
          lines.push('<div align="center">')
          lines.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=0d1117&color=${color}&line=${color}&point=ffffff&area=true&area_color=${color}&hide_border=true" width="95%" />`)
          lines.push('</div>')
          lines.push('')
        }
        break
      }

      case 'footer': {
        const text = d.text as string
        lines.push('<div align="center">')
        lines.push('  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d7377,50:1a1b41,100:0d1117&height=150&section=footer&animation=fadeIn" width="100%" />')
        lines.push('</div>')
        if (text) {
          lines.push('')
          lines.push(`<p align="center">${text}</p>`)
        }
        break
      }
    }
  }

  return lines.join('\n')
}
