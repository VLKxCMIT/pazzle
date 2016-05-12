function GamePuzzle(options) {
    this.options = options.imgUrl ? options.imgUrl : this.options;
    this.options = options.mashSizeX ? options.mashSizeX : this.options;
    this.options = options.mashSizeY ? options.mashSizeY : this.options;
    this.options = options.puzzleGameContainer ? options.puzzleGameContainer : this.puzzleGameContainer;
}

GamePuzzle.prototype = {
    imgUrl: 'img/img1.jpg',
    mashSizeX: 10,
    mashSizeY: 10,
    puzzleGameContainer: '#gamePuzzles',

    previewImgContainer: '#gameCurrentImg',
    puzzleImageWidth: null,
    puzzleImageHeight: null,
    puzzleBoxWidth: 1800,
    puzzleBoxHeight: 700,
    constructor: GamePuzzle,

    createGame: function () {
        this.createPreviewImages();
        this.createPuzzlesBox();
        // create control buttons
        this.calcPuzzleSize();
        // generate puzzles
    },

    createPreviewImages: function () {
        $(this.puzzleGameContainer).append('<div id="gameCurrentImg"><img src="' + this.imgUrl + '"></div>');
        $(this.previewImgContainer).css({
            'display': 'block',
            'position': 'absolute',
            'width': '100%',
            'top': '-2000px'
        });
    },

    createPuzzlesBox: function () {
        $(this.puzzleGameContainer).append('<div id="puzzlesBox"></div>');
        $('#puzzlesBox').css({
            'display': 'block',
            'box-shadow': '0 0 10px 0 brown',
            'width': '800px',
            'height': '500px'
        });
    },

    calcPuzzleSize: function () {
        var self = this;
        $(this.previewImgContainer).find('img').load(function () {
            self.puzzleImageWidth = $(this).width();
            self.puzzleImageHeight = $(this).height();
            console.log('URL картинки: ' + self.imgUrl);
            console.log('Расположение картинки: ' + self.previewImgContainer);
            console.log('Разрешение: ' + self.puzzleImageWidth + 'x' + self.puzzleImageHeight);
            console.log('Размер сетки: ' + self.mashSizeX + 'x' + self.mashSizeY);
            console.log('Расположение игры: ' + self.puzzleGameContainer);
        });
    }
};