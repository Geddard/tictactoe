var actions = {
    addStone: function(tileId){
        return {
            type: 'add_stone',
            tileId: tileId
        };
    },
    switchStone: function (currentStone) {
        dispatch({
            type: 'switch_stone',
            currentStone: currentStone
        });
    },
    setScore: function(type) {
        dispatch({
            type: 'set_score',
            type: type
        });
    }
}

export default actions;
export var addStone = actions.addStone;
export var setScore = actions.setScore;
