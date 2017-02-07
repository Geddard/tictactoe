var initialState = {
    draws: 0,
    nextStone: '⨯',
    oWins: 0,
    tiles: ['','','','','','','','',''],
    xWins: 0
};

export default function (state, action) {
    var newState = Object.assign({}, state);

    if (!state) {
        newState = Object.assign({}, initialState);
    }

    switch (action.type) {
        case 'add_stone':
            if (!newState.tiles[action.tileId]) {
                newState.tiles[action.tileId] = newState.nextStone;
            }

            return newState;

        case 'switch_stone':
            if (action.currentStone === '⨯') {
                newState.nextStone = '○';
            }

            return newState;

        case 'set_core':
            //TODO
            return newState;

        default: return newState || initialState;
    }
}
