import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Logo from './Logo.jsx'
import { Parasol, HeatedPool, SaltPool, Bistro, Reception, Parking } from './icons.jsx'
import { COPY } from './copy.js'

const V = import.meta.env.BASE_URL + 'video/'
const FILES = { pre: 'preloader.mp4', hero: 'hero.mp4', t12: 't12.mp4', scrub: 'scrub.mp4', t12r: 't12_rev.mp4', t23: 't23.mp4', beach: 'beach.mp4', t23r: 't23_rev.mp4' }
// FILES order = download order: exactly the order a visitor meets the clips
const ICONS = [Parasol, HeatedPool, SaltPool, Bistro, Reception, Parking]

const Flag = ({ lang }) => (
  <svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true" className="flag">
    <clipPath id={`f-${lang}`}><circle cx="10" cy="10" r="10" /></clipPath>
    {lang === 'ro' ? (
      <g clipPath={`url(#f-${lang})`}><path fill="#002b7f" d="M0 0h7v20H0z" /><path fill="#fcd116" d="M7 0h6v20H7z" /><path fill="#ce1126" d="M13 0h7v20h-7z" /></g>
    ) : (
      <g clipPath={`url(#f-${lang})`}>
        <path fill="#012169" d="M0 0h20v20H0z" />
        <path stroke="#fff" strokeWidth="4" d="M0 0l20 20M20 0L0 20" />
        <path stroke="#c8102e" strokeWidth="1.6" d="M0 0l20 20M20 0L0 20" />
        <path stroke="#fff" strokeWidth="6" d="M10 0v20M0 10h20" />
        <path stroke="#c8102e" strokeWidth="3.4" d="M10 0v20M0 10h20" />
      </g>
    )}
  </svg>
)

const initialLang = () => {
  try { const saved = localStorage.getItem('mm-lang'); if (saved === 'en' || saved === 'ro') return saved } catch { /* storage blocked */ }
  return navigator.language?.startsWith('ro') ? 'ro' : 'en'
}

