//rem
~function () {
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 640 * 100 + 'px';
}();


//banner模块
var bannerRender = (function () {
    var winW = document.documentElement.clientWidth,
        maxL = 0,
        minL = 0;
    var $banner = $('.banner'),
        $wrapper = $banner.children(".wrapper"),
        $slideList = $wrapper.children('.slide'),
        $imgList = $wrapper.find('img');
    var step = 1;

    //公共方法
    function isSwipe(strX, strY, endX, endY) {
        return Math.abs(endX - strX) > 0 || Math.abs(endY - strY) > 0;
    }

    //如果我们的X轴偏移距离大于y轴偏移距离就是左右滑动
    function swipeDir(strX, strY, endX, endY) {
        return Math.abs(endX - strX) >= Math.abs(endY - strY) ? (endX - strX > 0 ? 'right' : 'left') : (endY - strY > 0 ? 'down' : 'up');
    }

    //->touch Start
    function dragStart(ev) {
        //记录盒子和手指的起始位置
        var point = ev.touches[0];//存储了第一个手指的操作信息
        $wrapper.attr({
            strL: parseFloat($wrapper.css('left')),
            //手指的坐标
            strX: point.clientX,
            strY: point.clientY,
            isMove:false,
            dir:null,//滑动方向是什么
            changeX:null
        });
    }

    //->touch Move
    function dragIng(ev) {
        var point=ev.touches[0];
        var endX=point.clientX,
            endY=point.clientY,
            strX=parseFloat($wrapper.attr('strX')),
            strY=parseFloat($wrapper.attr('strY')),
            strL=parseFloat($wrapper.attr('strL')),
            changeX=endX-strX;

        //->计算出是否滑动以及滑动的方向:只有是左右滑动才进行处理
        var isMove=isSwipe(strX,strY,endX,endY),
            dir=swipeDir(strX,strY,endX,endY);
        if(isMove&&/(left|right)/i.test(dir)){
            $wrapper.attr({
                isMove:true,
                dir:dir,
                changeX:changeX
            });
            var curL=strL+changeX;
            curL=curL>maxL?maxL:(curL<minL?minL:curL);
            $wrapper.css('left',curL);
        }

    }

    //->touch End
    function dragEnd(ev) {
       var isMove=$wrapper.attr('isMove'),
           dir=$wrapper.attr('dir'),
           changeX=parseFloat($wrapper.attr('changeX'));
        if(isMove&&/(left|right)/i.test(dir)){
            if(changeX>=winW/2){
                if(dir==='left'){
                    step++;
                }else{step--;}
            }
        }
        $wrapper[0].style.webkitTransitionDuration='.3s';

    }

    //->图片延迟加载，让当前的活动块及相邻的两个活动块进行加载
    function lazyImg() {
        var $cur = $slideList.eq(step);
        var $tar = $cur.add($cur.prev()).add($cur.next()); //给当前活动块增加上一个哥哥块和下一个弟弟块
        $tar.each(function (index, item) {
            //->this:item
            var $img = $(item).children('img');
            if ($img.attr('isLoad') === 'true') { // 如果加载过一次了就不需要重新加载了
                //->ATTR存储或者获取的属性值都是一个字符串，如果当前的图片已经加载过，我们就不需要重新加载了
                return;
            }
            var oImg = new Image;
            oImg.src = $img.attr('data-src');
            oImg.onload = function () { //加载成功了
                //->this:oImg
                $img.attr({  //设置的自定义属性值都会用字符串来存
                    src: this.src,
                    isLoad: true
                }).css('display', 'block');
                oImg = null;
            }
        })
    }


    return {
        init: function () {
            //->初始化css样式
            count=$slideList.length;
            minL = -($slideList.length - 1) * winW;
            $wrapper.css('width', $slideList.length * winW);
            $slideList.css('width', winW);

            //->图片延迟加载
            lazyImg();

            //->swipe 控制左右滑动
            $banner.on('touchstart', dragStart).on('touchmove', dragIng).on('touchend', dragEnd);
        }
    }
})();
bannerRender.init();