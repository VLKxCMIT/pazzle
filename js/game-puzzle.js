define([ 'jquery', 'puzzle' ], function($, Puzzle) {
    function GamePuzzle(options) {
        this.imgUrl = options.imgUrl ? options.imgUrl : this.imgUrl;
        this.mashSizeX = options.mashSizeX ? options.mashSizeX : this.mashSizeX;
        this.mashSizeY = options.mashSizeY ? options.mashSizeY : this.mashSizeY;
        this.puzzleGameContainer = options.puzzleGameContainer ? options.puzzleGameContainer : this.puzzleGameContainer;
        this.puzzleContainer = options.puzzleContainer ? options.puzzleContainer : this.puzzleContainer;
        this.stickingThreshold = options.stickingThreshold ? options.stickingThreshold : this.stickingThreshold;
        this.memento = options.memento ? options.memento : null;
    }

    GamePuzzle.prototype = {
        imgUrl: null,
        mashSizeX: 1,
        mashSizeY: 1,
        puzzleGameContainer: '#gamePuzzles',
        puzzleContainer: '#puzzlesBox',
        stickingThreshold: 10,
        memento: null,

        previewImgContainer: '#gameCurrentImg',
        puzzleImageWidth: null,
        puzzleImageHeight: null,
        puzzleBoxWidth: null,
        puzzleBoxHeight: null,
        puzzleBoxMargin: 15,
        mainCollection: [],
        constructor: GamePuzzle,

        createGame: function () {
            this.createPreviewImages();
            var self = this;
            $(this.previewImgContainer).find('img').load(function () {
                self.calcPreviewImgAndPuzzleBoxSize();
                self.createPuzzlesBox();
                self.slideUpPreviewImg();
                self.mainCollection = self.generatePuzzlesCollection();
                self.initGameControls();
            });
        },

        initGameControls: function () {
            // buttons...
            this.initUndoFeature();
        },

        initUndoFeature: function () {
            var self = this;
            $(document).keydown(function(e){
                e = e || window.event;
                if ((e.which == 90 || e.keyCode == 90) && e.ctrlKey) {
                    self.restoreState();
                    console.log('state restored');
                }
            });
        },

        restoreState: function () {
            if (this.memento) {
                var state = this.memento.getState();
                if (state) {
                    this.clearContainer();
                    this.mainCollection = this.generatePuzzlesCollectionByState(state);
                }
            }
        },

        saveState: function () {
            if (this.memento) {
                this.memento.setState(this.mainCollection);
            }
        },

        generatePuzzlesCollection: function () {
            var self = this;
            var iX = 0;
            var iY = 0;
            var puzzleCollection = [];
            for (var i = 1; i <= this.mashSizeX * this.mashSizeY; i++) {
                var puzzleWidth = this.puzzleImageWidth / this.mashSizeX;
                var puzzleHeight = this.puzzleImageHeight / this.mashSizeY;
                var puzzle = new Puzzle({
                    container: '#puzzlesBox',
                    puzzle: '.puzzle[data-id=' + i + ']',
                    id: i,
                    x: Math.floor(Math.random() * (this.puzzleBoxWidth - puzzleWidth - 15)) + 15, // depends on puzzle box width
                    y: Math.floor(Math.random() * (this.puzzleBoxHeight - puzzleHeight - this.puzzleBoxMargin)) + this.puzzleBoxMargin,
                    width: puzzleWidth,
                    height: puzzleHeight,
                    backgroundUrl: this.imgUrl,
                    backgroundX: this.puzzleImageWidth / this.mashSizeX * -iX,
                    backgroundY: this.puzzleImageHeight / this.mashSizeY * -iY,
                    mouseDownCallback: function() {
                        self.saveState();
                    },
                    mouseUpCallback: function () {
                        self.coordinateSticking(this);
                    },
                    mouseMoveCallback: function (deltaX, deltaY) {
                        self.moveCollectionByPuzzleExcludeSelf(this, deltaX, deltaY);
                    }
                });
                puzzleCollection[i - 1] = [puzzle];
                if (iX >= this.mashSizeX - 1) {
                    iX = 0;
                    iY++;
                } else {
                    iX++;
                }
            }
            return puzzleCollection;
        },

        generatePuzzlesCollectionByState: function (state) {
            var self = this;
            var puzzleCollection = [];
            for (var i = 0; i < state.length; i++) {
                var mainCollectionPuzzles = [];
                var statePuzzles = state[i];
                for (var j = 0; j < statePuzzles.length; j++) {
                    var puzzle = new Puzzle({
                        container: statePuzzles[j].container,
                        puzzle: statePuzzles[j].puzzle,
                        id: statePuzzles[j].id,
                        x: statePuzzles[j].x,
                        y: statePuzzles[j].y,
                        width: statePuzzles[j].width,
                        height: statePuzzles[j].height,
                        backgroundUrl: statePuzzles[j].backgroundUrl,
                        backgroundX: statePuzzles[j].backgroundX,
                        backgroundY: statePuzzles[j].backgroundY,
                        mouseDownCallback: function() {
                            self.saveState();
                        },
                        mouseUpCallback: function () {
                            self.coordinateSticking(this);
                        },
                        mouseMoveCallback: function (deltaX, deltaY) {
                            self.moveCollectionByPuzzleExcludeSelf(this, deltaX, deltaY);
                        }
                    });
                    mainCollectionPuzzles.push(puzzle);
                }
                puzzleCollection.push(mainCollectionPuzzles);
            }
            return puzzleCollection;
        },

        clearContainer: function() {
            $(this.puzzleContainer).empty();
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
            this.puzzleBoxWidth = $(window).width() - 30; //this.puzzleImageWidth
            this.puzzleBoxHeight = $(window).height() - 30; //this.puzzleImageHeight
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
                'margin': this.puzzleBoxMargin + 'px auto',
                'box-shadow': '0 0 10px 0 brown',
                'font-size': 0,
                'width': this.puzzleBoxWidth,
                'height': this.puzzleBoxHeight,
                'min-width': this.puzzleImageWidth,
                'min-height': this.puzzleImageHeight
            });
        },

        coordinateSticking: function (puzzle) {
            var puzzleCollection = this.findPuzzleCollection(puzzle.id);
            var stickingDelta = this.getStickingDelta(puzzleCollection);
            if (stickingDelta) {
                this.moveCollectionByPuzzle(puzzle, stickingDelta.deltaX, stickingDelta.deltaY);
                this.mergeCollections(stickingDelta.mergeCollection, puzzleCollection);
            }
        },

        moveCollectionByPuzzle: function (puzzle, deltaX, deltaY) {
            var puzzleCollection = this.findPuzzleCollection(puzzle.id);
            this.moveCollection(puzzleCollection, deltaX, deltaY, null);
        },

        moveCollectionByPuzzleExcludeSelf: function (puzzle, deltaX, deltaY) {
            var puzzleCollection = this.findPuzzleCollection(puzzle.id);
            this.moveCollection(puzzleCollection, deltaX, deltaY, puzzle);
        },

        moveCollection: function (puzzleCollection, deltaX, deltaY, excludePuzzle) {
            for (var i = 0; i < puzzleCollection.length; i++) {
                var puzzleItem = puzzleCollection[i];
                if (excludePuzzle != puzzleItem) {
                    puzzleItem.moveByDelta(deltaX, deltaY);
                }
            }
        },

        getStickingDelta: function (puzzleCollection) {
            var deltaX, deltaY;
            for (var i = 0; i < puzzleCollection.length; i++) {
                var puzzleItem = puzzleCollection[i];
                for (var j = 0; j < this.mainCollection.length; j++) {
                    var mainCollectionPuzzlesItem = this.mainCollection[j];
                    if (puzzleCollection == mainCollectionPuzzlesItem) {
                        continue;
                    }
                    for (var k = 0; k < mainCollectionPuzzlesItem.length; k++) {
                        var puzzleToCompare = mainCollectionPuzzlesItem[k];
                        if (this.topCheck(puzzleItem, puzzleToCompare)) {
                            deltaX = puzzleToCompare.x - puzzleItem.x;
                            deltaY = puzzleToCompare.y - puzzleItem.y + puzzleItem.height;
                        } else if (this.rightCheck(puzzleItem, puzzleToCompare)) {
                            deltaX = puzzleToCompare.x - puzzleItem.x - puzzleItem.width;
                            deltaY = puzzleToCompare.y - puzzleItem.y;
                        } else if (this.bottomCheck(puzzleItem, puzzleToCompare)) {
                            deltaX = puzzleToCompare.x - puzzleItem.x;
                            deltaY = puzzleToCompare.y - puzzleItem.y - puzzleItem.height;
                        } else if (this.leftCheck(puzzleItem, puzzleToCompare)) {
                            deltaX = puzzleToCompare.x - puzzleItem.x + puzzleItem.width;
                            deltaY = puzzleToCompare.y - puzzleItem.y;
                        }
                        if (deltaX && deltaY) {
                            return {deltaX: deltaX, deltaY: deltaY, mergeCollection: mainCollectionPuzzlesItem};
                        }
                    }
                }
            }
            return null;
        },

        mergeCollections: function (target, source) {
            this.mainCollection.splice(this.mainCollection.indexOf(source), 1);
            Array.prototype.push.apply(target, source);
            this.winningCheck();
        },

        findPuzzleCollection: function (puzzleId) {
            for (var i = 0; i < this.mainCollection.length; i++) {
                var mainPuzzleCollection = this.mainCollection[i];
                for (var j = 0; j < mainPuzzleCollection.length; j++) {
                    if (mainPuzzleCollection[j].id == puzzleId) {
                        return mainPuzzleCollection;
                    }
                }
            }
        },

        winningCheck: function () {
            if (this.mainCollection.length == 1) {
                $('#puzzlesBox').css({
                    'box-shadow': '0 0 30px 0 green'
                });
                alert('You WIN!');
            }
        },

        topCheck: function (puzzle, puzzleToCompare) {
            if (this.mashSizeY == 1 || puzzle.id - this.mashSizeX != puzzleToCompare.id) {
                return false;
            }
            return Math.abs(puzzleToCompare.x - puzzle.x) < this.stickingThreshold &&
                Math.abs(puzzleToCompare.y + puzzle.height - puzzle.y) < this.stickingThreshold;
        },

        rightCheck: function (puzzle, puzzleToCompare) {
            if (this.mashSizeX == 1 || puzzle.id % this.mashSizeX == 0 || puzzle.id + 1 != puzzleToCompare.id) {
                return false;
            }
            return Math.abs(puzzle.x + puzzle.width - puzzleToCompare.x) < this.stickingThreshold &&
                Math.abs(puzzle.y - puzzleToCompare.y) < this.stickingThreshold;
        },

        bottomCheck: function (puzzle, puzzleToCompare) {
            if (this.mashSizeY == 1 || puzzle.id + this.mashSizeX != puzzleToCompare.id) {
                return false;
            }
            return Math.abs(puzzleToCompare.x - puzzle.x) < this.stickingThreshold &&
                Math.abs(puzzleToCompare.y - puzzle.y - puzzle.height) < this.stickingThreshold;
        },

        leftCheck: function (puzzle, puzzleToCompare) {
            if (this.mashSizeX == 1 || puzzle.id % this.mashSizeX == 1 || puzzle.id - 1 != puzzleToCompare.id) {
                return false;
            }
            return Math.abs(puzzle.x - puzzle.width - puzzleToCompare.x) < this.stickingThreshold &&
                Math.abs(puzzle.y - puzzleToCompare.y) < this.stickingThreshold;
        }
    };

    return GamePuzzle;
});