import { useState } from 'react'

interface Props {
  label: string
  value: string
  accent: string
}

export default function ConversionCard({ label, value, accent }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="group w-full text-left rounded-xl overflow-hidden"
      style={{
        background: 'var(--card-gradient)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--line)',
      }}
    >
      {/* color stripe */}
      <div className="h-1.5 w-full" style={{ background: accent }} />

      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <div className="min-w-0">
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
            style={{ color: 'var(--muted)' }}
          >
            {label}
          </p>
          <p
            className="text-sm font-mono truncate"
            style={{ color: 'var(--ink)' }}
          >
            {value}
          </p>
        </div>

        {/* copy icon */}
        <span
          className="mt-0.5 shrink-0 text-xs transition-opacity"
          style={{ color: copied ? 'var(--mint)' : 'var(--muted)', opacity: copied ? 1 : 0.5 }}
          aria-hidden
        >
          {copied ? '✓' : '⎘'}
        </span>
      </div>
    </button>
  )
}
