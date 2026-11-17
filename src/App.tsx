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
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
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

function getHistorySection() {
  const state = window.history.state
  return state && typeof state === 'object' && typeof state.section === 'string'
    ? state.section
    : null
}

function setSectionHistory(id: string, replace = false) {
  const currentSection = getHistorySection()
  const url = `${window.location.pathname}${window.location.search}`

  if (currentSection === id && !window.location.hash) return

  const state = Object.assign({}, window.history.state, { section: id })
  if (replace || currentSection === id) {
    window.history.replaceState(state, '', url)
  } else {
    window.history.pushState(state, '', url)
  }
}

function navigateToSection(id: string, behavior: ScrollBehavior) {
  setSectionHistory(id)
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
}

function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className="section-heading"
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reducedMotion ? 0 : 0.65, ease: easeOut }}
    >
      <p className="section-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </motion.div>
  )
}

function MagneticButton({
  children,
  href,
  variant = 'primary',
  onClick,
}: {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'secondary'
  onClick?: () => void
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
      <a
        {...buttonProps}
        className={`magnetic-button ${variant}`}
        href={href}
        onClick={onClick ? (event) => {
          event.preventDefault()
          onClick()
        } : undefined}
      >
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

function WelcomeIntro({ onFinish }: { onFinish: () => void }) {
  const reducedMotion = useReducedMotion()
  const [leaving, setLeaving] = useState(false)
  const skipButton = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    skipButton.current?.focus()

    if (reducedMotion) {
      onFinish()
      return
    }

    const timer = window.setTimeout(() => setLeaving(true), 1400)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLeaving(true)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onFinish, reducedMotion])

  if (reducedMotion) return null

  return (
    <motion.div
      className="welcome-intro"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-intro-title"
      initial={{ opacity: 0 }}
      animate={leaving
        ? { opacity: 0, clipPath: 'inset(0 0 100% 0)' }
        : { opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: leaving ? 0.45 : 0.3, ease: easeOut }}
      onAnimationComplete={() => {
        if (leaving) onFinish()
      }}
    >
      <div className="welcome-intro-grid" aria-hidden="true" />
      <div className="welcome-intro-content">
        <motion.p
          className="welcome-intro-mark"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOut, delay: 0.05 }}
        >
          ZR / PORTFOLIO
        </motion.p>
        <motion.h1
          id="welcome-intro-title"
          initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, ease: easeOut, delay: 0.12 }}
        >
          Welcome to my website
        </motion.h1>
        <motion.span
          className="welcome-intro-rule"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.32 }}
          aria-hidden="true"
        />
        <motion.p
          className="welcome-intro-caption"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: easeOut, delay: 0.42 }}
        >
          Technology · Networking · Web
        </motion.p>
      </div>
      <button
        ref={skipButton}
        type="button"
        className="welcome-intro-skip"
        onClick={() => setLeaving(true)}
      >
        Skip intro <ArrowRight size={14} />
      </button>
    </motion.div>
  )
}

gsap.registerPlugin(ScrollTrigger)

