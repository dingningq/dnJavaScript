(function () {
    /**
     * ajax逻辑
     * @param {string} method http方法
     * @param {string} url 请求的路径
     * @param {*} data 参数
     * @param {Function} callback 回调函数
     */
    var ajax = function (method, url, data, callback) {
        // 获取ajax对象
        var xhr = tools.getXHR();

        // 格式化参数
        data = tools.param(data);
        // 判断参数是否有值，并且是否为get系方法
        if (data && /^get|head|delete$/ig.test(method)) {
            // 把格式化完成之后的参数拼接到url的后面
            url = tools.padStringToURL(url, data);
            // 把data清空 这样后面执行xhr.send()方法时，参数就是空
            data = null;
        }
        // ajax第二步
        xhr.open(method, url, true);
        // 如果当前浏览器支持自定义请求首部，把请求的MIMEType设置为表单提交
        xhr.setRequestHeader && xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');

        // 注册函数
        xhr.onreadystatechange = function () {
            // 判断xhr对象是否已经完成http事务
            if (xhr.readyState === 4) {
                // 判断http状态码
                if (/^2\d{2}$/.test(xhr.status)) {
                    callback(ajax.DONE, xhr.responseText);
                } else if (/^[45]\d{2}$/.test(xhr.status)) {
                    callback(ajax.FAILURE, xhr.status);
                }
            }
        };
        // ajax发送http请求
        xhr.send(data);
    };

    ajax.DONE = 0;
    ajax.FAILURE = 1;
    var tools = {
        // 利用惰性函数，获取当前浏览器最合适的ajax对象
        getXHR: (function () {
            var list = [function () {
                return new XMLHttpRequest();
            }, function () {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }, function () {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }, function () {
                return new ActiveXObject('Msxml3.XMLHTTP');
            }];
            // 先声明一个变量，用来接收数组中的每一个函数
            var xhr = null;

            // 从数组的第一位开始逐个取出
            while (xhr = list.shift()) {
                // 加try catch的目的就是为了报错之后也不终止循环
                try {
                    // 如果执行该函数不报错，说明该函数return的ajax对象是当前浏览器支持的。
                    xhr();
                    break;
                } catch (ex) {
                    // 说明当前浏览器不支持该函数的ajax对象
                    xhr = null;
                }
            }
            if (xhr === null) {
                throw new Error('browser was not supported');
            }
            return xhr;
        })(),
        //{a: 1, b: 2, name: "主体"}
        /**
         * 把参数格式化为querystring格式
         * @param {*} data 需要格式的参数
         * @return {string} 格式化完毕的querystring
         */
        param: function (data) {
            if (typeof data === 'string') {
                return data;
            }
            if (tools.isType(data, 'Object')) {
                var arr = [];
                for (var n in data) {
                    if (!data.hasOwnProperty(n)) continue;
                    arr.push(encodeURIComponent(n) + '=' + encodeURIComponent(data[n]));
                }
                return arr.join('&')
            }
            return '';
        },
        /**
         * 判断数据类型
         * @param {*} data 参数
         * @param {string} type 数据格式
         * @return {boolean}
         */
        isType: function (data, type) {
            return Object.prototype.toString.call(data) === '[object ' + type + ']';
        },
        /**
         * 将querystring拼接到url的后面
         * @param {string} url 请求路径
         * @param {string} queryString 要拼接的参数
         * @return {string} 拼接完毕的url
         */
        padStringToURL: function (url, queryString) {
            queryString = tools.param(queryString);
            if (queryString) {
                return url + (/\?/.test(url) ? '&' : '?') + queryString
            }
            return url;
        }
    };
    this.ajax = ajax;
}());