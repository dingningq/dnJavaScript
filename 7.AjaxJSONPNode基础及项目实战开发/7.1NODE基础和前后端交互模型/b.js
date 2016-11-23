/**
 * Created by jh on 2016/9/5.
 */
function fn(){
    console.log("我是B模块下的方法")
}

var a=require("./a");
a.fn();