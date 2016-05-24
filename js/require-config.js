requirejs.config({
    baseUrl: "js",
    paths: {
        jquery: 'jquery-2.2.3',
        gamePuzzle: 'game-puzzle',
        memoryMemento: 'memory-memento',
        cookieMemento: 'cookie-memento',
        backbone: 'backbone'
    }
});

requirejs(['app'], function(app) {
});