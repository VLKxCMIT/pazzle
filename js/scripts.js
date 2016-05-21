$(function () {
    var gamePuzzle = new GamePuzzle({
        imgUrl: 'img/img1.jpg',
        mashSizeX: 5,
        mashSizeY: 5,
        puzzleGameContainer: '#gamePuzzles',
        puzzleContainer: '#puzzlesBox',
        stickingThreshold: 70
    });
    gamePuzzle.createGame();
});