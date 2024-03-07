import { myP5Sketch } from ".";

/*************************************************/

let allowNextTint = true;
const nextTintQueue = [];

const setAllowNextToFalse = () => {
  allowNextTint = false;
  const timeout = setTimeout(() => {
    if(nextTintQueue.length == 0) {
      allowNextTint = true;
    } else {
      console.log("popped!")
      const next = nextTintQueue.pop()
      myP5Sketch.setTint(next);
      clearTimeout(timeout);
      setAllowNextToFalse();
    }
  }, 10000)
}

const tryToApplyTint = (t) => {
  if(allowNextTint) {
    myP5Sketch.setTint(t)
    setAllowNextToFalse()
  } else {
    nextTintQueue.push(t)
  }
}
/*************************************************/

const cheatBtn = document.querySelector('#cheatBtn');
const goodBtn = document.querySelector('#goodBtn');

const socket = io('https://da35-2620-101-f000-700-0-6e15-dee0-a4c5.ngrok-free.app', {
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

/********** HANDLE ACTIONS *********************/
socket.on('/root/cheated', onCheated);
socket.on('/root/done_good', onGood);
socket.on('/root/both_cheated', onBothCheated);

function onCheated() {
  tryToApplyTint([255,0,0])
  console.log("Someone Cheated")
}

function onGood() {
  tryToApplyTint([0,255,255])
  console.log("Both did good")
}


function onBothCheated() {
  tryToApplyTint([255,0,0])
  console.log("Both cheated")
}

/***********************************/
function welcomeUser (data) {
  const { message, sender, id } = data;
  // addMessage({ message, sender });
  console.log("SOCKET ID:", id);
}

function updateSocketCount (data) {
  const { clientCount } = data;
  console.log("CLIENT COUNT:", clientCount);
}

