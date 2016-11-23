var utils = (function () {
    var flag = "getComputedStyle" in window;//->flag这个变量不销毁，存储的是判断当前的浏览器是否兼容getComputedStyle,兼容的话是标准浏览器，但是如果 flag=false说明当前的浏览器是IE6-8

    //将类数组转换为一个数组
    function listToArray(likeAry) {

        if (flag) {
            return Array.prototype.slice.call(likeAry, 0);
        }
        var ary = [];
        for (var i = 0; i < likeAry.length; i++) {
            ary[ary.length] = likeAry[i];
        }
        return ary;
    };

    //将JSON格式的字符串转换成一个JSON对象格式
    function toJson(str) {
        if (flag) {
            return JSON.parse(str);
        } else {
            return eval("(" + str + ")");
        }
    };
    //获取当前元素距离body的偏移量
    function offset(curEle) {
        var t = curEle.offsetTop, l = curEle.offsetLeft, p = curEle.offsetParent;
        while (p) {
            if (flag) { //不是IE6-8 要加上左边框
                t += p.clientTop;
                l += p.clientLeft;
            }
            t += p.offsetTop; //IE8包换了上左边框的值
            l += p.offsetLeft;
            p = p.offsetParent;
        }
        return {top: t, left: l};
    };
    //获取或者设置关于浏览器的盒子模型的信息
    function win(attr, value) {
        //->不传value的话默认是获取值
        if (typeof value === "undefined") {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = value;
        document.body[attr] = value;
    }

    //获取当前元素的被浏览器计算过的样式
    function getCss(curEle, attr) {
        var val = reg = null;
        if (flag) {
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

    //children:获取curEle下所有的元素子节点（兼容所有的浏览器），如果传递了tagName，可以在获取的集合中进行二次筛选，把指定标签名的获取到
    function children(curEle, tagName) {
        var ary = [];
        if (!flag) {
            var nodeList = curEle.childNodes;
            for (var i = 0; i < nodeList.length; i++) {
                var curEle = nodeList[i];
                if (curEle.nodeType === 1) {
                    ary[ary.length] = curEle;
                }
                nodeList = null;
            }
        } else {
            ary = this.listToArray(curEle.children);
        }
        if (typeof tagName === "string") {
            for (k = 0; k < ary.length; k++) {
                var curEleNode = ary[k];
                if (curEleNode.nodeName.toLowerCase() !== tagName.toLowerCase()) {
                    ary.splice(k, 1);
                    k--;
                }
            }
        }
        return ary;
    };

    //->prev:获取上一个哥哥元素节点
    //->首先获取当前元素的上一个哥哥节点，判断是否为元素节点，不是的话基于当前的继续找上面的哥哥节点...一直到找到哥哥元素节点为止，如果没有哥哥元素节点，返回 null即可
    function prev(curEle) {
        if (flag) {
            return curEle.previousElementSibling;
        }
        var pre = curEle.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;

    }

    //->next:获取下一个弟弟元素节点
    function next(curEle) {
        if (flag) {
            return curEle.nextElementSibling;
        }
        var nex = curEle.nextSibling;
        while (nex && nex.nodeType !== 1) {
            pre = pre.nextSibling;
        }
    }

    //->prevAll:获取所有哥哥元素节点
    function prevAll(curEle) {
        var ary = [];
        var pre = this.prev(curEle);
        while (pre) {
            ary.unshift(pre);
            pre = this.prev(curEle);
        }
        return ary;
    }

    //->nextAll:获取所有弟弟元素节点
    function nextAll(curEle) {
        var ary = [];
        var nex = this.next(curEle);
        while (nex) {
            ary.push(pre);
            pre = this.next(curEle);
        }
        return ary;
    }

    //->sibling:获取相邻的两个元素节点
    function sibling(curEle) {
        var pre = this.prev(curEle);
        var nex = this.next(curEle);
        var ary = [];
        pre ? ary.push(pre) : null;
        nex ? ary.push(nex) : null;
        return ary;
    }

    //->siblings:获取所有的兄弟元素节点
    function siblings(curEle) {
        return this.prevAll.concat(this.nextAll);
    }

    //->index:获取当前元素的索引
    function index(curEle) {
        return this.prevAll(curEle).length;
    }

    //->firstChild：获取第一个元素子节点
    function firstChild(curEle) {
        var chs = this.children(curEle);
        return chs.length > 0 ? chs[0] : null;
    }

    //->lastChild:获取最后一个元素子节点
    function lastChild(curEle) {
        var chs = this.children(curEle);
        return chs.length > 0 ? chs[chs.length - 1] : null;
    }

    //->append:向指定窗器的末尾追加元素
    function append(newEle, container) {
        container.appendChild(newEle);
    }

    //->prepend:向指定容器的开头追加元素->把新的元素添加到容器中第一个子元素节点的前面,如果一个元素子节点都没有，就放在末尾即可
    function prepend(newEle, container) {
        var fir = this.firstChild(container);
        if (fir) {
            container.insertBefore(newEle, fir);
            return;
        }
        container.appendChild(newEle);
    }

    //->insertBefore:向容器中指定元素的前面追加
    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);
        //oldEle.parentNode是一个容器
    }

    //->insertAfter:把新元素(newEle)追加到指定元素(oldEle)的后面
    //->相当于追加到oldEle弟弟元素的前面,如果弟弟不存在，也就是当前元素已经是最后一个了，我们把新的元素放在最末尾即可
    function insertAfter(newEle, oldEle) {
        var nex = this.next(oldEle);
        if (nex) {
            oldEle.parentNode.insertBefore(newEle, nex);
            return;
        }
        oldEle.parentNode.appendChild(newEle);
    }

    //->hasClass：验证当前元素中是否包含className这个样式类名
    function hasClass(curEle, className) {
        //curEle.className="box bg2 border"
        var reg = new RegExp("(^| +)" + className + "( +|$)");
        return reg.test(curEle.className);
    }

    //->addClass:给元素增加样式类名
    function addClass(curEle, className) {
        //->为了防止className传递进来的值 包含多个样式类名，我们把传递进来的字符串按照一到多个空格拆分成数组中的每一项
        var ary = className.split(/ +/g);

        //->循环数组，一项项的进行验证增加即可
        for (var i = 0, len = ary.length; i < len; i++) {
            var curName = ary[i];
            if (!this.hasClass(curEle, curName)) {
                curEle.className += " " + curName;
            }
        }
    }

    //->removeClass:给元素移除样式类名
    function removeClass(curEle, className) {

        var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0, len = ary.length; i < len; i++) {
            var curName = ary[i];
            if (this.hasClass(curEle, curName)) {
                var reg = new RegExp("(^| +)" + curName + "( +|$)");
                curEle.className = curEle.className.replace(reg, " ");
            }

        }
    }

    //->getElementsByClass:通过元素的样式类名获取一组元素集合
    function getElementsByClass(strClass, context) {
        context = context || document;
        if (flag) {
            return this.listToArray(context.getElementsByClassName(strClass));
        }
        //->IE6-8
        var ary = [];
        var strClassAry = strClass.replace(/(^ +| +$)/g, "").split(/ +/g);
        var nodeList = context.getElementsByTagName("*");
        for (var i = 0, len = nodeList.length; i < len; i++) {
            var curNode = nodeList[i];
            var isOk = true;
            for (var k = 0; k < strClassAry.length; k++) {
                var reg = new RegExp("(^| +)" + strClassAry[k] + "( +|$)");
                if (!reg.test(curNode.className)) {
                    isOk = false;
                    break;
                }
            }
            if (isOk) {
                ary[ary.length] = curNode;
            }
        }

        return ary;
    }

    //->setCss:给当前元素的某一个样式属性设置值(增加在行内样式上的)
    function setCss(curEle, attr, value) {
        //->在JS中设置float样式值的话也需要处理兼容
        if (attr === "float") {
            curEle["style"]["cssFloat"] = value;
            curEle["style"]["styleFloat"] = value;
            return;
        }

        //->如果打算设置的是元素的透明度，我们需要设置两套样式来兼容所有浏览器
        if (attr === "opacity") {
            curEle["style"]["opacity"] = value;
            curEle["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
            return;
        }
//->对于某些样式属性，如果传递进来的值没有加单位，我们需要把单位默认的补充上，这样的话，这个方法就会人性化一些
        var reg = /^(width|height|top|bottom|left|right|((margin|padding)(Top|Bottom|Left|Right)?))$/;
        if (reg.test(attr)) {
            if (!isNaN(value)) { //->在判断传递进来的value值是否是一个有效数字，如果是有效数字的话，证明当前传递进来的值没有加单位，我们给补充单位
                value += "px";
            }
        }

        curEle["style"][attr] = value;
    }

    //->setGroupCss:给当前元素批量的设置样式属性值
    function setGroupCss(curEle, options) {
        //->通过检测options的数据类型,如果不是一个对象，则不能进行批量的设置
        options = options || 0;
        if (options.toString() !== "[object Object]") {
            return;
        }

        //->遍历对象中的每一项，调取setCss方法一个个的设置即可
        for(var key in options){
            if(options.hasOwnProperty(key)){
                this.setCss(curEle,key,options[key]);
            }
        }
    }

    //->css此方法实现了获取，单独设置，批量设置元素的样式值
    function css(curEle){
        var argTwo=arguments[1];
        if(typeof argTwo==="string"){ //->第二个参数值是一个字符串，这样的话很有可能就是在获取样式，为什么说是很有可能呢？因为还需要判断是否存在第三个参数，如果第三个参数存在的话，不是获取了，而是在单独的设置样式属性值
            var argThree=arguments[2];
            if(typeof argThree==="undefined"){//->第三个参数不存在
                return this.getCss.apply(this,arguments);
                //return this.getCss(curEle,argTwo);
            }
            //->第三个参数存在则为单独设置
            this.setCss.apply(this,arguments);
        }
        argTwo=argTwo||0;
        if(argTwo.toString()==="[object Object]"){
            //->批量设置样式属性值
            this.setGroupCss.apply(this,arguments);
        }


    }


    //->把外界需要使用的方法暴露给utils
    return {
        children: children,
        offset: offset,
        listToArray: listToArray,
        toJson: toJson,
        win: win,
        prev: prev,
        next: next,
        prevAll: prevAll,
        nextAll: nextAll,
        sibling: sibling,
        siblings: siblings,
        index: index,
        firstChild: firstChild,
        lastChild: lastChild,
        append: append,
        prepend: prepend,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getElementsByClass: getElementsByClass,
        getCss: getCss,
        setCss: setCss,
        setGroupCss: setGroupCss,
        css:css


    };
})()












