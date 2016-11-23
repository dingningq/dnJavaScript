/**
 * Created by jh on 2016/10/21.
 */

FastClick.attach(document.body);
//rem响应布局js
~function () {
    var desW = 640,
        winW = document.documentElement.clientWidth,
        ratio = winW / desW,
        oMain = document.querySelector('.main');  //在移动端可以使用querySelector获取
    if (winW > desW) {
        oMain.style.margin = '0 auto';
        oMain.style.width = desW + 'px';
        return;
    }
    document.documentElement.style.fontSize = ratio * 100 + 'px';
}()
//->init Swiper
new Swiper('.swiper-container', {
    direction: 'vertical',
    loop: true,
    /*当切换结束后，给当前展示的区域添加对应的ID，由此实现对应的动画*/
    onSlideChangeEnd: function (swiper) {
        //->获取当前一共有多少个活动块(包含LOOP模式先前后多加的两个)
        //->当前展示这个区域的索引
        var slideAry = swiper.slides,
            curIn = swiper.activeIndex,
            total = slideAry.length;
        //->计算ID是PAGE？？
        var targetId = 'page';
        switch (curIn) {
            case 0:
                targetId += total - 2;
                break;
            case (total - 1):
                targetId += 1;
                break;
            default :
                targetId += curIn;
        }

        //->给当前的活动块设置ID即可,还要把其余的移除
        [].forEach.call(slideAry,function(item,index){
            if(curIn===index){
                item.id=targetId;
                return;
            }
            item.id=null;
        })


    }
})

//->music

~function(){
    var musicMenu=document.getElementById("musicMenu");
    var musicAudio=document.getElementById("musicAudio");

    musicMenu.addEventListener('click',function(){
        if(musicAudio.paused){  //->当前处于暂停状态
            musicAudio.play();

            musicMenu.className='music move';
            return;
        }
        musicAudio.pause(); //->点击一下先暂停去掉 move转动效果
        musicMenu.className='music';

    },false);
    function controlMusic(){
        musicAudio.volume=0.1;  //控制音量可以小一点
        musicAudio.play();
        musicAudio.addEventListener('canplay',function(){  //canplay事件:提示该视频已准备好开始播放
            musicMenu.style.display='block';
            musicMenu.className='music move';
        },false);
    }
    //过个一秒加载页面时间在播放
    window.setTimeout(controlMusic,1000);
}();
