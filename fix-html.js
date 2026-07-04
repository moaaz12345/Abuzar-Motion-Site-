const fs = require('fs');
let html = fs.readFileSync('works.html', 'utf8');
html = html.replace(/<video class="portfolio-video" src="(\/video\\d+\\.mp4)" autoplay loop muted playsinline>\\s*preload="metadata"<\\/video>/g, (match, src) => {
    return '<div class="video-loader"></div>\\n                      <video class="portfolio-video lazy-video" data-src="' + src + '" autoplay loop muted playsinline preload="none"></video>';
});
fs.writeFileSync('works.html', html);
console.log('works.html updated for lazy loading!');
