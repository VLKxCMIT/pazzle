define(['jquery'], function($) {
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
        this.mouseDownCallback = params.mouseDownCallback ? params.mouseDownCallback : null;
        this.mouseUpCallback = params.mouseUpCallback ? params.mouseUpCallback : null;
        this.mouseMoveCallback = params.mouseMoveCallback ? params.mouseMoveCallback : null;

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
        whereMouseInPuzzleDownX: 0,
        whereMouseInPuzzleDownY: 0,
        mouseDownCallback: null,
        mouseUpCallback: null,
        mouseMoveCallback: null,
        lastPositionX: 0,
        lastPositionY: 0,

        constructor: Puzzle,

        init: function () {
            var self = this;
            this.puzzle = this.puzzle.replace('{dataId}', this.id.toString());
            this.template = this.template.replace('{id}', this.id.toString());
            this.render();
            this.lastPositionX = $(this.puzzle).offset().left;
            this.lastPositionY = $(this.puzzle).offset().top;

            $(this.puzzle).on('mouseenter', function () {
                self.animatePuzzleMouseEnter();
            });

            $(this.puzzle).on('mouseleave', function () {
                self.animatePuzzleMouseOut();
            });

            $(this.puzzle).on('mousedown', function (e) {
                if ($(e.target).data('id') == self.id) {
                    self.isMouseDown = true;
                    self.whereMouseInPuzzleDownX = e.pageX - self.x;
                    self.whereMouseInPuzzleDownY = e.pageY - self.y;
                    self.lastPositionX = $(self.puzzle).offset().left;
                    self.lastPositionY = $(self.puzzle).offset().top;
                    self.animatePuzzleMouseDown();
                    if (self.mouseDownCallback) {
                        self.mouseDownCallback.call(self);
                    }
                }
            });

            $(this.container).on('mouseup', function () {
                if (self.isMouseDown) {
                    self.isMouseDown = false;
                    self.animatePuzzleMouseUp();
                    if (self.mouseUpCallback) {
                        self.mouseUpCallback.call(self);
                    }
                }
            });

            $(this.container).on('mousemove', function (e) {
                if (self.isMouseDown) {
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
                'z-index': 1
            });
        },

        animatePuzzleMouseEnter: function () {
            $(this.puzzle).css({
                'box-shadow': '0 0 3px 0 red',
                'color': 'brown',
                'cursor': 'pointer',
                'z-index': 2
            });
        },

        animatePuzzleMouseOut: function () {
            $(this.puzzle).css({
                'box-shadow': '0 0 3px 0 brown',
                'color': 'red',
                'cursor': 'default',
                'z-index': 1
            });
        },

        animatePuzzleMouseDown: function () {
            $(this.puzzle).css({
                'box-shadow': '0 0 3px 0 green',
                'cursor': 'move',
                'opacity': 0.5
            });
        },

        animatePuzzleMouseUp: function () {
            $(this.puzzle).css({
                'box-shadow': '0 0 3px 0 brown',
                'cursor': 'pointer',
                'opacity': 1
            });
        },

        puzzleMove: function (x, y) {
            var x = x - this.whereMouseInPuzzleDownX;
            var y = y - this.whereMouseInPuzzleDownY;
            var delta = this.move(x, y);
            if (this.mouseMoveCallback) {
                this.mouseMoveCallback.call(this, -delta.x, -delta.y);
            }
        },

        move: function (x, y) {
            this.x = x;
            this.y = y;
            $(this.puzzle).css({
                'left': this.x + 'px',
                'top': this.y + 'px'
            });
            var deltaX = this.lastPositionX - x;
            var deltaY = this.lastPositionY - y;
            this.lastPositionX = x;
            this.lastPositionY = y;
            return {x: deltaX, y: deltaY};
        },

        moveByDelta: function (deltaX, deltaY) {
            this.move(this.x + deltaX, this.y + deltaY);
        }
    };

    return Puzzle;
});