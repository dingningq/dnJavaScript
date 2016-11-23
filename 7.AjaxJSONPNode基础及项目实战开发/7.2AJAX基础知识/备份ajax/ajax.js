/**
 * Created by jh on 2016/9/8.
 */
~function(){
    //->createXHR:创建ajax对象，兼容所有的浏览器
    function createXHR() {
        var xhr = null,
            flag = false,
            ary = [
                function () {
                    return new XMLHttpRequest;
                },
                function () {
                    return new ActiveXObject("Microsoft.XMLHttp");
                },
                function () {
                    return new ActiveXObject("Msxml2.XMLHTTP");
                },
                function () {
                    return new ActiveXObject("Msxml3.XMLHTTP");
                }
            ];
        for (var i = 0, len = ary.length; i < len; i++) {
            var cur = ary[i];
            try {
                xhr = cur();

                //->本次循环获取的方法执行没有出现错误：说明些方法是我想要的，我们下一次执行这个小方法即可，这就需要我们把 createXHR重写为小方法(完成后不需要在判断下面的了，直接的退出循环即可)
                createXHR = cur;
                flag = true;
                break;
            } catch (e) {
                //->本次循环获取的方法执行出现错误，继续执行下一次的循环
            }
            if (!flag) {
                throw new Error("您的浏览器不支持ajax,请更换浏览器试试")
            }
        }
        return xhr;
    }
    //->ajax：实现ajax请求的公共方法;当一个方法传递的参数值过多，而且还不固定，我们使用对象统一传值法(把需要传递的参数值都先放在一个对象中，一起传递进去即可)
    function ajax(options) {
        //->把需要使用的参数值设定一个规则和初始值
        var _default = {
            url: "", //->请求的地址
            type: "get", //->请求的方式
            dataType: "json",//->设置请求回来的内容格式 "json":就是json格式的对象; "txt":就是字符串或者是JSON格式的字符串
            async: true,  //->请求的同步还是异步
            data: null,  //->放在请求主体中的内容(post)
            getHead: null, //->当ready state===2的时候执行的回调方法
            success: null //->当ready state===4的时候 执行的回调方法

        };
        //->使用用户自己传递进来的值 覆盖我们的默认值
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                _default[key] = options[key];
            }
        }

        //->如果当前的请求方式是GET，我们需要在URL的末尾加随机数清除缓存
        if(_default.type==="get"){
            _default.url.indexOf("?")>=0?_default.url+="&":_default.url+="?";
            _default.url+="_="+Math.random();
        }


        //->send ajax
        var xhr = createXHR();
        xhr.open("_default.type", "_default.url", _default.async);
        xhr.onreadystatechange = function () {
            if (/^2\d{2}$/.test(xhr.status)) {
                //->想要在READY STATE等于2的时候做一些操作，需要保证AJAX是异步请求
                if (xhr.readyState === 2) {
                    if (typeof _default.getHead === "function") {
                        _default.getHead.call(xhr);
                    }
                }

                if (xhr.readyState === 4) {
                    var val=xhr.responseText;
                    if(_default.dataType==="json"){
                        val="JSON" in window?JSON.parse(val):eval("("+val+")");
                    }
                    _default.success&&_default.success.call(xhr,val);
                }
            }
        };
        xhr.send(_default.data);
    }
    window.ajax=ajax;
}();

ajax({
    url:"data.txt",
    type:"get",
    dataType:"json",
    async:false,
    getHead:function(){
        //this->xhr当前ajax对象
    },
    success:function(data){
        //this->xhr当前ajax对象
        //data:我们从服务器获取的主体内容
    }

})

