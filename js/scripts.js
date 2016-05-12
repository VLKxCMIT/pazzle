$(function () {
    var gamePuzzle = new GamePuzzle({
        imgUrl: 'img/img1.jpg',
        mashSizeX: 10,
        mashSizeY: 10,
        puzzleGameContainer: '#gamePuzzles'
    });
    gamePuzzle.createGame();
    var puzzle = new Puzzle({
        container: '#puzzlesBox',
        puzzle: '.puzzle',
        x: 0,
        y: 0,
        width: 96,
        height: 54,
        backgroundUrl: 'img/img1.jpg',
        backgroundX: 130,
        backgroundY: 330
    });
});