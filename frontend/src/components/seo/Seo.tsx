import { site } from '../../content/site'

interface Props {
  title: string
  description?: string
  path?: string
  noindex?: boolean
}

// React 19 hoists <title>, <meta> and <link> rendered anywhere into <head>.
export function Seo({ title, description = site.description, path = '/', noindex }: Props) {
  const fullTitle = path === '/' ? `${site.name} | Shooting Academy in Chennai` : `${title} | ${site.name}`
  const url = `${site.url}${path}`
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${site.url}/og-image.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  )
}
