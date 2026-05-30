import { parse, converter, formatHex } from 'culori'

const toRgb = converter('rgb')
const toHsl = converter('hsl')
const toHsv = converter('hsv')
const toHwb = converter('hwb')
const toLab = converter('lab')
const toLch = converter('lch')
const toXyz = converter('xyz65')

export interface ColorFormats {
  hex: string
  rgb: string
  hsl: string
  hsv: string
  cmyk: string
  hwb: string
  lab: string
  lch: string
  xyz: string
  name: string
}

// W3C CSS named colors: name → [R, G, B] (0–255)
const CSS_NAMED: Record<string, [number, number, number]> = {
  aliceblue: [240, 248, 255], antiquewhite: [250, 235, 215], aqua: [0, 255, 255],
  aquamarine: [127, 255, 212], azure: [240, 255, 255], beige: [245, 245, 220],
  bisque: [255, 228, 196], black: [0, 0, 0], blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255], blueviolet: [138, 43, 226], brown: [165, 42, 42],
  burlywood: [222, 184, 135], cadetblue: [95, 158, 160], chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30], coral: [255, 127, 80], cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220], crimson: [220, 20, 60], cyan: [0, 255, 255],
  darkblue: [0, 0, 139], darkcyan: [0, 139, 139], darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169], darkgreen: [0, 100, 0], darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107], darkmagenta: [139, 0, 139], darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0], darkorchid: [153, 50, 204], darkred: [139, 0, 0],
  darksalmon: [233, 150, 122], darkseagreen: [143, 188, 143], darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79], darkslategrey: [47, 79, 79], darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211], deeppink: [255, 20, 147], deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105], dimgrey: [105, 105, 105], dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34], floralwhite: [255, 250, 240], forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255], gainsboro: [220, 220, 220], ghostwhite: [248, 248, 255],
  gold: [255, 215, 0], goldenrod: [218, 165, 32], gray: [128, 128, 128],
  green: [0, 128, 0], greenyellow: [173, 255, 47], grey: [128, 128, 128],
  honeydew: [240, 255, 240], hotpink: [255, 105, 180], indianred: [205, 92, 92],
  indigo: [75, 0, 130], ivory: [255, 255, 240], khaki: [240, 230, 140],
  lavender: [230, 230, 250], lavenderblush: [255, 240, 245], lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205], lightblue: [173, 216, 230], lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255], lightgoldenrodyellow: [250, 250, 210], lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144], lightgrey: [211, 211, 211], lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122], lightseagreen: [32, 178, 170], lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153], lightslategrey: [119, 136, 153], lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224], lime: [0, 255, 0], limegreen: [50, 205, 50],
  linen: [250, 240, 230], magenta: [255, 0, 255], maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170], mediumblue: [0, 0, 205], mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219], mediumseagreen: [60, 179, 113], mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154], mediumturquoise: [72, 209, 204], mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112], mintcream: [245, 255, 250], mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181], navajowhite: [255, 222, 173], navy: [0, 0, 128],
  oldlace: [253, 245, 230], olive: [128, 128, 0], olivedrab: [107, 142, 35],
  orange: [255, 165, 0], orangered: [255, 69, 0], orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170], palegreen: [152, 251, 152], paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147], papayawhip: [255, 239, 213], peachpuff: [255, 218, 185],
  peru: [205, 133, 63], pink: [255, 192, 203], plum: [221, 160, 221],
  powderblue: [176, 224, 230], purple: [128, 0, 128], rebeccapurple: [102, 51, 153],
  red: [255, 0, 0], rosybrown: [188, 143, 143], royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19], salmon: [250, 128, 114], sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87], seashell: [255, 245, 238], sienna: [160, 82, 45],
  silver: [192, 192, 192], skyblue: [135, 206, 235], slateblue: [106, 90, 205],
  slategray: [112, 128, 144], slategrey: [112, 128, 144], snow: [255, 250, 250],
  springgreen: [0, 255, 127], steelblue: [70, 130, 180], tan: [210, 180, 140],
  teal: [0, 128, 128], thistle: [216, 191, 216], tomato: [255, 99, 71],
  turquoise: [64, 224, 208], violet: [238, 130, 238], wheat: [245, 222, 179],
  white: [255, 255, 255], whitesmoke: [245, 245, 245], yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50],
}

