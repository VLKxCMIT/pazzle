function Puzzle(params) {
    this.container = params.container ? params.container : this.container;
    this.puzzle = params.puzzle ? params.puzzle : this.puzzle;
    this.x = params.x ? params.x : this.x;
    this.y = params.y ? params.y : this.y;
    this.width = params.width ? params.width : this.width;
    this.height = params.height ? params.height : this.height;
    this.backgroundUrl = params.backgroundUrl ? params.backgroundUrl : this.backgroundUrl;
    this.backgroundX = params.backgroundX ? params.backgroundX : this.backgroundX;
    this.backgroundY = params.backgroundY ? params.backgroundY : this.backgroundY;

    // init puzzle
    this.init();
}

Puzzle.prototype = {

    container: '#puzzlesBox',
    puzzle: '.puzzle',
    x: 0,
    y: 0,
    width: 96,
    height: 54,
    backgroundUrl: 'img/img1.jpg',
    backgroundX: 0,
    backgroundY: 0,

    template: '<div class="puzzle"></div>',
    isMouseDown: false,
    whereMouseInPuzzleDownX: null,
    whereMouseInPuzzleDownY: null,

    constructor: Puzzle,

    init: function () {
        var self = this;
        this.create();
        $(this.puzzle).hover(
            function () {
                self.puzzleMouseEnter();
            },
            function () {
                self.puzzleMouseOut();
            }
        );
        $(this.puzzle).on('mousedown', function (e) {
            self.isMouseDown = true;
            self.whereMouseInPuzzleDownX = e.pageX - self.x;
            self.whereMouseInPuzzleDownY = e.pageY - self.y;
            self.puzzleMouseDown();
        });
        $(this.container).on('mouseup', function () {
            self.isMouseDown = false;
            self.puzzleMouseUp();
        });
        $(this.container).on('mousemove', function (e) {
            if (self.isMouseDown) {
                self.puzzleMouseMove(e);
            }
        });
    },

    create: function () {
        $(this.container).append(this.template);
        $(this.puzzle).css({
            'display': 'inline-block',
            'position': 'absolute',
            'left': this.x + 'px',
            'top': this.y + 'px',
            'width': this.width + 'px',
            'height': this.height + 'px',
            'background-image': 'url(' + this.backgroundUrl + ')',
            'background-position': '-' + this.backgroundX + 'px -' + this.backgroundY + 'px',
            'box-shadow': '0 0 3px 0 brown',
            'font-size': '36px',
            'color': 'red',
            'text-align': 'center',
            'line-height': '54px'
        });
    },

    puzzleMouseEnter: function () {
        $(this.puzzle).css({
            'box-shadow': '0 0 3px 0 red',
            'color': 'brown',
            'cursor': 'pointer'
        });
    },

    puzzleMouseOut: function () {
        $(this.puzzle).css({
            'box-shadow': '0 0 3px 0 brown',
            'color': 'red',
            'cursor': 'default'
        });
    },

    puzzleMouseDown: function () {
        $(this.puzzle).css({
            'box-shadow': '0 0 3px 0 green',
            'cursor': 'move',
            'opacity': 0.5
        });
    },

    puzzleMouseUp: function () {
        $(this.puzzle).css({
            'box-shadow': '0 0 3px 0 brown',
            'cursor': 'pointer',
            'opacity': 1
        });
    },

    puzzleMouseMove: function (e) {
        this.x = e.pageX - this.whereMouseInPuzzleDownX;
        this.y = e.pageY - this.whereMouseInPuzzleDownY;
        $(this.puzzle).css({
            'left': this.x + 'px',
            'top': this.y + 'px'
        });
    },

    move: function (x, y) {

    }
};