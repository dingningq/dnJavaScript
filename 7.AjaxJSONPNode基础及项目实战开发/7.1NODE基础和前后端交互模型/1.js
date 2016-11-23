/**
 * Created by jh on 2016/9/2.
 */
var less = require("less");
var fs = require("fs"); //导入内置模块
less.render(fs.readFileSync("./1.less", "utf-8"), {compress: true}, function (error, output) { //compress:把我们的CSS进行压缩编译，output:输出的CSS
    fs.writeFileSync("./1.css", output.css, "utf-8");
});

//function sum() {
//    var total = null;
//    for (var i = 0; i < arguments.length; i++) {
//        var cur = Number(arguments[i]);
//        if (!isNaN(cur)) {
//            total += cur;
//        }
//    }
//    return total;
//}
//var total = sum(1, 2, 3, 4);
//console.log(total);
//total = sum(1, 2);
//console.log(total);