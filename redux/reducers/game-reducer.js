import _ from 'lodash';

var winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
var stones = {
    x: 'x',
    o: 'o'
};
var winningCombination = [];
var initialState = {
    draw: false,
    nextStone: stones.x,
    tiles: ['','','','','','','','',''],
    winner: '',
    winningCombination: []
};
var isThereAWinner = function (combination, stone, stateTiles) {
    return _.every(combination, function(tile) {
        return stateTiles[tile] === stone;
    });
};

var checkForWinners = function (newState) {
    var winner = '';

    _.map(winningCombinations, function (combination) {
        if (isThereAWinner(combination, stones.x, newState.tiles)) {
            winner = stones.x;
            winningCombination = combination;
        } else if (isThereAWinner(combination, stones.o, newState.tiles)) {
            winner = stones.o;
            winningCombination = combination;
        }
    });

    return winner;
};

export default function (state, action) {
    var newState = _.cloneDeep(state);

    if (!newState) {
        newState = _.cloneDeep(initialState);
    }

    switch (action.type) {
        case 'add_stone':
            if (!newState.tiles[action.tileId]) {
                newState.tiles[action.tileId] = newState.nextStone;

                if (action.currentStone === stones.x) {
                    newState.nextStone = stones.o;
                } else {
                    newState.nextStone = stones.x;
                }

                let filteredTiles = _.filter(newState.tiles, value => !_.isEmpty(value));

                if (filteredTiles.length > 4) {
                    newState.winner = checkForWinners(newState);

                    if (winningCombination.length) {
                        newState.winningCombination = winningCombination;
                    }

                    if (filteredTiles.length === newState.tiles.length && !newState.winner) {
                        newState.draw = true;
                    }
                }
            }

            return newState;

        case 'reset_game':
            winningCombination = [];

            return initialState;

        default: return newState || initialState;
    }
}
