import { useEffect, useState } from 'react'
import { Check, LoaderCircle, Mail, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MultiStateButton } from '@/components/ui/multi-state-button'
import { PortfolioContent } from '@/components/PortfolioContent'
import siteData, { getSiteLinks } from './data/siteData'
import profile120 from './images/profile-120.webp'
import profile240 from './images/profile-240.webp'
import profile360 from './images/profile-360.webp'
import profileDark120 from './images/profile_dark-120.webp'
import profileDark240 from './images/profile_dark-240.webp'
import profileDark360 from './images/profile_dark-360.webp'
import { Badge } from '@/components/ui/badge'

function Profile({ dark, onToggle }) {
  return (
    <header className="profile mb-4 flex gap-6 flex-row items-center">
      <div className="relative w-fit rounded-full">
        <Button
          variant="ghost"
          className="size-30 rounded-full p-0 ring-3 hover:ring-6 ring-primary transition-all duration-200"
          onClick={onToggle}
          aria-label="Toggle dark mode"
          aria-pressed={dark}
        >
          <img
            src={dark ? profileDark120 : profile120}
            srcSet={dark
              ? `${profileDark120} 120w, ${profileDark240} 240w, ${profileDark360} 360w`
              : `${profile120} 120w, ${profile240} 240w, ${profile360} 360w`}
            sizes="120px"
            alt="Ryan Hirst"
            className="size-30 rounded-full object-cover"
            width="120"
            height="120"
            loading="eager"
            fetchPriority="high"
          />
        </Button>
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">{siteData.name}</h1>
        <p className="text-sm sm:text-lg leading-snug font-bold italic text-muted-foreground mb-1">
          Senior frontend engineer, <span className="whitespace-nowrap">accessibility advocate</span>, <span className="whitespace-nowrap">terrible carpenter</span>, <span className="whitespace-nowrap">decent cook</span>.
        </p>
        <Footer />
      </div>
    </header>
  )
}

function Footer() {
  const [copyStatus, setCopyStatus] = useState('idle')

  useEffect(() => {
    if (copyStatus !== 'copied') return
    const timeout = setTimeout(() => setCopyStatus('idle'), 2500)
    return () => clearTimeout(timeout)
  }, [copyStatus])

  const copyEmail = async () => {
    if (copyStatus === 'copying') return
    setCopyStatus('copying')
    try {
      await navigator.clipboard.writeText(siteData.email)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('error')
    }
  }

  return (
    <footer className="">
      <nav aria-label="Social and contact links">
        <ul className="flex flex-wrap gap-2">
          {getSiteLinks().map(({ label, Icon, href, target, rel }) => (
            <li key={href}>
              <Badge variant="link" asChild>
                <a href={href} target={target} rel={rel}>
                  <Icon aria-hidden="true" />
                  <span className="">{label}</span>
                </a>
              </Badge>
            </li>
          ))}
          <li>
            <MultiStateButton
                state={copyStatus}
                states={{
                  idle: { content: <><Mail aria-hidden="true" />{siteData.email}</> },
                  copying: {
                    content: <><LoaderCircle className="animate-spin motion-reduce:animate-none" aria-hidden="true" />Copying…</>,
                    busy: true,
                  },
                  copied: {
                    content: <><Check aria-hidden="true" />Copied!</>,
                    className: 'bg-success text-success-foreground border-success-heavy hover:bg-success hover:text-success-foreground',
                  },
                  error: {
                    content: <><RotateCcw aria-hidden="true" />Try again</>,
                    className: 'border-destructive text-destructive hover:bg-destructive hover:text-white',
                  },
                }}
                variant="ghost"
                type="button"
                onClick={copyEmail}
                aria-label={`Copy email address: ${siteData.email}`}
                title={`Copy ${siteData.email}`}
                contentClassName="gap-1"
                className="h-auto rounded-full border border-border px-2 py-0.5 text-xs font-medium hover:bg-primary hover:text-primary-foreground [&_svg:not([class*='size-'])]:size-3"
              />
          </li>
        </ul>
      </nav>
      <p role="status" className={copyStatus === 'error' ? 'mt-3 text-sm' : 'sr-only'}>
        {copyStatus === 'copied' && 'Email address copied to clipboard.'}
        {copyStatus === 'error' && `Couldn’t copy automatically. Copy this address: ${siteData.email}`}
      </p>
    </footer>
  )
}

export default function App() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch { /* Theme still works when storage is unavailable. */ }
  }, [dark])

  const toggleTheme = () => setDark(value => !value)

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-background focus:p-3">Skip to content</a>
      <div className="mx-auto max-w-[660px] px-4 pb-4 my-4">
        <Profile dark={dark} onToggle={toggleTheme} />
        <main id="main-content" tabIndex={-1}>
          <PortfolioContent />
        </main>
      </div>
    </>
  )
}