function App() {
  const appRef = useRef<HTMLDivElement | null>(null)
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedCertificate, setSelectedCertificate] = useState<(typeof certificates)[number] | null>(null)
  const [portfolioCategory, setPortfolioCategory] = useState<'projects' | 'achievements' | 'certificates'>('projects')
  const educationTimeline = useRef<HTMLDivElement | null>(null)
  const portfolioScene = useRef<HTMLElement | null>(null)
  const portfolioTransitionWord = useRef<HTMLHeadingElement | null>(null)
  const portfolioTransitionImpact = useRef<HTMLDivElement | null>(null)
  const portfolioSceneCompleted = useRef(false)
  const navigationIntent = useRef<string | null>(null)
  const sectionRestoreComplete = useRef(false)
  const [welcomeVisible, setWelcomeVisible] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [portfolioTransitionActive, setPortfolioTransitionActive] = useState(false)
  const [portfolioTransitionComplete, setPortfolioTransitionComplete] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [cursorActive, setCursorActive] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const reducedMotion = useReducedMotion()

  const finishWelcome = useCallback(() => setWelcomeVisible(false), [])

  useEffect(() => {
    const handleScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight
      const nextProgress = total > 0 ? (window.scrollY / total) * 100 : 0
      setScrollProgress(nextProgress)

      if (!sectionRestoreComplete.current) return

      const referenceY = Math.max(110, window.innerHeight * 0.3)
      const transitionBounds = portfolioScene.current?.getBoundingClientRect()
      const sectionId = transitionBounds
        && transitionBounds.top <= referenceY
        && transitionBounds.bottom > referenceY
        ? 'portfolio'
        : Array.from(document.querySelectorAll<HTMLElement>('section[id]'))
          .find((section) => {
            const bounds = section.getBoundingClientRect()
            return bounds.top <= referenceY && bounds.bottom > referenceY
          })?.id

      if (!sectionId) return
      if (navigationIntent.current === sectionId) navigationIntent.current = null
      setSectionHistory(sectionId, true)
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
          const sectionId = (visible.target as HTMLElement).id
          setActiveSection(sectionId)
          if (navigationIntent.current === sectionId) navigationIntent.current = null
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
    document.body.style.overflow =
      welcomeVisible || selectedProject || selectedCertificate ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [welcomeVisible, selectedProject, selectedCertificate])

  useEffect(() => {
    if (reducedMotion || welcomeVisible) return

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
  }, [reducedMotion, welcomeVisible])

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

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previousRestoration
    }
  }, [])

  useEffect(() => {
    if (welcomeVisible) return

    const syncFromNavigation = () => {
      sectionRestoreComplete.current = false
      const requestedId = window.location.hash.slice(1) || getHistorySection() || 'home'
      const id = document.getElementById(requestedId) ? requestedId : 'home'
      const section = document.getElementById(id)
      if (section) {
        if (window.location.hash || !getHistorySection()) {
          setSectionHistory(id, true)
        }
        navigationIntent.current = id
        requestAnimationFrame(() => {
          section.scrollIntoView({ behavior: 'instant', block: 'start' })
          sectionRestoreComplete.current = true
        })
      }
    }

    syncFromNavigation()
    window.addEventListener('hashchange', syncFromNavigation)
    window.addEventListener('popstate', syncFromNavigation)
    return () => {
      window.removeEventListener('hashchange', syncFromNavigation)
      window.removeEventListener('popstate', syncFromNavigation)
    }
  }, [welcomeVisible])

  useEffect(() => {
    if (welcomeVisible) return
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => window.cancelAnimationFrame(frame)
  }, [welcomeVisible])

  useEffect(() => {
    const clearNavigationIntent = () => {
      navigationIntent.current = null
    }

    window.addEventListener('wheel', clearNavigationIntent, { passive: true })
    window.addEventListener('touchstart', clearNavigationIntent, { passive: true })
    return () => {
      window.removeEventListener('wheel', clearNavigationIntent)
      window.removeEventListener('touchstart', clearNavigationIntent)
    }
  }, [])

  useLayoutEffect(() => {
    const scene = portfolioScene.current
    const word = portfolioTransitionWord.current
    const impact = portfolioTransitionImpact.current
    if (!scene || !word || !impact || reducedMotion) return

    const meta = scene.querySelector<HTMLElement>('.portfolio-transition-meta')
    const getZoomScale = () =>
      Math.max(window.innerWidth / word.offsetWidth, window.innerHeight / word.offsetHeight) * 1.35

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            setActiveSection('portfolio')
            setPortfolioTransitionActive(true)
          },
          onEnterBack: () => {
            scene.classList.remove('transition-complete')
            setActiveSection('portfolio')
            setPortfolioTransitionActive(true)
            setPortfolioTransitionComplete(false)
          },
          onLeave: () => {
            setPortfolioTransitionActive(false)
            if (portfolioSceneCompleted.current) return
            portfolioSceneCompleted.current = true
            scene.classList.add('transition-complete')
            setPortfolioTransitionComplete(true)
            if (navigationIntent.current && navigationIntent.current !== 'portfolio') return
            setSectionHistory('portfolio')
            setActiveSection('portfolio')
            document.getElementById('portfolio')?.scrollIntoView({
              behavior: 'instant',
              block: 'start',
            })
          },
          onLeaveBack: () => {
            scene.classList.remove('transition-complete')
            setPortfolioTransitionActive(false)
            portfolioSceneCompleted.current = false
            setPortfolioTransitionComplete(false)
          },
        },
      })

      timeline
        .to(word, { scale: getZoomScale, duration: 0.94, ease: 'power4.in' }, 0)
        .to(meta, { y: -10, autoAlpha: 0, duration: 0.12, ease: 'power2.in' }, 0.06)
        .to(impact, { scale: 0.68, autoAlpha: 1, duration: 0.24, ease: 'power3.in' }, 0.68)
        .to(word, { autoAlpha: 0, duration: 0.06, ease: 'none' }, 0.94)
    }, scene)

    return () => context.revert()
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      const aboutVisual = document.querySelector('.visual-card')
      if (aboutVisual) {
        gsap.to(aboutVisual, {
          y: 24,
          rotation: -3,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      gsap.fromTo(
        '.story-text, .about-meta div, .about-stage',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 75%',
            once: true,
          },
        },
      )

    }, appRef)

    return () => ctx.revert()
  }, [reducedMotion])

  useLayoutEffect(() => {
    const stage = educationTimeline.current
    if (!stage || reducedMotion) return

    const desktopQuery = window.matchMedia('(min-width: 1025px)')
    const scrollTrack = stage.closest<HTMLElement>('.education-scroll-track')
    const cards = Array.from(stage.querySelectorAll<HTMLElement>('.timeline-card'))
    const steps = Array.from(stage.querySelectorAll<HTMLElement>('.education-rail-step'))
    const railFill = stage.querySelector<HTMLElement>('.education-rail-fill')
    const currentStep = stage.querySelector<HTMLElement>('[data-education-current]')
    if (cards.length === 0) return

    let context: gsap.Context | undefined
    const updateProgress = (progress: number) => {
      const activeIndex = Math.min(cards.length - 1, Math.floor(progress * cards.length))
      steps.forEach((step, index) => {
        step.classList.toggle('is-active', index === activeIndex)
        step.classList.toggle('is-past', index < activeIndex)
      })
      if (currentStep) currentStep.textContent = String(activeIndex + 1).padStart(2, '0')
      if (railFill) gsap.set(railFill, { scaleY: progress })
    }

    const initializeTimeline = () => {
      context?.revert()
      context = undefined
      stage.classList.remove('is-sticky')

      if (desktopQuery.matches && scrollTrack && cards.length > 1) {
        stage.classList.add('is-sticky')
        context = gsap.context(() => {
          gsap.set(cards, {
            autoAlpha: 0,
            y: 48,
            rotateX: -8,
            scale: 0.94,
            transformOrigin: '50% 100%',
          })
          gsap.set(cards[0], { autoAlpha: 1, y: 0, rotateX: 0, scale: 1 })
          updateProgress(0)

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: scrollTrack,
              start: 'top 110px',
              end: () => `+=${window.innerHeight * (cards.length - 1)}`,
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) => updateProgress(self.progress),
              onRefresh: (self) => updateProgress(self.progress),
            },
          })

          cards.slice(0, -1).forEach((card, index) => {
            const transitionAt = index + 0.68
            timeline.to(card, {
              autoAlpha: 0,
              y: -34,
              rotateX: 7,
              scale: 0.97,
              duration: 0.32,
              ease: 'power2.in',
            }, transitionAt)
            timeline.fromTo(cards[index + 1], {
              autoAlpha: 0,
              y: 42,
              rotateX: -8,
              scale: 0.94,
            }, {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              duration: 0.38,
              ease: 'power3.out',
            }, transitionAt)
          })
        }, stage)
      } else {
        context = gsap.context(() => {
          cards.forEach((card) => {
            gsap.fromTo(card, {
              autoAlpha: 0,
              y: 32,
              rotateX: -5,
            }, {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 82%',
                once: true,
              },
            })
          })
        }, stage)
      }
    }

    initializeTimeline()
    desktopQuery.addEventListener('change', initializeTimeline)

    return () => {
      desktopQuery.removeEventListener('change', initializeTimeline)
      context?.revert()
      stage.classList.remove('is-sticky')
    }
  }, [reducedMotion])

  useLayoutEffect(() => {
    if (reducedMotion || portfolioCategory !== 'projects') return

    const portfolio = document.getElementById('portfolio')
    if (!portfolio) return

    let context: gsap.Context | undefined
    const desktopQuery = window.matchMedia('(min-width: 1025px)')

    const initializeShowcase = () => {
      const panel = portfolio.querySelector<HTMLElement>('#portfolio-panel-projects')
      const showcase = panel?.querySelector<HTMLElement>('.projects-showcase')
      const track = panel?.querySelector<HTMLElement>('.projects-track')
      const progress = panel?.querySelector<HTMLElement>('.project-progress-bar')
      if (!panel || !showcase || !track || !progress) return false
      if (!desktopQuery.matches) {
        context?.revert()
        context = undefined
        return true
      }
      if (context) return true

      context = gsap.context(() => {
        const getDistance = () => Math.max(0, track.scrollWidth - showcase.clientWidth)

        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: showcase,
            start: 'top 16%',
            end: () => `+=${getDistance()}`,
            pin: showcase,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }),
          },
        })
      }, panel)
      return true
    }

    const handleBreakpointChange = () => {
      initializeShowcase()
    }
    desktopQuery.addEventListener('change', handleBreakpointChange)

    if (initializeShowcase()) {
      return () => {
        desktopQuery.removeEventListener('change', handleBreakpointChange)
        context?.revert()
      }
    }

    const observer = new MutationObserver(() => {
      if (initializeShowcase()) observer.disconnect()
    })
    observer.observe(portfolio, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      desktopQuery.removeEventListener('change', handleBreakpointChange)
      context?.revert()
    }
  }, [portfolioCategory, reducedMotion])

  const aboutStages = ['Observe', 'Prototype', 'Refine']

  const portfolioTabs = [
    { key: 'projects', label: 'Projects' },
    { key: 'achievements', label: 'Achievements' },
    { key: 'certificates', label: 'Certificates' },
  ] as const

  const contactLinks: ContactLink[] = [
    {
      label: 'Email',
      value: profile.email || 'Email placeholder',
      href: profile.email ? `mailto:${profile.email}` : undefined,
      icon: <Mail size={16} />,
    },
    {
      label: 'GitHub',
      value: profile.github ? 'zainalrafi' : 'GitHub placeholder',
      href: profile.github || undefined,
      icon: <GitBranch size={16} />,
    },
    {
      label: 'Instagram',
      value: profile.instagram ? '@jzenal.rh' : 'Instagram placeholder',
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

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false)
    navigationIntent.current = id
    if (id === 'portfolio') {
      if (reducedMotion) {
        navigateToSection(id, 'instant')
        return
      }

      const scene = portfolioScene.current
      if (!scene) {
        navigateToSection(id, 'smooth')
        return
      }

      setSectionHistory('portfolio')

      const portfolio = document.getElementById('portfolio')
      if (portfolio) {
        const contentBounds = portfolio.getBoundingClientRect()
        if (contentBounds.top < window.innerHeight && contentBounds.bottom > 0) return
      }

      const bounds = scene.getBoundingClientRect()
      if (bounds.top <= 0 && bounds.bottom >= window.innerHeight) return
      window.scrollTo({ top: bounds.top + window.scrollY, behavior: 'smooth' })
      return
    }

    navigateToSection(id, reducedMotion ? 'instant' : 'smooth')
  }

  return (
    <div className="app-shell" ref={appRef}>
      {welcomeVisible ? <WelcomeIntro onFinish={finishWelcome} /> : null}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {!reducedMotion && !welcomeVisible && !portfolioTransitionActive ? (
        <div
          className={`custom-cursor ${cursorActive ? 'cursor-active' : ''}`}
          aria-hidden="true"
          style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
        >
          <span className="cursor-dot" />
          <span className="cursor-ring" />
        </div>
      ) : null}

      <header className="site-header" inert={welcomeVisible} aria-hidden={welcomeVisible}>
        <nav className="site-nav" aria-label="Main navigation">
          <div className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            {navigationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {activeSection === item.id ? (
                  <motion.span
                    className="nav-active-indicator"
                    layoutId="nav-active-indicator"
                    transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 440, damping: 34, mass: 0.65 }}
                    aria-hidden="true"
                  />
                ) : null}
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

      <main className="page-content" inert={welcomeVisible} aria-hidden={welcomeVisible}>
        <section id="home" className="section hero-section">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                Technology • Networking • Web
              </p>

              <h1 className="hero-title">
                <span className="hero-line">
                  <span className="hero-word"></span>
                  <span className="hero-word">Hello, I'm</span>
                </span>
                <span className="hero-line hero-line-name">
                  <span className="hero-word">Zainal</span>
                  <span className="hero-word">Rafi.</span>
                  <span className="hero-word"></span>
                </span>
              </h1>

              <p className="hero-intro">
                {profile.intro}
              </p>

              <div className="hero-actions">
                <MagneticButton href="#portfolio" variant="primary" onClick={() => handleNavClick('portfolio')}>
                  Explore Portfolio <ArrowRight size={16} />
                </MagneticButton>
                <MagneticButton href="#contact" variant="secondary" onClick={() => handleNavClick('contact')}>
                  Get in Touch
                </MagneticButton>
              </div>

              <ul className="hero-interest-list">
                {profile.interests.slice(0, 4).map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </div>

            <div className="hero-visual">
              <div className="hero-surface">
                <span className="hero-surface-orbit orbit-one" />
                <span className="hero-surface-orbit orbit-two" />
                <span className="hero-surface-orbit orbit-three" />
              </div>
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
            </div>
          </div>
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

              <div className="about-stages" aria-label="Process stages">
                {aboutStages.map((stage, index) => (
                  <div key={stage} className="about-stage">
                    <span>0{index + 1}</span>
                    <strong>{stage}</strong>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <section className="about-subsection education-section">
            <SectionHeading
              eyebrow="Education"
              title="A timeline of learning and growth."
              description="The timeline keeps the background honest and structured without inventing unsupported details."
            />

            <div
              className="education-scroll-track"
              style={reducedMotion
                ? undefined
                : { height: `calc(${Math.max(education.length - 1, 1) * 100}vh + clamp(360px, 62vh, 560px))` }}
            >
              <div className="education-timeline" ref={educationTimeline}>
                <div className="education-rail" aria-hidden="true">
                  <span className="education-rail-track" />
                  <span className="education-rail-fill" />
                  {education.map((entry, index) => (
                    <div key={entry.level} className={`education-rail-step${index === 0 ? ' is-active' : ''}`}>
                      <span className="timeline-node">{String(index + 1).padStart(2, '0')}</span>
                      <span className="education-rail-label">{entry.level}</span>
                    </div>
                  ))}
                </div>

                <div className="education-cards">
                  {education.map((entry) => (
                    <article key={entry.level} className="timeline-card">
                      <span className="timeline-level">{entry.level}</span>
                      <h3>{entry.school}</h3>
                      <div className="timeline-meta">
                        <span>{entry.location}</span>
                        <span>{entry.period}</span>
                      </div>
                      <p>{entry.details}</p>
                      <small>{entry.note}</small>
                    </article>
                  ))}
                </div>

                <div className="education-step-count" aria-hidden="true">
                  <span data-education-current>01</span>
                  <span> / {String(education.length).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="about-subsection skills-section">
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
                  initial={{ opacity: 0, y: 28, z: -80, rotateX: 8, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, z: 0, rotateX: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: reducedMotion ? 0 : 0.7, ease: easeOut, delay: reducedMotion ? 0 : index * 0.08 }}
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
        </section>

        {!reducedMotion ? (
          <section
            className={`portfolio-transition-scene${portfolioTransitionComplete ? ' transition-complete' : ''}`}
            ref={portfolioScene}
            aria-hidden="true"
          >
            <div className="portfolio-transition-stage">
              <div className="portfolio-transition-impact" ref={portfolioTransitionImpact} />
              <div className="portfolio-transition-content">
                <span className="portfolio-transition-meta">Selected work / 01</span>
                <h2 className="portfolio-transition-word" ref={portfolioTransitionWord}>PORTFOLIO</h2>
              </div>
            </div>
          </section>
        ) : null}

        <section id="portfolio" className="section portfolio-section">
          <SectionHeading
            eyebrow="Portfolio"
            title="Selected work and references across practice, recognition, and learning."
            description="Explore a curated view of projects, achievement highlights, and certificates in one combined portfolio experience."
          />

          <div className="portfolio-selector" role="tablist" aria-label="Portfolio categories">
            {portfolioTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`portfolio-tab ${portfolioCategory === tab.key ? 'active' : ''}`}
                onClick={() => setPortfolioCategory(tab.key)}
                role="tab"
                aria-selected={portfolioCategory === tab.key}
                aria-controls={`portfolio-panel-${tab.key}`}
              >
                {portfolioCategory === tab.key ? (
                  <motion.span
                    className="portfolio-tab-indicator"
                    layoutId="portfolio-tab-indicator"
                    transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36, mass: 0.7 }}
                    aria-hidden="true"
                  />
                ) : null}
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={portfolioCategory}
              id={`portfolio-panel-${portfolioCategory}`}
              className="portfolio-panel"
              initial={portfolioCategory === 'projects'
                ? { opacity: 0 }
                : { opacity: 0, y: 18, clipPath: 'inset(0 0 100% 0 round 18px)' }}
              animate={portfolioCategory === 'projects'
                ? { opacity: 1 }
                : { opacity: 1, y: 0, clipPath: 'none' }}
              exit={portfolioCategory === 'projects'
                ? { opacity: 0 }
                : { opacity: 0, y: -12, clipPath: 'inset(100% 0 0 0 round 18px)' }}
              transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {portfolioCategory === 'projects' ? (
                <div className="projects-showcase">
                  <div className="project-progress" aria-hidden="true">
                    <span className="project-progress-bar" />
                  </div>
                  <div className="projects-track">
                    {projects.map((project, index) => (
                      <motion.article
                        key={project.id}
                        className={`project-card accent-${project.accent}`}
                        initial={{ opacity: 0, y: 30, z: -100, rotateY: index % 2 === 0 ? -9 : 9, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, z: 0, rotateY: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: reducedMotion ? 0 : 0.7, ease: easeOut, delay: reducedMotion ? 0 : index * 0.1 }}
                        onMouseMove={(event) => {
                          if (reducedMotion) return
                          const rect = event.currentTarget.getBoundingClientRect()
                          const x = (event.clientX - rect.left) / rect.width
                          const y = (event.clientY - rect.top) / rect.height
                          event.currentTarget.style.transform = `perspective(1200px) translateY(-6px) scale(1.015) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 10}deg)`
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.transform = 'perspective(1200px) translateY(0) scale(1) rotateX(0deg) rotateY(0deg)'
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
                </div>
              ) : null}

              {portfolioCategory === 'achievements' ? (
                <div className="portfolio-single-card">
                  <motion.article
                    className="achievement-card"
                    initial={{ opacity: 0, y: 30, z: -140, rotateY: -10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, z: 0, rotateY: 0, scale: 1 }}
                    transition={{ duration: reducedMotion ? 0 : 0.7, ease: easeOut }}
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
                </div>
              ) : null}

              {portfolioCategory === 'certificates' ? (
                <div className="cert-grid portfolio-cert-grid">
                  {certificates.map((certificate, index) => (
                    <motion.article
                      key={certificate.title}
                      className="certificate-card"
                      initial={{
                        opacity: 0,
                        y: 44,
                        z: -220,
                        rotateX: index % 2 === 0 ? 12 : -12,
                        rotateY: index % 2 === 0 ? -10 : 10,
                        rotateZ: index % 2 === 0 ? -2 : 2,
                        scale: 0.9,
                      }}
                      animate={{ opacity: 1, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 }}
                      transition={{ duration: reducedMotion ? 0 : 0.7, ease: easeOut, delay: reducedMotion ? 0 : index * 0.12 }}
                      onMouseMove={(event) => {
                        if (reducedMotion) return
                        const rect = event.currentTarget.getBoundingClientRect()
                        const x = (event.clientX - rect.left) / rect.width
                        const y = (event.clientY - rect.top) / rect.height
                        event.currentTarget.style.transform = `perspective(1200px) translateY(-6px) scale(1.015) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 10}deg)`
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.transform = 'perspective(1200px) translateY(0) scale(1) rotateX(0deg) rotateY(0deg)'
                      }}
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
              ) : null}
            </motion.div>
          </AnimatePresence>
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
              {contactLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href || '#'}
                  className={`contact-item ${!link.href ? 'placeholder' : ''}`}
                  initial={{ opacity: 0, y: 18, x: index % 2 === 0 ? -14 : 14 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: reducedMotion ? 0 : 0.6, ease: easeOut, delay: reducedMotion ? 0 : index * 0.08 }}
                  onClick={(event) => {
                    if (!link.href) event.preventDefault()
                  }}
                >
                  <span className="contact-icon">{link.icon}</span>
                  <span className="contact-label">{link.label}</span>
                  <span className="contact-value">{link.value}</span>
                </motion.a>
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

      <footer className="site-footer" inert={welcomeVisible} aria-hidden={welcomeVisible}>
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
              className="modal-panel portfolio-modal"
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
              className="modal-panel certificate-modal portfolio-modal"
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
