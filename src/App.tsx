import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  ChevronRight,
  ExternalLink,
  GitBranch,
  Mail,
  Menu,
  Network,
  X,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { achievement } from './data/achievements'
import { certificates } from './data/certificates'
import { education } from './data/education'
import { navigationItems } from './data/navigation'
import { profile } from './data/profile'
import { projects, type Project } from './data/projects'
import { skills } from './data/skills'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
}

type ContactLink = {
  label: string
  value: string
  href?: string
  icon: ReactNode
}

const easeOut = [0.22, 1, 0.36, 1] as const

function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <p className="section-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  )
}

function MagneticButton({
  children,
  href,
  variant = 'primary',
}: {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'secondary'
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const reduced = useReducedMotion()

  const handleMove = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    setOffset({ x: x * 0.18, y: y * 0.18 })
  }

  const buttonProps = {
    onMouseMove: handleMove,
    onMouseLeave: () => setOffset({ x: 0, y: 0 }),
    style: { transform: `translate(${offset.x}px, ${offset.y}px)` },
  }

  if (href) {
    return (
      <a {...buttonProps} className={`magnetic-button ${variant}`} href={href}>
        {children}
      </a>
    )
  }

  return (
    <button {...buttonProps} type="button" className={`magnetic-button ${variant}`}>
      {children}
    </button>
  )
}

