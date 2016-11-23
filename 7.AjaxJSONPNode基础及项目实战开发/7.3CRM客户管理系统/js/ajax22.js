(function () {
    /**
     * ajax�߼�
     * @param {string} method http����
     * @param {string} url �����·��
     * @param {*} data ����
     * @param {Function} callback �ص�����
     */
    var ajax = function (method, url, data, callback) {
        // ��ȡajax����
        var xhr = tools.getXHR();

        // ��ʽ������
        data = tools.param(data);
        // �жϲ����Ƿ���ֵ�������Ƿ�Ϊgetϵ����
        if (data && /^get|head|delete$/ig.test(method)) {
            // �Ѹ�ʽ�����֮��Ĳ���ƴ�ӵ�url�ĺ���
            url = tools.padStringToURL(url, data);
            // ��data��� ��������ִ��xhr.send()����ʱ���������ǿ�
            data = null;
        }
        // ajax�ڶ���
        xhr.open(method, url, true);
        // �����ǰ�����֧���Զ��������ײ����������MIMEType����Ϊ���ύ
        xhr.setRequestHeader && xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');

        // ע�ắ��
        xhr.onreadystatechange = function () {
            // �ж�xhr�����Ƿ��Ѿ����http����
            if (xhr.readyState === 4) {
                // �ж�http״̬��
                if (/^2\d{2}$/.test(xhr.status)) {
                    callback(ajax.DONE, xhr.responseText);
                } else if (/^[45]\d{2}$/.test(xhr.status)) {
                    callback(ajax.FAILURE, xhr.status);
                }
            }
        };
        // ajax����http����
        xhr.send(data);
    };

    ajax.DONE = 0;
    ajax.FAILURE = 1;
    var tools = {
        // ���ö��Ժ�������ȡ��ǰ���������ʵ�ajax����
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
            // ������һ���������������������е�ÿһ������
            var xhr = null;

            // ������ĵ�һλ��ʼ���ȡ��
            while (xhr = list.shift()) {
                // ��try catch��Ŀ�ľ���Ϊ�˱���֮��Ҳ����ֹѭ��
                try {
                    // ���ִ�иú���������˵���ú���return��ajax�����ǵ�ǰ�����֧�ֵġ�
                    xhr();
                    break;
                } catch (ex) {
                    // ˵����ǰ�������֧�ָú�����ajax����
                    xhr = null;
                }
            }
            if (xhr === null) {
                throw new Error('browser was not supported');
            }
            return xhr;
        })(),
        //{a: 1, b: 2, name: "����"}
        /**
         * �Ѳ�����ʽ��Ϊquerystring��ʽ
         * @param {*} data ��Ҫ��ʽ�Ĳ���
         * @return {string} ��ʽ����ϵ�querystring
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
         * �ж���������
         * @param {*} data ����
         * @param {string} type ���ݸ�ʽ
         * @return {boolean}
         */
        isType: function (data, type) {
            return Object.prototype.toString.call(data) === '[object ' + type + ']';
        },
        /**
         * ��querystringƴ�ӵ�url�ĺ���
         * @param {string} url ����·��
         * @param {string} queryString Ҫƴ�ӵĲ���
         * @return {string} ƴ����ϵ�url
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