export default function App() {
  const v = useRef({})
  const bar = useRef(null)
  const api = useRef({})
  const [scene, setScene] = useState('intro')
  const [stage, setStage] = useState(0)
  const [lang, setLang] = useState(initialLang)
  const t = COPY[lang]
  const other = lang === 'en' ? 'ro' : 'en'
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    api.current.locked = menu // scene controller ignores scrolling while the menu is open
    if (!menu) return
    const onKey = (e) => { if (e.key === 'Escape') setMenu(false) }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [menu])

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('mm-lang', lang) } catch { /* storage blocked */ }
  }, [lang])

  useEffect(() => {
    const el = v.current

    // Each clip is downloaded whole into memory (no mid-flight buffering), one after another.
    // need() jumps a clip to the front if the visitor gets there before the queue does.
    const loads = {}
    const load = (k) => (loads[k] ??= fetch(V + FILES[k])
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.blob() })
      .then((b) => URL.createObjectURL(b))
      .catch(() => V + FILES[k]) // network hiccup: fall back to streaming the file
      .then((src) => new Promise((done) => {
        const c = el[k]
        c.addEventListener('loadeddata', done, { once: true })
        c.addEventListener('error', done, { once: true })
        c.src = src
        c.load()
      })))
    const need = (...keys) => Promise.all(keys.map(load))
    const queue = Object.keys(FILES).reduce((p, k) => p.then(() => load(k)), Promise.resolve())
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let current = 'intro'
    let busy = true
    let top = 1
    let target = 0, prog = 0, over = 0, acc = 0, accTimer = 0, lastStage = 0
    let quietUntil = 0, quietHard = 0, lastEvt = 0, edgeArmed = false

    const enter = (name) => { current = name; setScene(name) }

    // Crossfade: put `clip` on top and fade it in; everything under it pauses afterwards
    const crossTo = (clip, dur, done) => {
      clip.style.zIndex = ++top
      gsap.fromTo(clip, { opacity: 0 }, {
        opacity: 1, duration: dur, ease: 'power1.inOut', overwrite: true,
        onComplete: () => {
          Object.values(el).forEach((o) => { if (o !== clip) { o.pause(); o.style.opacity = 0 } })
          done?.()
        },
      })
    }

    // After a scene change, swallow trackpad inertia: until 180 ms of silence, at most 1.2 s
    const settle = () => { busy = false; quietUntil = performance.now() + 500; quietHard = performance.now() + 1200 }

    const goHero = () => { el.hero.play(); crossTo(el.hero, 0.35, settle); enter('hero') }
    const goScrub = (atEnd) => {
      prog = target = atEnd ? 1 : 0
      el.scrub.currentTime = atEnd ? el.scrub.duration - 0.05 : 0
      crossTo(el.scrub, 0.25, settle)
      enter('scrub')
    }
    const goBeach = () => { el.beach.currentTime = 0; el.beach.play(); crossTo(el.beach, 0.6, settle); enter('beach') }

    // One scroll gesture = one fly-through clip; reversed files play the same flight backwards
    const fly = (key, then, next) => {
      busy = true
      need(key, then).then(() => {
        const clip = el[key]
        enter('moving')
        clip.currentTime = 0
        clip.onended = () => { clip.onended = null; next() }
        clip.play()
        crossTo(clip, 0.35)
      })
    }

    const step = (dy) => {
      const now = performance.now()
      const gap = now - lastEvt
      lastEvt = now
      if (busy || api.current.locked) return
      if (now < quietUntil && now < quietHard) { quietUntil = now + 180; return }
      if (current === 'scrub') {
        const atEdge = (dy > 0 && target === 1) || (dy < 0 && target === 0)
        if (!atEdge) { edgeArmed = false; over = 0; target = Math.min(1, Math.max(0, target + dy / 2000)); return }
        // The gesture that reached the edge stops there; leaving the scene takes a new push
        if (!edgeArmed) { if (gap < 300) return; edgeArmed = true }
        over += Math.abs(dy)
        if (over > 200) { over = 0; edgeArmed = false; if (dy > 0) fly('t23', 'beach', goBeach); else fly('t12r', 'hero', goHero) }
        return
      }
      acc += dy
      clearTimeout(accTimer)
      accTimer = setTimeout(() => (acc = 0), 220)
      if (Math.abs(acc) < 40) return
      const down = acc > 0
      acc = 0
      if (current === 'hero' && down) fly('t12', 'scrub', () => goScrub(false))
      if (current === 'beach' && !down) fly('t23r', 'scrub', () => goScrub(true))
    }

    // Menu jumps straight to a scene with a crossfade, no fly-through
    api.current.jump = (name) => {
      if (busy || name === current) return
      busy = true
      need(name).then(() => ({ hero: goHero, scrub: () => goScrub(false), beach: goBeach })[name]())
    }

    const tick = () => {
      if (current !== 'scrub') return
      prog += (target - prog) * 0.1
      if (Math.abs(target - prog) < 0.0004) prog = target
      const t = prog * (el.scrub.duration - 0.05)
      if (!el.scrub.seeking && Math.abs(el.scrub.currentTime - t) > 1 / 60) el.scrub.currentTime = t
      if (bar.current) bar.current.style.transform = `scaleX(${prog})`
      const s = prog < 0.34 ? 0 : prog < 0.68 ? 1 : 2
      if (s !== lastStage) { lastStage = s; setStage(s) }
    }
    gsap.ticker.add(tick)
    if (import.meta.env.DEV) window.__mm = () => ({ current, busy, target, prog, over, edgeArmed, quiet: quietUntil - performance.now(), hard: quietHard - performance.now() })

    const onWheel = (e) => { e.preventDefault(); step(e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY) }
    let ty = 0
    const onTouchStart = (e) => { ty = e.touches[0].clientY }
    const onTouchMove = (e) => {
      e.preventDefault()
      const y = e.touches[0].clientY
      step((ty - y) * 2.4)
      ty = y
    }
    const onKey = (e) => {
      const d = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[e.key]
      if (!d || e.target.closest?.('a,button')) return
      e.preventDefault()
      quietUntil = 0
      step(d * 320)
    }
    addEventListener('wheel', onWheel, { passive: false })
    addEventListener('touchstart', onTouchStart, { passive: true })
    addEventListener('touchmove', onTouchMove, { passive: false })
    addEventListener('keydown', onKey)

    // Intro: logo draws on the lake-blue screen → screen lifts → preloader flight → crossfade to hero
    const tl = gsap.timeline()
    let loaded = false
    if (reduce) {
      tl.set('.intro', { autoAlpha: 0 })
      need('hero').then(() => {
        el.hero.style.opacity = 1
        el.hero.play()
        enter('hero')
        settle()
      })
    } else {
      tl.fromTo('.intro .logo-mark', { scale: 0.94, transformOrigin: '50% 50%' }, { scale: 1, duration: 2.2, ease: 'power2.out' })
        // both strokes of the M draw together, the outer one a beat ahead
        .to('.intro .logo-line', { strokeDashoffset: 0, duration: 1.5, ease: 'power3.inOut', stagger: 0.14 }, 0)
        // the words slide out from behind the M, left and right
        .fromTo('.intro .t-left', { x: 8 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 0.9, ease: 'power3.out' }, 1.05)
        .fromTo('.intro .t-right', { x: -8 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 0.9, ease: 'power3.out' }, 1.05)
        .to('.intro .t-sub', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.6)
        .add(() => { if (!loaded) tl.pause() })
        .add(() => { el.pre.play() }, 'lift')
        .to('.intro-bg', { opacity: 0, duration: 1.2, ease: 'power1.inOut' }, 'lift')
        // the dimming lifts over the whole flight
        .to('.intro-dim', { opacity: 0, duration: 4.5, ease: 'none' }, 'lift')
        // while the camera flies, only the logo slowly pushes in
        .to('.intro-logo', { scale: 1.12, duration: 4.5, ease: 'sine.inOut' }, 'lift')

      Promise.all([need('pre', 'hero'), document.fonts.ready]).then(() => {
        loaded = true
        if (tl.paused()) tl.resume()
      })
      el.pre.onended = () => {
        el.hero.currentTime = 0
        el.hero.play()
        // UI comes in only once the hero picture has fully replaced the flight
        // the logo leaves together with the crossfade into the hero
        gsap.to('.intro-logo', { opacity: 0, scale: 1.16, duration: 0.9, ease: 'power1.inOut', onComplete: () => gsap.set('.intro', { autoAlpha: 0 }) })
        crossTo(el.hero, 0.9, () => { enter('hero'); settle() })
      }
    }

    if (import.meta.env.DEV) queue.then(() => console.info('[miramare] all clips in memory'))

    return () => {
      tl.kill()
      gsap.ticker.remove(tick)
      removeEventListener('wheel', onWheel)
      removeEventListener('touchstart', onTouchStart)
      removeEventListener('touchmove', onTouchMove)
      removeEventListener('keydown', onKey)
    }
  }, [])

  const clip = (key, extra = {}) => (
    <video
      key={key}
      ref={(n) => { if (n) v.current[key] = n }}
      className="layer"
      muted
      playsInline
      preload="none"
      {...extra}
    />
  )
  const jump = (name) => (e) => { e.preventDefault(); setMenu(false); api.current.jump?.(name) }
  const on = (name) => (scene === name ? 'is-on' : undefined)

  return (
    <main className={`app scene-${scene}`}>
      <div className="stage" aria-hidden="true">
        {clip('pre', { poster: V + 'preloader.jpg', style: { opacity: 1, zIndex: 1 } })}
        {clip('hero', { loop: true, poster: V + 'hero.jpg' })}
        {clip('t12')}
        {clip('t12r')}
        {clip('scrub')}
        {clip('t23')}
        {clip('t23r')}
        {clip('beach', { loop: true })}
      </div>

      {/* per-scene shading, faded out while the camera flies between scenes */}
      <div className="scrim scrim-hero" aria-hidden="true" />
      <div className="scrim scrim-scrub" aria-hidden="true" />
      <div className="scrim scrim-beach" aria-hidden="true" />

      <div className="intro" aria-hidden="true">
        <div className="intro-dim" />
        <div className="intro-bg" />
        <div className="intro-logo"><Logo className="logo" /></div>
      </div>

      <header className="bar">
        <button type="button" className="burger" aria-expanded={menu} aria-controls="menu" aria-label={menu ? t.close : t.menu} onClick={() => setMenu(!menu)}>
          <i /><i />
        </button>
        <nav className="bar-side bar-left" aria-label="Sections">
          <a href="#apartments" onClick={jump('scrub')} aria-current={scene === 'scrub' || undefined}>{t.nav.apartments}</a>
          <a href="#beach" onClick={jump('beach')} aria-current={scene === 'beach' || undefined}>{t.nav.beach}</a>
        </nav>
        <a href="#top" className="bar-logo" onClick={jump('hero')} aria-label={t.home}><Logo className="logo" /></a>
        <div className="bar-side bar-right">
          <nav className="bar-links" aria-label="More">
            <a href={t.restaurantUrl} target="_blank" rel="noreferrer">{t.nav.restaurant}</a>
            <a href="mailto:rezervari@miramare.ro">{t.nav.contact}</a>
          </nav>
          {/* shows the language you switch TO */}
          <button type="button" className="lang" onClick={() => setLang(other)} aria-label={t.switchTo}>
            <Flag lang={other} /><span>{other.toUpperCase()}</span>
          </button>
          <a className="btn" href={t.bookUrl} target="_blank" rel="noreferrer">{t.book}</a>
        </div>
      </header>

      <div id="menu" className={`menu ${menu ? 'is-open' : ''}`} inert={!menu}>
        <nav aria-label="Menu">
          <a href="#apartments" onClick={jump('scrub')}>{t.nav.apartments}</a>
          <a href="#beach" onClick={jump('beach')}>{t.nav.beach}</a>
          <a href={t.restaurantUrl} target="_blank" rel="noreferrer">{t.nav.restaurant}</a>
          <a href="mailto:rezervari@miramare.ro">{t.nav.contact}</a>
        </nav>
        <div className="actions">
          <a className="btn" href={t.bookUrl} target="_blank" rel="noreferrer">{t.book}</a>
          <button type="button" className="lang" onClick={() => setLang(other)} aria-label={t.switchTo}>
            <Flag lang={other} /><span>{other.toUpperCase()}</span>
          </button>
        </div>
      </div>

      <section className={`panel hero ${on('hero') || ''}`} aria-hidden={scene !== 'hero'}>
        <h1>{t.hero.title}</h1>
        <p>{t.hero.text}</p>
        <div className="actions">
          <a className="btn" href={t.bookUrl} target="_blank" rel="noreferrer">{t.book}</a>
          <a className="link" href="#apartments" onClick={jump('scrub')}>{t.hero.more}</a>
        </div>
        <span className="hint">{t.hero.hint}</span>
      </section>

      <section className={`panel scrub ${on('scrub') || ''}`} aria-hidden={scene !== 'scrub'}>
        <div className="stages">
          {t.stages.map((s, i) => (
            <article key={i} className={i === stage ? 'is-now' : undefined} aria-hidden={i !== stage}>
              <h2>{s.title}</h2>
              {s.facts && (
                <dl>
                  {s.facts.map(([n, l]) => (
                    <div key={l}><dt>{l}</dt><dd>{n}</dd></div>
                  ))}
                </dl>
              )}
              <p>{s.text}</p>
            </article>
          ))}
        </div>
        <div className="track" aria-hidden="true"><i ref={bar} /></div>
      </section>

      <section className={`panel beach ${on('beach') || ''}`} aria-hidden={scene !== 'beach'}>
        <h2>{t.beach.title}</h2>
        <p>{t.beach.text}</p>
        <ul className="amenities">
          {t.beach.amenities.map((label, i) => {
            const Icon = ICONS[i]
            return <li key={i}><Icon /><span>{label}</span></li>
          })}
        </ul>
        <div className="actions">
          <a className="btn" href={t.bookUrl} target="_blank" rel="noreferrer">{t.book}</a>
          <a className="link" href="mailto:rezervari@miramare.ro">rezervari@miramare.ro</a>
        </div>
      </section>
    </main>
  )
}
