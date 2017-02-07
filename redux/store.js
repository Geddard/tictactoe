import { createStore, combineReducers } from 'redux';
import gameReducer from 'redux/reducers/game-reducer';

var rootReducer = combineReducers({
    game: gameReducer
});

export default createStore(rootReducer);
