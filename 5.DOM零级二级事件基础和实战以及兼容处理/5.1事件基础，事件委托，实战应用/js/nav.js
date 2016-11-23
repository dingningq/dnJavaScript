var nav = document.getElementById("nav");
var oLis = nav.getElementsByTagName("li");//->后去后代所有的li

for (var i = 0; i < oLis.length; i++) {
    var oLi = oLis[i];
    var oIn = oLi.getElementsByTagName("div")[0];
    oIn.style.top = -(i * 42 + 20) + "px";

    oLi.index = i;
    oLi.inner = oIn;
    oLi.onmouseover = function () {
        this.inner.style.display = "block";
        this.className = "select";
    };
    oLi.onmouseout = function () {
        this.inner.style.display = "none";
        this.className = "";
    };
}
