/*
 * utils class v1.0:The common methods used in our JS are included.
 * by Team on 2016/01/20
 */
var utils = {
    //listToArray:Converts an array of classes into an array
    listToArray: function (likeAry) {
        var ary = [];
        try {
            ary = Array.prototype.slice.call(likeAry, 0);
        } catch (e) {
            for (var i = 0; i < likeAry.length; i++) {
                ary[ary.length] = likeAry[i];
            }
        }
        return ary;
    },
    //toJSON:Converts a string of JSON format to an object in the JSON format
    toJSON: function (str) {
        return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");
    }
};

//getCss:Gets the style of the current element that is calculated by the browser
utils.getCss = function (curEle, attr) {
    var val = reg = null;
    if ("getComputedStyle" in window) {
        val = window.getComputedStyle(curEle, null)[attr];
    } else {
        if (attr === "opacity") {
            val = curEle.currentStyle["filter"];
            reg = /^alpha\(opacity=(\d+(\.\d+)?)\)$/;
            val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
        } else {
            val = curEle.currentStyle[attr];
        }
    }
    reg = /^-?\d+(\.\d+)?(px|pt|em|rem)?$/;
    return reg.test(val) ? parseFloat(val) : val;
};

//offset:Gets the offset of the current element distance body
utils.offset = function (curEle) {
    var t = curEle.offsetTop, l = curEle.offsetLeft, p = curEle.offsetParent;
    while (p) {
        if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
            t += p.clientTop;
            l += p.clientLeft;
        }
        t += p.offsetTop;
        l += p.offsetLeft;
        p = p.offsetParent;
    }
    return {top: t, left: l};
};

//win:获取或者设置关于浏览器的盒子模型的信息
utils.win=function(attr,value){
    //->不传value的话默认是获取值
    if(typeof value==="undefined"){
        return document.documentElement[attr]||document.body[attr];
    }
    document.documentElement[attr]=value;
    document.body[attr]=value;

};


//children:获取curEle下所有的元素子节点（兼容所有的浏览器），如果传递了tagName，可以在获取的集合中进行二次筛选，把指定标签名的获取到
utils.children=function(curEle,tagName){
    var ary=[];
    if(/MSIE (6|7|8)/i.test(navigator.userAgent)){
        var nodeList=curEle.childNodes;
        for(var i=0;i<nodeList.length;i++){
            var curEle=nodeList[i];
            if(curEle.nodeType===1){
                ary[ary.length]=curEle;
            }
            nodeList=null;
        }
    }else{
        ary=this.listToArray(curEle.children);
    }
    if(typeof tagName==="string"){
        for(k=0;k<ary.length;k++){
            var curEleNode=ary[k];
            if(curEleNode.nodeName.toLowerCase()!==tagName.toLowerCase()){
                ary.splice(k,1);
                k--;
            }
        }
    }
    return ary;
}

//珠峰最新版DOM库的gitHub地址:https://github.com/zhufengpeixun/zhufengDom.git