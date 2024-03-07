const localStorageAmountIfExist = parseInt(
  window.localStorage.getItem("moneyAmount")
);
let moneyAmount = localStorageAmountIfExist
  ? localStorageAmountIfExist
  : Math.floor(Math.random() * 50 - 50);

const localStorageIdIfExist = window.localStorage.getItem("fakePersonId");
const fakePersonId = localStorageIdIfExist
  ? localStorageIdIfExist
  : Math.floor(Math.random() * 1000 + 200);

window.localStorage.setItem("fakePersonId", fakePersonId);
window.localStorage.setItem("moneyAmount", moneyAmount);

let socketId;

const fakePersonIdLabel = document.querySelector("#personId");
fakePersonIdLabel.innerHTML = "Person #" + fakePersonId;

const amountLabel = document.querySelector("#amount");
amountLabel.innerHTML = moneyAmount;

const cheatBtn = document.querySelector("#cheatBtn");
const goodBtn = document.querySelector("#goodBtn");

const disabledDuration = 30000;

if (window.localStorage.getItem("buttonsDisabled") == "true") {
  cheatBtn.disabled = true;
  goodBtn.disabled = true;
  lockButtons();
}

const socket = io("https://c98b-99-209-52-138.ngrok-free.app", {
  extraHeaders: {
    "ngrok-skip-browser-warning": true,
  },
});

socket.emit("/root/new_socket_connected");

// Socket events
// Whenever the server emits '/root/welcome' event, update website
socket.on("/root/welcome", welcomeUser);
// // Whenever the server emits '/root/update_socket_count' event, updates number of sockets connected
socket.on("root/update_socket_count", updateSocketCount);
// // Whenever the server emits '/root/update_chat' event, add message to the chat
// socket.on('/root/update_chat', addMessage);

/********** HANDLE ACTIONS *********************/
socket.on("/root/cheated", onCheated);
socket.on("/root/done_good", onGood);
socket.on("/root/both_cheated", onBothCheated);

function onCheated(data) {
  const { cheater, people } = data;

  if (people.includes(socketId) && socketId == cheater) {
    moneyAmount += 10;
    changeColor("green");
  } else {
    moneyAmount -= 10;
    changeColor("red");
  }

  showNewAmount();
  console.log("Someone Cheated");
}

function onGood(data) {
  const { people } = data;
  if (people.includes(socketId)) {
    moneyAmount += 3;
    showNewAmount();
    changeColor("green");
    console.log("Both good");
  }
}

function onBothCheated(data) {
  const { people } = data;

  if (people.includes(socketId)) {
    changeColor("red");
    moneyAmount -= 3;
    showNewAmount();
    console.log("Both cheated");
  }

}

function showNewAmount() {
  amountLabel.innerHTML = moneyAmount;
}
/***********************************/
function welcomeUser(data) {
  const { id } = data;
  // addMessage({ message, sender });
  socketId = id;
  console.log("SOCKET ID:", id);
}

function updateSocketCount(data) {
  const { clientCount } = data;
  console.log("CLIENT COUNT:", clientCount);
}

// Sends a chat message to the server
function sendCheat(e) {
  e.preventDefault();
  console.log("I cheated");
  socket.emit("/root/cheat", { id: socketId });
  lockButtons();
}

function sendGood(e) {
  e.preventDefault();
  console.log("I did good");
  socket.emit("/root/good", { id: socketId });
  lockButtons();
}

function lockButtons() {
  console.log("lockign");
  window.localStorage.setItem("buttonsDisabled", true);
  cheatBtn.disabled = true;
  goodBtn.disabled = true;
  setTimeout(() => {
    window.localStorage.setItem("buttonsDisabled", false);
    cheatBtn.disabled = false;
    goodBtn.disabled = false;
  }, disabledDuration);
}

function changeColor(color) {
  amountLabel.style.color = color;
  setTimeout(() => {
    amountLabel.style.color = "white";
  }, 500);
}

// Reactive elements > Event listeners
cheatBtn.addEventListener("click", sendCheat);
goodBtn.addEventListener("click", sendGood);
