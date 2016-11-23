var cookieRender = (function () {
    function setValue(options) {
        //->设置
        var _default = {
            name: null,
            value: null,
            expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24)),//有效时间是24小时
            path: '/',//根目录
            domains: ''
        };
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                _default[key] = options[key];
            }
        }
        //"name=value;expires=xxx;path=xxx"
        document.cookie = _default.name + "=" + _default.value + ";expires=" + _default.expires.toGMTString() + ";path=" + _default.path
    }

    //->获取
    function getValue(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        }
        return null;
    }

    //->删除
    function removeValue(options) {
        var _default = {
            name: null,
            path: '/',//根目录
            domains: ''
        };
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                _default[key] = options[key];
            }
        }
        if (getValue(_default.name)) {
            document.cookie = _default.name + "= ; path=" + _default.path + "; domain=" + _default.domain + ";expires=Fri, 02-Jan-1970 00:00:00 GMT";
        }
    }

    return {
        set: setValue,
        get: getValue,
        remove: removeValue
    }
})();

