import { useState, useCallback, useRef } from 'react'
import { initApp } from '@freeappstore/sdk'
import { Shell, BuildInfo } from '@freeappstore/sdk/ui'
import { convertColor, type ColorFormats } from './utils/colorConversion'
import ConversionCard from './components/ConversionCard'

const fas = initApp({ appId: 'convert-to-color' })

const FORMAT_LABELS: { key: keyof ColorFormats; label: string }[] = [
  { key: 'hex', label: 'HEX' },
  { key: 'rgb', label: 'RGB' },
  { key: 'hsl', label: 'HSL' },
  { key: 'hsv', label: 'HSV' },
  { key: 'cmyk', label: 'CMYK' },
  { key: 'hwb', label: 'HWB' },
  { key: 'lch', label: 'LCH' },
  { key: 'lab', label: 'LAB' },
  { key: 'xyz', label: 'XYZ' },
  { key: 'name', label: 'Color Name' },
]

const DEFAULT_COLOR = '#d86f4d'

export default function App() {
  const [inputValue, setInputValue] = useState(DEFAULT_COLOR)
  const [currentHex, setCurrentHex] = useState(DEFAULT_COLOR)
  const [formats, setFormats] = useState<ColorFormats | null>(() => convertColor(DEFAULT_COLOR))
  const [invalid, setInvalid] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const processInput = useCallback((raw: string) => {
    const result = convertColor(raw)
    if (result) {
      setFormats(result)
      setCurrentHex(result.hex)
      setInvalid(false)
    } else {
      setInvalid(true)
    }
  }, [])

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setInputValue(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => processInput(val), 150)
  }

  function handlePickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const hex = e.target.value
    setInputValue(hex)
    processInput(hex)
  }

  return (
    <Shell app={fas} appName="Color Converter">
      <main className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="display-font text-3xl font-bold" style={{ color: 'var(--ink)' }}>
            Color Converter
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Enter any color — HEX, RGB, HSL, named colors, and more.
          </p>
        </div>

        {/* Input section */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: 'var(--card-gradient)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--line)' }}
        >
          {/* Color preview swatch */}
          <div
            className="w-full h-24 rounded-xl transition-colors duration-200"
            style={{ background: currentHex, boxShadow: 'var(--shadow-soft)' }}
          />

          {/* Inputs row */}
          <div className="flex gap-3 items-center">
            {/* Native color picker with spinning gradient border */}
            <div
              className="relative shrink-0 w-11 h-11 rounded-xl overflow-hidden"
              style={{ padding: '2px' }}
            >
              {/* Rotating conic-gradient that forms the border */}
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: '-50%',
                  width: '200%',
                  height: '200%',
                  background: `conic-gradient(from 0deg, ${currentHex}, var(--paper), ${currentHex}, var(--paper), ${currentHex})`,
                  animation: 'spin-gradient 3s linear infinite',
                }}
              />
              <label
                className="relative z-10 block w-full h-full rounded-[10px] overflow-hidden cursor-pointer"
                title="Open color picker"
              >
                <div className="absolute inset-0 pointer-events-none" style={{ background: currentHex }} />
                <input
                  type="color"
                  value={currentHex}
                  onChange={handlePickerChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>
            </div>

            {/* Text input */}
            <input
              type="text"
              value={inputValue}
              onChange={handleTextChange}
              placeholder="#d86f4d, rgb(216,111,77), tomato…"
              spellCheck={false}
              className="flex-1 h-11 px-4 rounded-xl font-mono text-sm outline-none transition-all"
              style={{
                background: 'var(--paper-deep)',
                color: invalid ? 'var(--error)' : 'var(--ink)',
                border: `1.5px solid ${invalid ? 'var(--error)' : 'var(--line-strong)'}`,
              }}
            />
          </div>

          {invalid && (
            <p className="text-xs" style={{ color: 'var(--error)' }}>
              Unrecognized color format — try #hex, rgb(), hsl(), or a CSS name.
            </p>
          )}
        </div>

        {/* Output grid */}
        {formats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FORMAT_LABELS.map(({ key, label }) => (
              <ConversionCard
                key={key}
                label={label}
                value={formats[key]}
                accent={currentHex}
              />
            ))}
          </div>
        )}

        {/* Store link */}
        <p className="text-center text-xs pb-4" style={{ color: 'var(--muted)' }}>
          Built for{' '}
          <a
            href="https://freeappstore.online"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent)' }}
          >
            freeappstore.online
          </a>
        </p>
      </main>
      <BuildInfo />
    </Shell>
  )
}
