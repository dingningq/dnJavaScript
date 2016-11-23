/**
 * Created by jh on 2016/8/31.
 */

/**
 * bind:处理DOM2级事件绑定的兼容性问题（绑定方法）
 * @param curEle 要绑定事件的元素
 * @param eventType 要绑定的事件类型("click","mouseover"...)
 * @param evenFn 要绑定的方法
 */

function bind(curEle, eventType, evenFn) {
    if ("addEventListener" in document) {
        curEle.addEventListener(eventType, evenFn, false);
        return;
    }

    //->给eventFn化妆,并且把化妆前的照片贴在自己对应的脑门上
    var tempFn = function () {
        evenFn.call(curEle);
    };
    tempFn.photo = evenFn;

    //->首先判断该自定义属性之前是否存在，不存在的话创建一个，由于要存储多个方法化妆后的结果，所以我们让其值是一个数组
    if (!curEle["myBind" + eventType]) {
        curEle["myBind" + eventType] = [];
    }

    //->解决重复问题：每一次自己在自定义属性对应的容器中添加前，看一下之前是否已经有了，有的话就不用在重新的添加了，同理也不需要往事件池中存储了
    var ary = curEle["myBind" + eventType];
    for (var i = 0; i < ary.length; i++) {
        var cur = ary[i];
        if (cur.photo === evenFn) {
            return;
        }
    }
    ary.push(tempFn);
    curEle.attachEvent("on" + eventType, tempFn);
}

function unbind(curEle, eventType, evenFn) {
    if ("removeEventListener" in document) {
        curEle.removeEventListener(eventType, evenFn, false);
        return;
    }
    //->拿evenFn到curEle["myBind"]这里找化妆后的结果，找到之后在事件池中把换装后的结果给移出事件池
    var ary = curEle["myBind" + eventType];
    for (var i = 0; i < ary.length; i++) {
        var cur = ary[i];
        if (cur.photo === evenFn) {
            ary.splice(i, 1);//->找到后，把自己存储的容器中对应的移除掉
            curEle.detachEvent("on" + eventType, cur);//->在把事件池中对应的也移除掉
            break;
        }
    }
}

//->解决顺序问题：我们不用浏览器自带的事件池了，而是自己模拟标准浏览器的事件池实现
//on:创建事件池，并且把需要给当前元素绑定的方法依次的增加到事件池中
function on(curEle,evenType,evenFn){
    if(!curEle["myEvent"+evenType]){
        curEle["myEvent"+evenType]=[];
    }
    var ary=curEle["myEvent"+evenType];
    for(var i=0;i<ary.length;i++){
        var cur=ary[i];
        if(cur===evenFn){
            return;
        }
    }
    ary.push(evenFn);
}

//->off
