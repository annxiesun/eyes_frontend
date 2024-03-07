
// Import CSS styles in JavaScript
import "./socket.js"
// Initialize p5.js
// p5 requires two arguments: new p5(sketch function, target DOM element)

// Enable live reload while developing (https://esbuild.github.io/api/#live-reload)
if (process.env.NODE_ENV !== 'production') {
  new EventSource('/esbuild').addEventListener('change', () =>
    location.reload(),
  )
}

console.log(window.location.pathname)