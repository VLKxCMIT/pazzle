function GamePuzzle(options) {
    this.imgUrl = options.imgUrl ? options.imgUrl : this.imgUrl;
    this.mashSizeX = options.mashSizeX ? options.mashSizeX : this.mashSizeX;
    this.mashSizeY = options.mashSizeY ? options.mashSizeY : this.mashSizeY;
    this.puzzleGameContainer = options.puzzleGameContainer ? options.puzzleGameContainer : this.puzzleGameContainer;
    this.puzzleContainer = options.puzzleContainer ? options.puzzleContainer : this.puzzleContainer;
    this.admission = options.admission ? options.admission : this.admission;
}

GamePuzzle.prototype = {
    imgUrl: 'img/img1.jpg',
    mashSizeX: 2,
    mashSizeY: 2,
    puzzleGameContainer: '#gamePuzzles',
    puzzleContainer: '#puzzlesBox',
    admission: 10,

    previewImgContainer: '#gameCurrentImg',
    puzzleImageWidth: null,
    puzzleImageHeight: null,
    puzzleBoxWidth: null,
    puzzleBoxHeight: null,
    width: 0,
    height: 0,
    currentPuzzleX: 0,
    currentPuzzleY: 0,
    constructor: GamePuzzle,

    createGame: function () {
        this.createPreviewImages();
        var self = this;
        $(this.previewImgContainer).find('img').load(function () {
            // render control buttons
            self.calcPreviewImgAndPuzzleBoxSize();
            self.createPuzzlesBox();
            self.slideUpPreviewImg();
        });
    },

    createPreviewImages: function () {
        $(this.puzzleGameContainer).append('<div id="gameCurrentImg"><img src="' + this.imgUrl + '"></div>');
        $(this.previewImgContainer).css({
            'display': 'block',
            'position': 'absolute',
            'top': '0',
            'transition': 'top 1s ease-in-out',
            '-webkit-transition': 'top 1s ease-in-out',
            '-moz-transition': 'top 1s ease-in-out',
            '-o-transition': 'top 1s ease-in-out',
            'z-index': 3
        });
    },

    calcPreviewImgAndPuzzleBoxSize: function () {
        this.puzzleImageWidth = $(this.previewImgContainer).find('img').width();
        this.puzzleImageHeight = $(this.previewImgContainer).find('img').height();
        this.puzzleBoxWidth = this.puzzleImageWidth + 100;
        this.puzzleBoxHeight = this.puzzleImageHeight + 100;
        this.width = this.puzzleImageWidth / this.mashSizeX;
        this.height = this.puzzleImageHeight / this.mashSizeY;
    },

    slideUpPreviewImg: function () {
        $(this.previewImgContainer).css({
            'top': 0 - this.puzzleImageHeight + 'px'
        });
    },

    createPuzzlesBox: function () {
        $(this.puzzleGameContainer).append('<div id="puzzlesBox"></div>');
        $(this.puzzleContainer).css({
            'display': 'block',
            'margin': '10px auto',
            'box-shadow': '0 0 10px 0 brown',
            'font-size': 0,
            'width': this.puzzleBoxWidth,
            'height': this.puzzleBoxHeight,
            'min-width': this.puzzleImageWidth,
            'min-height': this.puzzleImageHeight
        });
    },

    coordinateReception: function (currentPuzzle) {
        this.currentPuzzleX = $('[data-id="' + currentPuzzle.id + '"]').offset().left;
        this.currentPuzzleY = $('[data-id="' + currentPuzzle.id + '"]').offset().top;
        this.reception(currentPuzzle);
    },

    reception: function (currentPuzzle) {
        if (this.topCheck(currentPuzzle.id)) {
            var id = currentPuzzle.id - this.mashSizeX;
            var x = $('[data-id="' + id + '"]').offset().left;
            var y = $('[data-id="' + id + '"]').offset().top + this.height;
            currentPuzzle.move(x, y);
            return;
        } else if (this.rightCheck(currentPuzzle.id)) {
            var id = currentPuzzle.id + 1;
            var x = $('[data-id="' + id + '"]').offset().left - this.width;
            var y = $('[data-id="' + id + '"]').offset().top;
            currentPuzzle.move(x, y);
            return;
        } else if (this.bottomCheck(currentPuzzle.id)) {
            var id = currentPuzzle.id + this.mashSizeX;
            var x = $('[data-id="' + id + '"]').offset().left;
            var y = $('[data-id="' + id + '"]').offset().top - this.height;
            currentPuzzle.move(x, y);
            return;
        }else if (this.leftCheck(currentPuzzle.id)) {
            var id = currentPuzzle.id - 1;
            var x = $('[data-id="' + id + '"]').offset().left + this.width;
            var y = $('[data-id="' + id + '"]').offset().top;
            currentPuzzle.move(x, y);
            return;
        }
    },

    topCheck: function (id) {
        if (this.mashSizeY == 1) {
            return false;
        }
        var index = id - this.mashSizeX;
        if (index > 0) {
            var x = $('[data-id="' + index + '"]').offset().left;
            var y = $('[data-id="' + index + '"]').offset().top;
            return  Math.abs(x - this.currentPuzzleX) < this.admission &&
                    Math.abs(y + this.height - this.currentPuzzleY) < this.admission;
        }
        return false;
    },

    rightCheck: function (id) {
        if (this.mashSizeX == 1) {
            return false;
        }
        if (id % this.mashSizeX > 0) {
            var index = id + 1;
            var x = $('[data-id="' + index + '"]').offset().left;
            var y = $('[data-id="' + index + '"]').offset().top;
            return  Math.abs(this.currentPuzzleX + this.width - x) < this.admission &&
                    Math.abs(this.currentPuzzleY - y) < this.admission;
        }
        return false;
    },

    bottomCheck: function (id) {
        if (this.mashSizeY == 1) {
            return false;
        }
        var index = id + this.mashSizeX;
        if (index <= this.mashSizeX * this.mashSizeY) {
            var x = $('[data-id="' + index + '"]').offset().left;
            var y = $('[data-id="' + index + '"]').offset().top;
            return  Math.abs(x - this.currentPuzzleX) < this.admission &&
                    Math.abs(y - this.currentPuzzleY - this.height) < this.admission;
        }
        return false;
    },

    leftCheck: function (id) {
        if (this.mashSizeX == 1) {
            return false;
        }
        var rowIndex = id % this.mashSizeX;
        if (rowIndex == 0 || rowIndex > 1) {
            var index = id - 1;
            var x = $('[data-id="' + index + '"]').offset().left;
            var y = $('[data-id="' + index + '"]').offset().top;
            return  Math.abs(this.currentPuzzleX - this.width - x) < this.admission &&
                    Math.abs(this.currentPuzzleY - y) < this.admission;
        }
        return false;
    }
};