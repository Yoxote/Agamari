
/*----------  INITIAL STATE  ----------*/
const initialState = {
  room1: { color : 'red', players: {}, food:{}},
  room2: { color: 'pink', players: {}, food:{}}
};

/*----------  ACTION TYPES  ----------*/
const RECEIVE_GAMESTATE = 'RECEIVE_GAMESTATE';
const UPDATE_COLOR = 'UPDATE_COLOR';
const ADD_PLAYER = 'ADD_PLAYER';
const UPDATE_LOCATION = 'UPDATE_LOCATION';
const REMOVE_PLAYER = 'REMOVE_PLAYER';
const CREATE_FOOD = 'CREATE_FOOD';
const REMOVE_FOOD_AND_ADD_MASS = 'REMOVE_FOOD_AND_ADD_MASS';

/*----------  ACTION CREATORS  ----------*/
 module.exports.receiveGameState = (state, room) => ({
  type: RECEIVE_GAMESTATE, room,
  state
});

 module.exports.updateColor = (color, room) => ({
  type: UPDATE_COLOR, room,
  color
});

 module.exports.addPlayer = (id, data, room) => ({
  type: ADD_PLAYER,
  id,
  data,
  room
});

module.exports.updateLocation = (player, room) => ({
  type: UPDATE_LOCATION,
  id,
  data,
  room
});

 module.exports.removePlayer = (id, room) => ({
  type: REMOVE_PLAYER, room, id
});

 module.exports.removeFoodAndAddMass = (id, foodId, room) => ({
  type: REMOVE_FOOD_AND_ADD_MASS,
  id,
  foodId,
  room
});

 module.exports.createFood = (id, xPostion,zPostion,foodShape, room) => ({
  type:CREATE_FOOD, id, xPostion, zPostion, foodShape, room
});


/*----------  THUNK CREATORS  ----------*/

/*----------  REDUCER  ----------*/
module.exports.reducer = (state = initialState, action) => {
  //console.log("state:", state, "action:", action)
  let room = {};
  let newState, players;
  switch (action.type) {
    case UPDATE_COLOR:
      room = Object.assign({}, state[action.room], {color: action.color});
      newState = Object.assign({}, state);
      newState[action.room] = room;
      return newState;
    case ADD_PLAYER:
      if (state[action.room]) state[action.room].players[action.id] = action.data;
      return state;
    case REMOVE_PLAYER:
      if (state[action.room]) delete state[action.room].players[action.id];
      return state;
    case REMOVE_FOOD_AND_ADD_MASS:
      if (state[action.room]){
        state[action.room].players[action.id].scale += 0.1;
        delete state[action.room].food[action.foodId];
      } 
      return state;
    case UPDATE_LOCATION:
      if (state[action.room]) state[action.room].players[action.id] = action.data;
      return state;
    case RECEIVE_GAMESTATE:
      //WHY EMPTY?
      break;
    case CREATE_FOOD:
      if (state[action.room]) state[action.room].food[action.id] = {x:action.xPostion, z: action.zPostion, type:action.foodShape};
      return state;

    default: return state;

  }
};