function nearestColorName(R: number, G: number, B: number): string {
  let minDist = Infinity
  let nearest = 'N/A'
  for (const [name, [cr, cg, cb]] of Object.entries(CSS_NAMED)) {
    const dist = (R - cr) ** 2 + (G - cg) ** 2 + (B - cb) ** 2
    if (dist < minDist) {
      minDist = dist
      nearest = name
      if (dist === 0) break
    }
  }
  return nearest
}

function n(v: number | undefined, decimals = 0): string {
  const val = v ?? 0
  return isNaN(val) ? '0' : val.toFixed(decimals)
}

function pct(v: number | undefined): string {
  const val = v ?? 0
  return isNaN(val) ? '0' : String(Math.round(val * 100))
}

export function convertColor(input: string): ColorFormats | null {
  const parsed = parse(input.trim())
  if (!parsed) return null

  const rgb = toRgb(parsed)
  if (!rgb) return null

  const R = Math.round((rgb.r ?? 0) * 255)
  const G = Math.round((rgb.g ?? 0) * 255)
  const B = Math.round((rgb.b ?? 0) * 255)

  // HEX
  const hex = formatHex(parsed) ?? '#000000'

  // RGB
  const rgbStr = `rgb(${R}, ${G}, ${B})`

  // HSL — culori: h in 0-360, s/l in 0-1
  const hsl = toHsl(parsed)
  const hslStr = `hsl(${n(hsl?.h)}, ${pct(hsl?.s)}%, ${pct(hsl?.l)}%)`

  // HSV — culori: h in 0-360, s/v in 0-1
  const hsv = toHsv(parsed)
  const hsvStr = `hsv(${n(hsv?.h)}, ${pct(hsv?.s)}%, ${pct(hsv?.v)}%)`

  // CMYK from linear RGB
  const rn = rgb.r ?? 0, gn = rgb.g ?? 0, bn = rgb.b ?? 0
  const k = 1 - Math.max(rn, gn, bn)
  const denom = 1 - k
  const c = denom === 0 ? 0 : (1 - rn - k) / denom
  const m = denom === 0 ? 0 : (1 - gn - k) / denom
  const y = denom === 0 ? 0 : (1 - bn - k) / denom
  const cmykStr = `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`

  // HWB — culori: h in 0-360, w/b in 0-1
  const hwb = toHwb(parsed)
  const hwbStr = `hwb(${n(hwb?.h)} ${pct(hwb?.w)}% ${pct(hwb?.b)}%)`

  // LAB (CIE D50) — culori: l in 0-100, a/b unbounded
  const lab = toLab(parsed)
  const labStr = `lab(${n(lab?.l, 1)}, ${n(lab?.a, 1)}, ${n(lab?.b, 1)})`

  // LCH (CIE D50) — culori: l in 0-100, c unbounded, h in 0-360
  const lch = toLch(parsed)
  const lchStr = `lch(${n(lch?.l, 1)}, ${n(lch?.c, 1)}, ${n(lch?.h, 1)})`

  // XYZ D65 — culori: x/y/z in approx 0-1
  const xyz = toXyz(parsed)
  const xyzStr = `xyz(${n(xyz?.x, 3)}, ${n(xyz?.y, 3)}, ${n(xyz?.z, 3)})`

  // Nearest CSS named color
  const name = nearestColorName(R, G, B)

  return { hex, rgb: rgbStr, hsl: hslStr, hsv: hsvStr, cmyk: cmykStr, hwb: hwbStr, lab: labStr, lch: lchStr, xyz: xyzStr, name }
}
