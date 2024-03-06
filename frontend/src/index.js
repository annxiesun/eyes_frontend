// Import a module that was installed with npm
import p5 from 'p5'

// Import a variable from a JavaScript file from the project folder
import { mySketch } from './sketch.js'
// Import CSS styles in JavaScript
import './index.css'

// Initialize p5.js
// p5 requires two arguments: new p5(sketch function, target DOM element)

//uncomment soon
new p5(mySketch, document.getElementById('sketch'))

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

// const form = document.querySelector('#form');
// const input = document.querySelector('#chat-message');
// const button = document.querySelector('#chat-button');
// const socketCount = document.querySelector('#socket-count');
// const clientId = document.querySelector('#socket-id');
// const homeLink = document.querySelector('#home-section-link');
// const docsLink = document.querySelector('#documentation-link');
// const homeSection = document.querySelector('#home-section');
// const docsSection = document.querySelector('#documentation');

// const socket = io('http://localhost:5000');
// socket.emit('/root/new_socket_connected');

// // Socket events
// // Whenever the server emits '/root/welcome' event, update website
// socket.on('/root/welcome', welcomeUser);
// // Whenever the server emits '/root/update_socket_count' event, updates number of sockets connected
// socket.on('root/update_socket_count', updateSocketCount);
// // Whenever the server emits '/root/update_chat' event, add message to the chat
// socket.on('/root/update_chat', addMessage);

// // Socket event handlers
// function addMessage (data) {
//   const { message, sender } =  data;
//   const text = document.createTextNode(message);
//   const listItem = document.createElement('li');
//   sender === 'user'
//     ? listItem.classList.add('list-item', 'right')
//     : listItem.classList.add('list-item', 'left');
//   listItem.style.backgroundColor = `rgba(${randomColor()},${randomColor()},${randomColor()}, .5)`;
//   const chat = document.getElementById('chat-list');
//   listItem.appendChild(text);
//   sender === 'user'
//     ? setTimeout(() => chat.appendChild(listItem), 200)
//     : setTimeout(() => chat.appendChild(listItem), 1000);
// }

// function welcomeUser (data) {
//   const { message, sender, id } = data;
//   addMessage({ message, sender });
//   clientId.innerHTML = id;
// }

// function updateSocketCount (data) {
//   const { clientCount } = data;
//   socketCount.innerHTML = clientCount;
// }

// // Sends a chat message to the server
// function sendMessage (e) {
//   e.preventDefault();
//   const value = input.value;
//   addMessage({message: value, sender: 'user'});
//   input.value = '';
//   socket.emit('/root/new_message', value);
// }

// function randomColor () {
//   return Math.floor(Math.random()*255);
// }

// // Reactive elements > Event listeners
// form.addEventListener('submit', sendMessage);
// button.addEventListener('click', sendMessage);