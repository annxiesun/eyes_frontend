import { myP5Sketch } from ".";

const socketCount = document.querySelector('#socket-count');
const clientId = document.querySelector('#socket-id');

const cheatBtn = document.querySelector('#cheatBtn');
const goodBtn = document.querySelector('#goodBtn');

const socket = io('https://c98b-99-209-52-138.ngrok-free.app', {
  extraHeaders: {
    "ngrok-skip-browser-warning": true
  }
});


socket.emit('/root/new_socket_connected');

// Socket events
// Whenever the server emits '/root/welcome' event, update website
socket.on('/root/welcome', welcomeUser);
// // Whenever the server emits '/root/update_socket_count' event, updates number of sockets connected
socket.on('root/update_socket_count', updateSocketCount);
// // Whenever the server emits '/root/update_chat' event, add message to the chat
// socket.on('/root/update_chat', addMessage);

/**** NEW STUFF *********************/
socket.on('/root/cheated', onCheated);
socket.on('/root/done_good', onGood);

function onCheated() {
  console.log("Someone Cheated")
}

function onGood() {
  console.log("Both did good")
  myP5Sketch.setFilter(myP5Sketch.GRAY);
}

/***********************************/
function welcomeUser (data) {
  const { message, sender, id } = data;
  // addMessage({ message, sender });
  clientId.innerHTML = id;
}

function updateSocketCount (data) {
  const { clientCount } = data;
  socketCount.innerHTML = clientCount;
}

