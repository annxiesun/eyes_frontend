'use strict';

// Mock database, replace this with your db models, required to perform query to your database.

const actionQueue = () => {
  const actions = [];
  let locked = false;

  // cheatOrGood = "CHEAT" or "GOOD" consts
  const addAction = (cheatOrGood) => {
    return new Promise(function (res) {
      let count = 0;
      while (locked) {
        count += 1;
        if (count > 1000) break;
        continue;
      }
    
      locked = true;
      console.log('locked', actions);
      actions.push(cheatOrGood);
      console.log('addAction', actions);
      res();
    }).then(() => {
      console.log('unlocked');
      locked = false;
    });
  };

  const popTwo = () => {
    return new Promise(function (res) {
      let count = 0;
      while (locked) {
        count += 1;
        if (count > 1000) break;
        continue;
      }
    
      locked = true;

      if (actions.length < 2) {
        console.log('poptwo null');
        res([null, null]);
      }
      else {
        const a1 = actions.pop();
        const a2 = actions.pop();
  
        console.log('poptwo', a1, a2);
        res([a1,a2]);
      }
    }).then((res) => {
      locked = false;
      console.log('unlocked');
      return res;
    });
      
  }; 

  return {
    actions,
    addAction,
    popTwo
  };
};

module.exports = actionQueue();