define([], function() {
    function CookieMemento() {
    }

    CookieMemento.prototype = {
        cookieName: 'puzzles',
        constructor: CookieMemento,

        setState: function (state) {
            var cookieData = this.getCookie(this.cookieName);
            cookieData.push(state);
            this.setCookie(this.cookieName, cookieData, 7);
        },

        getState: function () {
            var cookieData = this.getCookie(this.cookieName);
            if (cookieData.length) {
                var state = cookieData.pop();
                this.setCookie(this.cookieName, cookieData, 7);
                return state;
            }
            return null;
        },

        setCookie: function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + JSON.stringify(cvalue) + "; " + expires;
        },

        getCookie: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return JSON.parse(c.substring(name.length, c.length));
                }
            }
            return [];
        }
    };

    return CookieMemento;
});