const fs = require('fs');
let html = fs.readFileSync('works.html', 'utf8');
const searchStr = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap" rel="stylesheet">';
let startIndex = html.indexOf(searchStr);
let endIndex = html.indexOf('    <!-- Smooth Scroll Wrapper -->');
if (startIndex !== -1 && endIndex !== -1) {
    let before = html.substring(0, startIndex + searchStr.length);
    let after = html.substring(endIndex);
    let insert = \\\n    <script src=\"https://unpkg.com/@phosphor-icons/web\"></script>\\n    <link rel=\"stylesheet\" href=\"./src/style.scss\" />\\n  </head>\\n  <body>\\n    <div class=\"cursor-glow\"></div>\\n    \\n    <!-- Floating Header -->\\n    <header class=\"luxury-header\">\\n      <div class=\"logo\">\\n        <img src=\"/logo-no-bg.png\" alt=\"Abuzar Motion\" />\\n      </div>\\n      <nav>\\n        <a href=\"/index.html\">Home</a>\\n        <a href=\"/index.html#about\">About</a>\\n        <a href=\"/index.html#experience\">Services</a>\\n        <a href=\"/works.html\">Works</a>\\n        <a href=\"https://wa.me/923018903542\" target=\"_blank\">Contact</a>\\n      </nav>\\n    </header>\\n\;
    fs.writeFileSync('works.html', before + insert + after);
    console.log('Fixed works.html');
}
