$(function () {
    var gamePuzzle = new GamePuzzle({
        imgUrl: 'img/img1.jpg',
        mashSizeX: 4,
        mashSizeY: 4,
        puzzleGameContainer: '#gamePuzzles',
        puzzleContainer: '#puzzlesBox',
        admission: 30
    });
    gamePuzzle.createGame();
    $(gamePuzzle.previewImgContainer).find('img').load(function () {
        var iX = 0;
        var iY = 0;
        for (var i = 1; i <= gamePuzzle.mashSizeX * gamePuzzle.mashSizeY; i++) {
            var puzzle = new Puzzle({
                container: '#puzzlesBox',
                puzzle: '.puzzle[data-id=' + i + ']',
                id: i,
                x: 0,
                y: 0,
                width: gamePuzzle.puzzleImageWidth / gamePuzzle.mashSizeX,
                height: gamePuzzle.puzzleImageHeight / gamePuzzle.mashSizeY,
                backgroundUrl: gamePuzzle.imgUrl,
                backgroundX: gamePuzzle.puzzleImageWidth / gamePuzzle.mashSizeX * -1 * iX,
                backgroundY: gamePuzzle.puzzleImageHeight / gamePuzzle.mashSizeY * -1 * iY,
                callback: function () {
                    gamePuzzle.coordinateReception(this);
                }
            });
            if (iX >= gamePuzzle.mashSizeX - 1) {
                iX = 0;
                iY++;
            } else {
                iX++;
            }
        }
    });
});