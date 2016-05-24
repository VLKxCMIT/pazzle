define([], function() {
    function MemoryMemento() {
    }

    MemoryMemento.prototype = {
        stack: [],
        constructor: MemoryMemento,

        setState: function (obj) {
            this.stack.push(JSON.stringify(obj));
            console.log(this.stack);
        },

        getState: function () {
            if (this.stack.length) {
                return JSON.parse(this.stack.pop());
            }
            return null;
        }
    };

    return MemoryMemento;
});