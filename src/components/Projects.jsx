import { useState } from 'react'
import { FaChartLine, FaKeyboard, FaBoxes, FaLandmark, FaWallet, FaCode, FaMousePointer } from 'react-icons/fa'
import Folder from './Folder.jsx'
import ProjectModal from './ProjectModal.jsx'
import { projects, projectCategories } from '../data/portfolio.js'

const folderIcons = {
  finance: FaChartLine,
  typing: FaKeyboard,
  inventory: FaBoxes,
  room: FaLandmark,
  money: FaWallet
}

function iconFor(key) {
  return folderIcons[key] || FaCode
}

export default function Projects() {
  const [activeId, setActiveId] = useState(null)
  const [selected, setSelected] = useState(null)

  const activeCategory = projectCategories.find((c) => c.id === activeId) || null
  const activeProjects = activeCategory
    ? projects.filter((p) => p.category === activeCategory.id)
    : []

  const openCategory = (id) => {
    setSelected(null)
    setActiveId(id)
  }

  const closeModal = () => {
    setActiveId(null)
    setSelected(null)
  }

  return (
    <section id="projects" className="section section-alt">
      <div className="container reveal">
        <span className="section-tag">Selected Work</span>
        <h2 className="section-title">Projects</h2>
        <p className="section-sub">Browse by folder — open one to see its projects, then pick a project for details and links.</p>

        <p className="folder-hint">
          <FaMousePointer size={12} />
          Click a folder to open its projects.
        </p>

        <div className="folders-grid">
          {projectCategories.map((cat) => {
            const list = projects.filter((p) => p.category === cat.id)
            const papers = list.slice(0, 3).map((p) => {
              const Icon = iconFor(p.icon)
              return <Icon key={p.title} aria-hidden="true" />
            })
            while (papers.length < 3) {
              papers.push(<FaCode key={`empty-${cat.id}-${papers.length}`} aria-hidden="true" style={{ opacity: 0.35 }} />)
            }
            return (
              <div key={cat.id} className="folder-item">
                <button
                  type="button"
                  className="folder-open-btn"
                  onClick={() => openCategory(cat.id)}
                  aria-haspopup="dialog"
                  aria-label={`Open ${cat.label} folder with ${list.length} projects`}
                >
                  <Folder
                    size={1.4}
                    color={cat.color}
                    items={papers}
                    label={cat.label}
                    onToggle={(isOpen) => {
                      if (isOpen) openCategory(cat.id)
                    }}
                  />
                </button>
                <div className="folder-meta">
                  <strong>{cat.label}</strong>
                  <small>{list.length} project{list.length === 1 ? '' : 's'} • {cat.hint}</small>
                  <span className="folder-names">{list.map((p) => p.title.split(' — ')[0]).join(' • ')}</span>
                </div>
              </div>
            )
          })}
        </div>

        {activeCategory && (
          <ProjectModal
            category={activeCategory}
            projects={activeProjects}
            selected={selected}
            onSelect={setSelected}
            onClose={closeModal}
          />
        )}
      </div>
    </section>
  )
}
