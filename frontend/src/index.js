// Import a module that was installed with npm
import p5 from 'p5'

// Import a variable from a JavaScript file from the project folder
import { mySketch } from './sketch.js'
// Import CSS styles in JavaScript
import "./socket.js"
// Initialize p5.js
// p5 requires two arguments: new p5(sketch function, target DOM element)

//uncomment soon
export const myP5Sketch = new p5(mySketch, document.getElementById('sketch'))
document.getElementById('sketch').addEventListener('click', () => {
  document.getElementById('sketch').requestFullscreen()
})


// Enable live reload while developing (https://esbuild.github.io/api/#live-reload)
if (process.env.NODE_ENV !== 'production') {
  new EventSource('/esbuild').addEventListener('change', () =>
    location.reload(),
  )
}

console.log(window.location.pathname)