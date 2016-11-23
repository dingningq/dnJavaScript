/**
 * Created by jh on 2016/6/28.
 */
var oTab = document.getElementById("tab");
var tHead = oTab.tHead;
var oThs = tHead.rows[0].cells;
var tBody = oTab.tBodies[0];
var oRows = tBody.rows;
var data = null;

//1 ajax获取数据
var xhr = new XMLHttpRequest();
xhr.open("get", "json/data.txt", false);
xhr.onreadystatechange = function () {
    if (xhr.readyState = 4 && /^2\d{2}$/.test(xhr.status)) {
        var val = xhr.responseText;
        data = utils.jsonParse(val);
    }
}
xhr.send(null);


//2.数据绑定
function bind() {
    var frg = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
        var cur = data[i];
        var oTr = document.createElement("tr");
        for (var key in cur) {
            var oTd = document.createElement("td");
            if (key === "sex") {
                oTd.innerHTML = cur[key] === 1 ? "男" : "女";
            } else {
                oTd.innerHTML = cur[key];
            }

            oTr.appendChild(oTd);
        }
        frg.appendChild(oTr);
    }
    tBody.appendChild(frg);
}
bind();
//3.隔行变色
function changeBg() {
    for (var i = 0; i < oRows.length; i++) {
        var curRow = oRows[i];
        curRow.className = i % 2 === 1 ? "bg" : null;
    }
}
changeBg();
//4.表格排序
function sort(n) {
    var _this=this;
    var ary = utils.listToArray(oRows);
    for(var k=0;k<oThs.length;k++){
        if(oThs[k]!==this){
            oThs[k].flag=-1;
        }
    }

    _this.flag*=-1;
    ary.sort(function (a, b) {
        var curInn = a.cells[n].innerHTML;
        var nexInn = b.cells[n].innerHTML;
        var curInnNum = parseFloat(a.cells[n].innerHTML);
        var nexInnNum = parseFloat(b.cells[n].innerHTML);
        if (isNaN(curInnNum) || isNaN(nexInnNum)) {
            return ( curInn.localeCompare(nexInn)*_this.flag);  //这里的this是window, 只有用_this才会向上级作用域里找,才和上级作用域的this引的是同一个this
        } else {
            return ( curInnNum - nexInnNum )*_this.flag;
        }

    });
//5.按照ary中的最新顺序,把每一行重新添加到tBody中
    var frg = document.createDocumentFragment();
    for (var i = 0; i < ary.length; i++) {
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg = null;
    changeBg();

}

//6.点击哪个哪个排序
for (var i = 0; i < oThs.length; i++) {
    var curTh = oThs[i];
    curTh.index = i;//用来索引索引的
    curTh.flag=-1; //用来实现升降序的
    if (curTh.className == "cursor") {
        curTh.onclick = function () {
            sort.call(this,this.index); //this.index负责转值的
        }

    }
}
