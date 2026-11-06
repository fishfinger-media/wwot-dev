/**
 * Vector / CSS re-creations of the small GIF animations, per the motion report.
 * Shapes are deliberately simple two-tone silhouettes in the illustration palette.
 * The painterly grain of the originals is NOT reproduced; swap the paths for the
 * illustrator's SVGs when available, the animation CSS (hero.css, .vm-*) will still apply.
 */
// Sausage: flies in from bottom-left on an arc, rotating, three motion lines behind, 2.2 s rest.
export const sausageSVG = `
<svg class="wh-vm wh-vm-sausage" viewBox="0 0 301 167" aria-hidden="true">
  <g class="wh-vm-sausage__body">
    <rect x="-40" y="-14" width="80" height="28" rx="14" fill="#c8362b"/>
    <rect x="-28" y="-8" width="12" height="6" rx="3" fill="#e8604f"/>
    <g class="wh-vm-sausage__lines" stroke="#c8362b" stroke-width="3" stroke-linecap="round" opacity=".6">
      <line x1="-60" y1="-2" x2="-80" y2="-6"/><line x1="-58" y1="6" x2="-82" y2="8"/><line x1="-56" y1="14" x2="-76" y2="20"/>
    </g>
  </g>
</svg>`;

// Sun (a pizza): a wedge slides out, a bite appears, it slides back.
export const sunSVG = `
<svg class="wh-vm wh-vm-sun" viewBox="0 0 326 291" aria-hidden="true">
  <defs>
    <clipPath id="vm-sun-rest"><path d="M150 120 L295 120 A145 145 0 1 1 150 120 Z"/></clipPath>
  </defs>
  <circle cx="150" cy="120" r="115" fill="#fdf2c8" clip-path="url(#vm-sun-rest)"/>
  <g class="wh-vm-sun__wedge">
    <path d="M150 120 L265 120 A115 115 0 0 1 231 201 Z" fill="#fdf2c8"/>
    <circle class="wh-vm-sun__bite" cx="262" cy="150" r="22" fill="#fce266"/>
  </g>
</svg>`;

// Milk bottle: pops up, tips over, pours a wavy stream, rights itself, shrinks away.
export const milkSVG = `
<svg class="wh-vm wh-vm-milk" viewBox="0 0 147 157" aria-hidden="true">
  <g class="wh-vm-milk__bottle">
    <path d="M55 150 L55 70 Q55 52 66 44 L66 30 L82 30 L82 44 Q93 52 93 70 L93 150 Z" fill="#d8fbff"/>
    <rect x="55" y="96" width="38" height="20" fill="#7ad5e0"/>
    <path class="wh-vm-milk__stream" d="M74 30 q6 10 0 20 t0 20 t0 20 t0 20 t0 20" stroke="#f5feff" stroke-width="7" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;

