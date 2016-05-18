function Puzzle(params) {
    this.container = params.container ? params.container : this.container;
    this.puzzle = params.puzzle ? params.puzzle : this.puzzle;
    this.id = params.id ? params.id : this.id;
    this.x = params.x ? params.x : this.x;
    this.y = params.y ? params.y : this.y;
    this.width = params.width ? params.width : this.width;
    this.height = params.height ? params.height : this.height;
    this.backgroundUrl = params.backgroundUrl ? params.backgroundUrl : this.backgroundUrl;
    this.backgroundX = params.backgroundX ? params.backgroundX : this.backgroundX;
    this.backgroundY = params.backgroundY ? params.backgroundY : this.backgroundY;
    this.callback = params.callback ? params.callback : null;

    // init puzzle
    this.init();
}

Puzzle.prototype = {

    container: '#puzzlesBox',
    puzzle: '.puzzle[data-id={dataId}]',
    id: 0,
    x: 0,
    y: 0,
    width: null,
    height: null,
    backgroundUrl: 'img/img1.jpg',
    backgroundX: 0,
    backgroundY: 0,

    template: '<div class="puzzle" data-id="{id}"></div>',
    isMouseDown: false,
    whereMouseInPuzzleDownX: null,
    whereMouseInPuzzleDownY: null,
    callback: null,

    constructor: Puzzle,

    init: function () {
        var self = this;
        this.puzzle = this.puzzle.replace('{dataId}', this.id.toString());
        this.template = this.template.replace('{id}', this.id.toString());
        this.x = $(this.container).offset().left;
        this.y = $(this.container).offset().top;
        this.render();

        $(this.puzzle).on('mouseenter', function () {
            self.puzzleMouseEnter();
        });

        $(this.puzzle).on('mouseleave', function () {
            self.puzzleMouseOut();
        });

        $(this.puzzle).on('mousedown', function (e) {
            self.isMouseDown = true;
            self.whereMouseInPuzzleDownX = e.pageX - self.x;
            self.whereMouseInPuzzleDownY = e.pageY - self.y;
            self.puzzleMouseDown();
        });

        $(this.puzzle).on('mouseup', function () {
            self.isMouseDown = false;
            self.puzzleMouseUp();
        });

        $(this.puzzle).on('mousemove', function (e) {
            if (self.isMouseDown && $(e.target).data('id') == self.id) {
                self.puzzleMove(e.pageX, e.pageY);
            }
        });
    },

    render: function () {
        $(this.container).append(this.template);
        $(this.puzzle).css({
            'display': 'inline-block',
            'position': 'absolute',
            'left': this.x + 'px',
            'top': this.y + 'px',
            'width': this.width + 'px',
            'height': this.height + 'px',
            'background-image': 'url(' + this.backgroundUrl + ')',
            'background-position': this.backgroundX + 'px ' + this.backgroundY + 'px',
            'box-shadow': '0 0 3px 0 brown',
            'font-size': '36px',
            'color': 'red',
            'text-align': 'center',
            'line-height': '54px',
            'cursor': 'default',
            'z-index' : 1
        });
    },

    puzzleMouseEnter: function () {
        $(this.puzzle).css({
            'box-shadow': '0 0 3px 0 red',
            'color': 'brown',
            'cursor': 'pointer',
            'z-index' : 2
        });
    },

    puzzleMouseOut: function () {
        $(this.puzzle).css({
            'box-shadow': '0 0 3px 0 brown',
            'color': 'red',
            'cursor': 'default',
            'z-index' : 1
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
        if (this.callback) {
            this.callback.call(this);
        }
    },

    puzzleMove: function (x, y) {
        var x = x - this.whereMouseInPuzzleDownX;
        var y = y - this.whereMouseInPuzzleDownY;
        this.move(x, y);
    },

    move: function (x, y) {
        this.x = x;
        this.y = y;
        $(this.puzzle).css({
            'left': this.x + 'px',
            'top': this.y + 'px'
        });
    }
};