~function (pro) {
    //->获取URL地址栏问号后面的参数值及HASH值
    function queryURLParameter() {
        var obj = {},
            reg = /([^?=&#]+)=([^?=&#]+)/g;
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        reg = /#([^?=&#]+)/;
        if (reg.test(this)) {
            obj["hash"] = reg.exec(this)[1];
        }
        return obj;
    }

    //->格式化时间字符串
    function formatTime(template) {
        template = template || "{0}年{1}月{2}日 {3}时{4}分{5}秒";
        var _this = this,
            ary = _this.match(/\d+/g);//->[2016,05,19]
        template = template.replace(/\{(\d+)\}/g, function () {
            var val = ary[arguments[1]];
            typeof val === "undefined" ? val = 0 : null;
            val = val.length < 2 ? "0" + val : val;
            return val;
        });
        return template;
    }

    pro.queryURLParameter = queryURLParameter;
    pro.formatTime = formatTime;
}(String.prototype);


//->REM
~function () {
    var desW = 640,
        winW = document.documentElement.clientWidth || document.body.clientWidth;
    if (winW > desW) {
        document.getElementById('main').style.width = desW + 'px';
        return;
    }
    document.documentElement.style.fontSize = winW / desW * 100 + "px";
}();

//->HEADER
~function () {
    var $header = $(".header"),
        $menu = $header.find('.menu'), //因为是孙子级元素所以用find
        $nav = $header.children('.nav');//因为是儿子级元素所以用children
    $menu.tap(function () {
        if ($(this).attr('isBlock') === 'true') {
            var timer = window.setTimeout(function () { //就算放前面也是同步先执行，然后异步执行
                $nav.css({
                    padding: 0
                });
                window.clearTimeout(timer);
            }, 300);
            $nav.css({
                height: 0
            });

            $(this).attr('isBlock', false);
            return;
        }
        $nav.css({
            padding: '.1rem 0',
            height: '2.22rem'
        });
        $(this).attr('isBlock', true);
    })
}();

//->MATCH INFO
var matchRender = (function () {  //单例模式
    var $matchInfo = $('.matchInfo'),
        $matchInfoTemplate = $('#matchInfoTemplate');

    //->绑定点击事件
    function bindEvent() {
        var $bottom = $matchInfo.children('.bottom'),
            $bottomLeft = $bottom.children('.home'),
            $bottomRight = $bottom.children('.away');

        //->获取本地存储的信息，判断是否有支持
        var support = localStorage.getItem('support');
        if (support) {
            support = JSON.parse(support);
            if (support.isTap) {
                $bottom.attr('isTap', true);
                support.type === "1" ? $bottomLeft.addClass('bg') : $bottomRight.addClass('bg')
            }
        }
        $matchInfo.tap(function (ev) {
            var tar = ev.target,
                tarTag = tar.tagName,
                tarP = tar.parentNode,
                $tar = $(tar),
                $tarP = $tar.parent(),
                tarInn = $tar.html();

            if (tarTag === 'SPAN' && tarP.className === 'bottom' && tar.className !== 'type') {


                if ($bottom.attr('isTap') === 'true') return; //在页面没有刷新操作下，当前$bottom如果已经存了 就不在存了

                //->增加背景和数字
                $tar.html(parseFloat(tarInn) + 1).addClass('bg');

                //->重新的计算进度条

                $matchInfo.children('.middle').children('span').css('width', (parseFloat($bottomLeft.html()) / (parseFloat($bottomLeft.html()) + parseFloat($bottomRight.html()))) * 100 + '%');

                //->告诉服务器支持的是谁
                $.ajax({
                    url: 'http://matchweb.sports.qq.com/kbs/teamSupport?mid=100000:1468531&type=' + $tar.attr('type'),
                    dataType: 'jsonp'
                });

                //->只能点击一次
                $bottom.attr('isTap', true);
                localStorage.setItem('support', JSON.stringify({"isTap": true, "type": $tar.attr('type')}));

            }
        });
    }


    //->绑定页面
    function bindHTML(matchInfo) {
        $matchInfo.html(ejs.render($matchInfoTemplate.html(), {matchInfo: matchInfo})) //第一个参数是模板字符串，第二个参数是模板数据

        //->控制进度条: 定时器是给HTML一定的渲染时间的
        window.setTimeout(function () {
            var leftNum = parseFloat(matchInfo.leftSupport),
                rightNum = parseFloat(matchInfo.rightSupport);
            $matchInfo.children('.middle').children('span').css('width', (leftNum / (leftNum + rightNum)) * 100 + '%');
        }, 500);

        //->数据加载完才能绑定点击事件
        bindEvent();

    }

    return {
        init: function () {
            //->获取数据
            $.ajax({
                url: 'http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1468531',
                dataType: 'jsonp',  //跨域
                success: function (result) {
                    if (result && result[0] == 0) {
                        result = result[1];
                        var matchInfo = result['matchInfo'];
                        matchInfo['leftSupport'] = result['leftSupport'];
                        matchInfo['rightSupport'] = result['rightSupport'];
                        //matchInfo['leftSupport']=1;
                        //matchInfo['rightSupport']=1;
                        //绑定HTML
                        bindHTML(matchInfo);
                    }
                }

            })
        }
    }
})();
matchRender.init();

//->MATCH LIST
var matchListRender=(function(){
    var $matchList=$('.matchList'),
        $matchListUl=$matchList.children('ul'),
        $matchListTemplate=$('#matchListTemplate');


    function bindHTML(matchList){
        $matchListUl.html(ejs.render($matchListTemplate.html(),{matchList:matchList})).css('width',parseFloat(document.documentElement.style.fontSize)*2.4*matchList.length+20+'px');

        //->实现局部滚动
        new IScroll('.matchList',{
            scrollX:true,
            scrollY:false,
            click:true
        })
    }
    return {
        init:function(){
            $.ajax({
                url:'http://matchweb.sports.qq.com/html/matchStatV37?mid=100002:2365',
                dataType:'jsonp',
                success:function(result){
                    if(result && result[0]==0){
                        result=result[1]['stats'];
                        var matchList=null;
                        $.each(result,function(index,item){
                            if(item['type']==9){
                                matchList=item['list']
                                return false;
                            }
                        });
                        //->绑定数据
                        bindHTML(matchList);
                    }
                }
            })
        }
    }
})();
matchListRender.init();
