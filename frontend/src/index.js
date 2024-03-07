// Import a module that was installed with npm
import p5 from 'p5'

// Import a variable from a JavaScript file from the project folder
import { mySketch } from './sketch.js'
// Import CSS styles in JavaScript
import './index.css'
import "./socket.js"
// Initialize p5.js
// p5 requires two arguments: new p5(sketch function, target DOM element)

//uncomment soon
// new p5(mySketch, document.getElementById('sketch'))
// document.getElementById('sketch').addEventListener('click', () => {
//   document.getElementById('sketch').requestFullscreen()
// })

// // Example: update the DOM
// setTimeout(() => {
//   document.getElementById('input').value = 'Edit me!'
// }, 2000)

// Enable live reload while developing (https://esbuild.github.io/api/#live-reload)
if (process.env.NODE_ENV !== 'production') {
  new EventSource('/esbuild').addEventListener('change', () =>
    location.reload(),
  )
}
