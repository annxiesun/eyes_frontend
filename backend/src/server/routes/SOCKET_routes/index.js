'use strict';

const io = require('socket.io')();
const eventHandlers = require('./eventHandlers');

const {
  BOTH_CHEAT,
  BOTH_GOOD,
  ONE_CHEAT,
  NOT_ENOUGH,
} = require('../../constants/constants');

io.on('connection', (socket) => {
  let clients = eventHandlers.addToDB(socket.id);
  const connectedClients = () => clients.length;

  socket.on('/root/new_socket_connected', () => {
    const clientCount = connectedClients();
    socket.emit('/root/welcome', { id: socket.id });
    io.sockets.emit('root/update_socket_count', { clientCount });
  });

  socket.on('/root/cheat', (data) => {
    const { id } = data;

    eventHandlers.addCheat(id).then(() => {
      eventHandlers.getClientAction().then((res) => {
        switch (res.clientAction) {
        case NOT_ENOUGH:
          console.log('Not enough actions');
          return;
        case ONE_CHEAT:
          io.sockets.emit('/root/cheated', res);
          break;
        case BOTH_CHEAT:
          io.sockets.emit('/root/both_cheated', res);
          break;
        case BOTH_GOOD:
          io.sockets.emit('/root/done_good', res);
        }
      });
    });
  });

  socket.on('/root/good', (data) => {
    const { id } = data;
  
    eventHandlers.addGood(id).then(() => {
      eventHandlers.getClientAction().then((res) => {
        switch (res.clientAction) {
        case NOT_ENOUGH:
          console.log('Not enough actions');
          return;
        case ONE_CHEAT:
          io.sockets.emit('/root/cheated', res);
          break;
        case BOTH_CHEAT:
          io.sockets.emit('/root/both_cheated', res);
          break;
        case BOTH_GOOD:
          io.sockets.emit('/root/done_good', res);
        }
      });
    });
  });

  socket.on('disconnect', () => {
    clients = eventHandlers.onClientDisconnect(socket.id);
    const clientCount = connectedClients();
    socket.broadcast.emit('root/update_socket_count', { clientCount });
  });
});

module.exports = io;