function PageLoader({ visible, progress }: { visible: boolean; progress: number }) {
  const reduced = useReducedMotion()

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reduced ? 0.2 : 0.7, ease: easeOut } }}
        >
          <motion.div
            className="loader-shell"
            initial={{ scaleY: 0.9, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="loader-brand">ZR</div>
            <div className="loader-text-row">
              <span>Loading portfolio</span>
              <span className="loader-counter">{Math.min(100, Math.round(progress))}%</span>
            </div>
            <div className="loader-bar">
              <motion.div
                className="loader-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, progress)}%` }}
                transition={{ duration: reduced ? 0.2 : 0.65, ease: easeOut }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedCertificate, setSelectedCertificate] = useState<(typeof certificates)[number] | null>(null)
  const [loaderVisible, setLoaderVisible] = useState(true)
  const [loaderProgress, setLoaderProgress] = useState(0)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [cursorActive, setCursorActive] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      setLoaderProgress(100)
      setLoaderVisible(false)
      return
    }

    const interval = window.setInterval(() => {
      setLoaderProgress((current) => {
        const next = Math.min(100, current + 12)
        if (next >= 100) {
          window.clearInterval(interval)
          window.setTimeout(() => setLoaderVisible(false), 220)
        }
        return next
      })
    }, 90)

    return () => window.clearInterval(interval)
  }, [reducedMotion])

  useEffect(() => {
    const handleScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight
      const nextProgress = total > 0 ? (window.scrollY / total) * 100 : 0
      setScrollProgress(nextProgress)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible) {
          setActiveSection(visible.target.id)
        }
      },
      {
        rootMargin: '-15% 0px -50% 0px',
        threshold: [0.2, 0.4, 0.7],
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = selectedProject || selectedCertificate ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedProject, selectedCertificate])

  useEffect(() => {
    if (reducedMotion) return

    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) return

    document.documentElement.classList.add('has-custom-cursor')

    const handlePointerMove = (event: PointerEvent) => {
      setCursor({ x: event.clientX, y: event.clientY })
    }

    const handlePointerOver = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest('a, button, .project-card, .certificate-card, .menu-toggle')
      setCursorActive(Boolean(interactive))
    }

    const handlePointerLeave = () => setCursorActive(false)

    window.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerover', handlePointerOver)
    document.addEventListener('pointerout', handlePointerLeave)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerout', handlePointerLeave)
    }
  }, [reducedMotion])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProject(null)
        setSelectedCertificate(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const contactLinks: ContactLink[] = [
    {
      label: 'Email',
      value: profile.email || 'Email placeholder',
      href: profile.email ? `mailto:${profile.email}` : undefined,
      icon: <Mail size={16} />,
    },
    {
      label: 'GitHub',
      value: profile.github || 'GitHub placeholder',
      href: profile.github || undefined,
      icon: <GitBranch size={16} />,
    },
    {
      label: 'Instagram',
      value: profile.instagram || 'Instagram placeholder',
      href: profile.instagram || undefined,
      icon: <Network size={16} />,
    },
    {
      label: 'LinkedIn',
      value: profile.linkedin || 'LinkedIn placeholder',
      href: profile.linkedin || undefined,
      icon: <BriefcaseBusiness size={16} />,
    },
  ]

  const sectionVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  }

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false)
    const section = document.getElementById(id)
    if (!section) return
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="app-shell">
      <PageLoader visible={loaderVisible} progress={loaderProgress} />
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {!reducedMotion ? (
        <div
          className={`custom-cursor ${cursorActive ? 'cursor-active' : ''}`}
          aria-hidden="true"
          style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
        >
          <span className="cursor-dot" />
          <span className="cursor-ring" />
        </div>
      ) : null}

      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <button
            type="button"
            className="brand-mark"
            onClick={() => handleNavClick('home')}
            aria-label="Go to home section"
          >
            ZR
          </button>

          <div className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            {navigationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      <main className="page-content">
        <section id="home" className="section hero-section">
          <motion.div
            className="hero-grid"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ duration: 0.9, ease: easeOut }}
          >
            <div className="hero-copy">
              <motion.p
                className="eyebrow"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: easeOut }}
              >
                Technology • Networking • Web
              </motion.p>

              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: easeOut, delay: 0.1 }}
              >
                <span className="hero-line">
                  <span>Curious</span>
                  <span>about</span>
                </span>
                <span className="hero-line hero-line-name">Zainal Rafi Habibi</span>
              </motion.h1>

              <motion.p
                className="hero-intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
              >
                {profile.intro}
              </motion.p>

              <motion.div
                className="hero-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: easeOut, delay: 0.3 }}
              >
                <MagneticButton href="#projects" variant="primary">
                  Explore Projects <ArrowRight size={16} />
                </MagneticButton>
                <MagneticButton href="#contact" variant="secondary">
                  Get in Touch
                </MagneticButton>
              </motion.div>

              <motion.ul
                className="hero-interest-list"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: easeOut, delay: 0.35 }}
              >
                {profile.interests.slice(0, 4).map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </motion.ul>
            </div>

            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: easeOut, delay: 0.15 }}
            >
              <div className="device-frame">
                <div className="device-header">
                  <span className="label-dot dot-orange" />
                  <span className="label-dot dot-muted" />
                  <span className="label-dot dot-muted" />
                  <span className="device-name">/system/ops</span>
                </div>

                <div className="device-body">
                  <div className="device-rail rail-top" />
                  <div className="device-grid">
                    <div className="grid-panel panel-blue">
                      <span>net</span>
                    </div>
                    <div className="grid-panel panel-dark">
                      <span>linux</span>
                    </div>
                    <div className="grid-panel panel-accent">
                      <span>web</span>
                    </div>
                  </div>
                  <div className="device-readout">
                    <div>
                      <small>status</small>
                      <strong>Active</strong>
                    </div>
                    <div>
                      <small>focus</small>
                      <strong>Build</strong>
                    </div>
                    <div>
                      <small>mode</small>
                      <strong>Explore</strong>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section id="about" className="section about-section">
          <motion.div
            className="about-shell"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <div className="about-visual">
              <div className="visual-card">
                <span className="visual-badge">Self study</span>
                <p>Curiosity leads the process.</p>
              </div>
            </div>

            <div className="about-copy">
              <SectionHeading
                eyebrow="About"
                title="Exploring technology through systems, practice, and continuous learning."
                description="I enjoy understanding how things work and improving through hands-on experimentation."
              />

              <p className="story-text">{profile.bio}</p>
              <p className="story-text">{profile.philosophy}</p>

              <div className="about-meta">
                <div>
                  <span className="meta-label">Education</span>
                  <strong>{profile.education}</strong>
                </div>
                <div>
                  <span className="meta-label">Location</span>
                  <strong>{profile.location}</strong>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="projects" className="section projects-section">
          <SectionHeading
            eyebrow="Projects"
            title="Selected concept work and learning prototypes."
            description="These examples are editable demo placeholders designed to show the intended portfolio structure."
          />

          <div className="project-grid">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                className={`project-card accent-${project.accent}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: easeOut, delay: index * 0.1 }}
                onMouseMove={(event) => {
                  if (reducedMotion) return
                  const rect = event.currentTarget.getBoundingClientRect()
                  const x = (event.clientX - rect.left) / rect.width
                  const y = (event.clientY - rect.top) / rect.height
                  event.currentTarget.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 10}deg)`
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'
                }}
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-visual">
                  <span className="visual-tag">{project.thumbnailLabel}</span>
                  <div className="project-visual-lines" />
                </div>

                <div className="project-content">
                  <div className="project-topline">
                    <span>{project.category}</span>
                    <span>{project.status}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul className="project-stack">
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="project-link-row">
                    <span>View concept</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="skills" className="section skills-section">
          <SectionHeading
            eyebrow="Skills"
            title="Technical interests and learning focus."
            description="These categories reflect areas of study and practical exploration rather than formal expertise claims."
          />

          <div className="skills-grid">
            {skills.map((skillGroup, index) => (
              <motion.article
                key={skillGroup.title}
                className="skill-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: easeOut, delay: index * 0.08 }}
              >
                <div className="skill-card-head">
                  <span className="skill-index">0{index + 1}</span>
                  <h3>{skillGroup.title}</h3>
                </div>
                <p>{skillGroup.description}</p>
                <ul className="skill-tags">
                  {skillGroup.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="achievements" className="section achievements-section">
          <SectionHeading
            eyebrow="Achievements"
            title="A single spotlight achievement."
            description="The portfolio is intentionally set up to feature one significant recognition at a time."
          />

          <motion.article
            className="achievement-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <div className="achievement-visual">
              <div className="achievement-badge">
                <Award size={20} />
              </div>
            </div>
            <div className="achievement-content">
              <div className="achievement-meta">
                <span className="achievement-title">{achievement.title}</span>
                <span className="achievement-year">{achievement.year}</span>
              </div>
              <h3>{achievement.event}</h3>
              <p>{achievement.description}</p>
              <a
                href={achievement.documentUrl || '#'}
                className="inline-link"
                onClick={(event) => {
                  if (!achievement.documentUrl) event.preventDefault()
                }}
              >
                View documentation <ExternalLink size={14} />
              </a>
            </div>
          </motion.article>
        </section>

        <section id="certificates" className="section certificates-section">
          <SectionHeading
            eyebrow="Certificates"
            title="Credentials and learning references."
            description="Exactly two placeholder certificates are included, ready to be replaced with official documentation."
          />

          <div className="cert-grid">
            {certificates.map((certificate, index) => (
              <motion.article
                key={certificate.title}
                className="certificate-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: easeOut, delay: index * 0.12 }}
                onClick={() => setSelectedCertificate(certificate)}
              >
                <div className="certificate-visual">
                  <span>{certificate.imageLabel}</span>
                </div>
                <div className="certificate-content">
                  <div className="certificate-meta">
                    <span>{certificate.issuer}</span>
                    <span>{certificate.issueDate}</span>
                  </div>
                  <h3>{certificate.title}</h3>
                  <p>{certificate.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="education" className="section education-section">
          <SectionHeading
            eyebrow="Education"
            title="A timeline of learning and growth."
            description="The timeline keeps the background honest and structured without inventing unsupported details."
          />

          <div className="education-timeline">
            {education.map((entry, index) => (
              <motion.div
                key={entry.level}
                className="timeline-item"
                initial={{ opacity: 0, x: index % 2 === 0 ? -22 : 22 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: easeOut, delay: index * 0.12 }}
              >
                <div className="timeline-node" />
                <article className="timeline-card">
                  <span className="timeline-level">{entry.level}</span>
                  <h3>{entry.school}</h3>
                  <div className="timeline-meta">
                    <span>{entry.location}</span>
                    <span>{entry.period}</span>
                  </div>
                  <p>{entry.details}</p>
                  <small>{entry.note}</small>
                </article>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <motion.div
            className="contact-shell"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <p className="section-kicker">Contact</p>
            <h2>Let’s build something thoughtful and practical.</h2>
            <p className="contact-copy">
              I enjoy exploring ideas, learning by doing, and turning technical curiosity into useful systems.
            </p>

            <div className="contact-links">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href || '#'}
                  className={`contact-item ${!link.href ? 'placeholder' : ''}`}
                  onClick={(event) => {
                    if (!link.href) event.preventDefault()
                  }}
                >
                  <span className="contact-icon">{link.icon}</span>
                  <span className="contact-label">{link.label}</span>
                  <span className="contact-value">{link.value}</span>
                </a>
              ))}
            </div>

            <div className="contact-actions">
              <MagneticButton href={profile.email ? `mailto:${profile.email}` : undefined} variant="primary">
                Connect via Email <ArrowRight size={16} />
              </MagneticButton>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark mini">ZR</span>
          <span>{profile.name}</span>
        </div>
        <div className="footer-links">
          {navigationItems.map((item) => (
            <button key={item.id} type="button" onClick={() => handleNavClick(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="footer-socials">
          <a href={profile.github || '#'} aria-label="GitHub" onClick={(event) => !profile.github && event.preventDefault()}>
            <GitBranch size={16} />
          </a>
          <a href={profile.instagram || '#'} aria-label="Instagram" onClick={(event) => !profile.instagram && event.preventDefault()}>
            <Network size={16} />
          </a>
          <a href={profile.linkedin || '#'} aria-label="LinkedIn" onClick={(event) => !profile.linkedin && event.preventDefault()}>
            <BriefcaseBusiness size={16} />
          </a>
        </div>
        <p>© {new Date().getFullYear()} {profile.name}. {profile.footerNote}</p>
      </footer>

      <AnimatePresence>
        {selectedProject ? (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="modal-panel"
              initial={{ opacity: 0, scale: 0.96, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 28 }}
              transition={{ duration: 0.28, ease: easeOut }}
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close project modal">
                <X size={18} />
              </button>
              <div className="modal-visual accent-project">
                <span>{selectedProject.thumbnailLabel}</span>
              </div>
              <div className="modal-content">
                <div className="project-topline">
                  <span>{selectedProject.category}</span>
                  <span>{selectedProject.status}</span>
                </div>
                <h3>{selectedProject.title}</h3>
                <p>{selectedProject.longDescription}</p>
                <div className="project-stack">
                  {selectedProject.stack.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="modal-actions">
                  {selectedProject.githubUrl ? (
                    <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer">
                      GitHub <ExternalLink size={14} />
                    </a>
                  ) : null}
                  {selectedProject.liveUrl ? (
                    <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer">
                      Live demo <ExternalLink size={14} />
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCertificate ? (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              className="modal-panel certificate-modal"
              initial={{ opacity: 0, scale: 0.96, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 28 }}
              transition={{ duration: 0.28, ease: easeOut }}
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" className="modal-close" onClick={() => setSelectedCertificate(null)} aria-label="Close certificate modal">
                <X size={18} />
              </button>
              <div className="modal-visual certificate-visual-large">
                <span>{selectedCertificate.imageLabel}</span>
              </div>
              <div className="modal-content">
                <div className="certificate-meta">
                  <span>{selectedCertificate.issuer}</span>
                  <span>{selectedCertificate.issueDate}</span>
                </div>
                <h3>{selectedCertificate.title}</h3>
                <p>{selectedCertificate.description}</p>
                {selectedCertificate.verificationUrl ? (
                  <div className="modal-actions">
                    <a href={selectedCertificate.verificationUrl} target="_blank" rel="noreferrer">
                      Verify certificate <ExternalLink size={14} />
                    </a>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default App
