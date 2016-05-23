$(function () {
    var gamePuzzle = new GamePuzzle({
        imgUrl: 'img/img1.jpg',
        mashSizeX: 3,
        mashSizeY: 1,
        puzzleGameContainer: '#gamePuzzles',
        puzzleContainer: '#puzzlesBox',
        stickingThreshold: 70,
        memento: new MemoryMemento()
    });
    gamePuzzle.createGame();
});