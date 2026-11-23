import { BriefcaseBusiness, CodeXml } from 'lucide-react'

const siteData = {
  name: 'Ryan Hirst',
  email: 'r.hirst18@gmail.com',
  footerLinks: {
    GitHub: { icon: CodeXml, href: 'https://github.com/rhirst' },
    LinkedIn: { icon: BriefcaseBusiness, href: 'https://www.linkedin.com/in/ryan-hirst-a69a33b6/' },
  }
}

/** Return links ready to map into a footer, profile, or other link list. */
export function getSiteLinks(links = siteData.footerLinks) {
  return Object.entries(links).map(([label, { icon: Icon, href }]) => {
    const external = /^https?:\/\//i.test(href)

    return {
      label,
      Icon,
      href,
      target: external ? '_blank' : undefined,
      rel: external ? 'noopener noreferrer' : undefined,
    }
  })
}

export default siteData
