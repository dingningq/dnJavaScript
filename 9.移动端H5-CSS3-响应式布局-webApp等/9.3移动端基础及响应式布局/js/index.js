/**
 * Created by jh on 2016/10/20.
 * Author:丁宁
 * Development:单例模式
 */

var dn_Browser={
    //banner切换效果
    /**
     *
     * @param item 当前值
     * @param time 切换时间
     * @param ele  当前对象
     * @param speed 运动速度
     */
    banSlide:function(item,time,ele,speed){
        window.clearTimeout(autoTimer);
        var length=ele.slide.length- 1,autoTimer=null;
        //1.封装一个轮播图切换的效果

        function aniObj(getNum){
            ele.slide.hide().css({opacity:0.5,zIndex:0});
            ele.slide.eq(getNum).show().stop(true,true).animate({opacity:1,zIndex:8},speed);
            if(ele.aniMation){    /*----这里没起作用，一会看一下---*/
                ele.slide.removeClass('banAnimate');
                ele.slide.eq(getNum).addClass('banAnimate');
            }
        }

        //2.自动轮播
        function autoPlay(){
            item++;
            if(item===length+1){
                item=0;
                aniObj(item);
            }else{
                aniObj(item);
            }
            blockCur(item);
            autoTimer=window.setTimeout(autoPlay,time);

        }
        autoTimer=window.setTimeout(autoPlay,time);

        //3.实现焦点切换
        function  blockCur(eqNum){
            ele.slideCur.removeClass('cur');
            ele.slideCur.eq(eqNum).addClass('cur');
        }
        ele.slideCur.click(function(){
            window.clearTimeout(autoTimer);
            ele.slideCur.removeClass('cur');
            $(this).addClass('cur');
            item=$(this).index();
            if(item<=length){
                aniObj(item);
            }
            autoTimer=window.setTimeout(autoPlay,time);
        })

        //4.实现左右键头切换
        function slidePrev(e){
            e.preventDefault();
            window.clearTimeout(autoTimer);
            if(!ele.slide.is(':animated')){
                if(item==0){
                    item=length;
                    aniObj(item);
                }else{
                    item--;
                    aniObj(item);
                }
                blockCur(item);
            }
            autoTimer=window.setTimeout(autoPlay,time);
        }
        function slideNext(e){
            e.preventDefault();
            window.clearTimeout(autoTimer);
            if(!ele.slide.is(':animated')){
                if(item==length){
                    item=0;
                    aniObj(item);
                }else{
                    item++;
                    aniObj(item);
                }
                blockCur(item);
            }
            autoTimer=window.setTimeout(autoPlay,time);
        }
        ele.prev.click(slidePrev);
        ele.next.click(slideNext);


    },

    //初始化入口
    init:function(ele){
        dn_Browser.banSlide(0,2000,ele,500);

    }
}

//Jquery初始化调用
$(function(){
    var domEle={
        slide: $('.slide'),
        slideCur: $('.item a'),
        prev: $('.prev'),
        next: $('.next')
    }
    dn_Browser.init(domEle);
})
