/**
 * Clouds.
 * The Webflow page inlined ~50 cloud SVGs (2.7 MB of HTML) that were only 3 shapes.
 * Here each shape lives once in a <symbol id="cloud-1|2|3"> (a Webflow embed on the page);
 * every cloud is a <use> coloured by CSS.
 * Cloud tracks are described in markup as data-clouds="shape:fill:widthRem,..."
 * and duplicated once so the marquee loops without a seam.
 */
const RATIO = { 1: 204 / 491, 2: 78 / 182, 3: 59 / 140 };

export function initClouds() {
  document.querySelectorAll('.wh-cloud-track[data-clouds]').forEach((track) => {
    const spec = track.dataset.clouds.split(',').map((s) => s.trim()).filter(Boolean);
    const html = spec
      .map((item, i) => {
        const [shape, fill, w] = item.split(':');
        const width = parseFloat(w);
        const height = width * RATIO[shape];
        const lift = [0, 30, 0, 70, 0, 49][i % 6]; // vertical scatter, from the original per-cloud transforms
        return `<svg class="wh-cloud wh-is-${i + 1}" style="width:${width}rem;height:${height.toFixed(2)}rem;fill:#${fill};transform:translateY(${lift}%)" viewBox="0 0 ${shape === '1' ? '491 204' : shape === '2' ? '182 78' : '140 59'}" aria-hidden="true"><use href="#cloud-${shape}"/></svg>`;
      })
      .join('');
    // two copies -> translateX(-50%) loops seamlessly
    track.innerHTML = html + html;
  });
}
