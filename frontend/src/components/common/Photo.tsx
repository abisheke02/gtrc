interface Props {
  src?: string
  alt: string
  className?: string
  /** Shown on the placeholder until a real photo is added */
  label?: string
}

/** Shows the photo if `src` is set, otherwise a branded placeholder, so content can be filled in later. */
export function Photo({ src, alt, className = '', label }: Props) {
  if (src) return <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  return (
    <div className={`target-bg flex h-full w-full items-end bg-ink-3 p-4 ${className}`} role="img" aria-label={alt}>
      <span className="text-sm text-mute">{label ?? alt}</span>
    </div>
  )
}
