'use strict';

const actionQueue = require('../../models/actionQueue.models');
const userModel = require('../../models/user.models');
const { CHEAT, GOOD, BOTH_CHEAT, BOTH_GOOD, ONE_CHEAT, NOT_ENOUGH } = require('../../constants/constants');

//Event handlers
exports.addToDB = (id) => {
  try {
    return addUser(id);
  } catch (error) {
    console.error(error);
  }
};

exports.welcomeClient  = () => { };

// ONE_CHEAT | BOTH_CHEAT | BOTH_GOOD | NOT_ENOUGH

exports.getClientAction = () => {
  try {
    const popped = actionQueue.popTwo();
    return popped.then((res) => {
      const [a1, a2] = res;
      if (!a1) return NOT_ENOUGH;
    
      if (a1 == GOOD && a2 == GOOD) {
        return  BOTH_GOOD;
      } else if (a1 == CHEAT && a2 == CHEAT) {
        return BOTH_CHEAT;
      }
      return ONE_CHEAT;
    });
    // if (!a1) return NOT_ENOUGH;
  
    // if (a1 == GOOD && a2 == GOOD) {
    //   return  BOTH_GOOD;
    // } else if (a1 == CHEAT && a2 == CHEAT) {
    //   return BOTH_CHEAT;
    // }
    // return ONE_CHEAT;
  
  } catch (error) {
    console.error(error);
  }
};

exports.addCheat = () => {
  return actionQueue.addAction(CHEAT);
};

exports.addGood = () => {
  return actionQueue.addAction(GOOD);
};

exports.onClientDisconnect = (id) => {
  const updatedClientList = removeUser(id);
  return updatedClientList;
};

//Helper functions

function addUser (id) {
  userModel.main_room.push({ id, messageCount: 0 });
  return userModel.main_room;
}

function removeUser (id) {
  let index = userModel.main_room.map(el => el.id).indexOf(id);
  userModel.main_room.splice(index, 1);
  return userModel.main_room;
}

function getMessageCount (id) {
  const length = messageModel.chatMessages.length;
  const user = userModel.main_room.find(el => el.id === id);
  const messageCount = user.messageCount;
  messageCount < length - 1
    ? user.messageCount++ : user.messageCount;
  return messageCount;
}