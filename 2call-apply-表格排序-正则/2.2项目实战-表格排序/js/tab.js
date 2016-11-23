/**
 * Created by jh on 2016/6/24.
 */
//想要操作谁 就先获取谁

var oTab = document.getElementById("tab");
var tHead = oTab.tHead;
var oThs = tHead.rows[0].cells;
var tBody = oTab.tBodies[0];
var oRows = tBody.rows;//获取tBody下的所有的行
var data = null;
//1.首先获取后台(data.txt)中的数据"JSON格式的字符串"->Ajax(async javascript and xml)
//1)首先创建一个Ajax对象
var xhr = new XMLHttpRequest; //创建一个ajax对象
//2)打开我们需要请求数据的那个文件地址
xhr.open("get", "json/data.txt", false);//这个true是异部请求

//3)监听请求的状态
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
        var val = xhr.responseText;
        data = utils.jsonParse(val);
    }
}
//4)发送请求
xhr.send(null);


//2.实现我们的数据绑定
//console.log(data);
function bind() {
    var frg = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
        var cur = data[i];
        var oTr = document.createElement("tr");
        for (var key in cur) {
            var oTd = document.createElement("td");
            if (key === "sex") {
                oTd.innerHTML = cur[key] === 0 ? "男" : "女";
            } else {
                oTd.innerHTML = cur[key];
            }
            oTr.appendChild(oTd);
        }
        frg.appendChild(oTr);
    }

    tBody.appendChild(frg);
    frg = null;
}
bind();

//3.实现隔行变色
function changeBg() {
    for (var i = 0; i < oRows.length; i++) {
        oRows[i].className = i % 2 === 1 ? "bg" : null;
    }
}
changeBg();

//4.编写表格排序的方法,按照年龄这一列进行排序
function sort(n) {//->n是当前点击这一列的索引
    //this->oThs[1];
    var _this=this;

    //->把存储所有行的类数组转换为数组
    var ary = utils.listToArray(oRows);

    //->点击当前列,需要让其他的列的flag存储的值回归到初始值 -1,这样在返回头 点击其他列,才是按照升序排列
    for(var k=0;k<oThs.length;k++){
        if(oThs[k]!== this){
            oThs[k].flag=-1;
        }
    }


    //->给数组进行排序:按照每一行的第二列中的内容由小到大进行排序
    _this.flag*=-1; //->每一次执行sort,进来的第一步就是先让flag的值*-1->第一次flag=-1*=-1,flag=1 升序,第二次*=-1 flag=-1降序 第三次*=-1,flag=1升序
    ary.sort(function (a, b) {  //自执行函数this是window 想让他变为点击哪个标题就是哪个标题的this 就要第64行,this赋下值
        var curInn= a.cells[n].innerHTML;
        var nexInn= b.cells[n].innerHTML;
        var curInnNum= parseFloat(a.cells[n].innerHTML);
        var nexInnNum= parseFloat(b.cells[n].innerHTML);

        if(isNaN(curInnNum)||isNaN(nexInnNum)){
            return (curInn.localeCompare(nexInn)*_this.flag);
        }else{
            //this->window
            return (curInnNum - nexInnNum)*_this.flag;
        }

    });

    //按照ary中的最新顺序,把每一行重新的添加到tBody中
    var frg=document.createDocumentFragment();
    for( var i=0;i<ary.length;i++){
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg=null;
    changeBg();
}

//5.点击排序:所有具有class="cursor"这个样式的列都可以实现点击排序
for(var i=0;i<oThs.length;i++){
    var curTh=oThs[i];
    curTh.index=i; //用来存储索引的
    curTh.flag=-1; //->用来实现升降序的
    if(curTh.className==="cursor"){
        curTh.onclick=function(){
            //this->oThs[1];
            sort.call(this,this.index); //->强制执行curTh;

        }
    }
}






/*oThs[1].flag=-1;//->给当前点击这一列增加一个自定义属性flag存储的值是-1
oThs[1].onclick=function(){
    //this->oThs[1];
    //sort();//sort中的this->window
    sort.call(this); //->强制给执行oThs[1];

}*/






