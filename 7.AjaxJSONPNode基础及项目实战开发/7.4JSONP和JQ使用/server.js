/**
 * Created by jh on 2016/9/12.
 */
var http = require("http"),
    url = require("url"),
    fs = require("fs");
var server1 = http.createServer(function (req, res) {
    //这里的req.url是打开一个页面时，所有的请求页面
    //console.log("req.url的地址是："+req.url);
    var urlObj = url.parse(req.url, true), //URL模块中提供了一个方法：url.parse() 用来解析URL地址的 true是以键值对方式输出
        pathname = urlObj.pathname,
        query = urlObj.query;//->存储的是客户端请求的URL地址中问号传参后面的信息(并且是以对象的键值对方式存储的){id:xxx}
    console.log(pathname);
    //->静态资源文件请求的处理
    var reg = /\.(HTML|CSS|JS|ICON)/i;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase();
        //console.log(suffix);
        var suffixMIME = "text/html";
        switch (suffix) {
            case "CSS":
                suffixMIME = "text/css";
                break;
            case "JS":
                suffixMIME = "text/javascript";
                break;
        }
        try {
            var conFile = fs.readFileSync("." + pathname, "utf-8");
            res.writeHead(200, {'content-type': suffixMIME + ';charset=utf-8;'});
            res.end(conFile);
        } catch (e) {
            res.writeHead(404, {'content-type': 'text/plain;charset=utf-8;'});
            res.end("file is not found!!");
        }
        return;
    }

    //->JSONP的处理
    if(pathname==="/getAll"){
        //->接收客户端传递进来的函数名
        var fnName=query["cb"];

        //->准备数据
        var con=fs.readFileSync("./json/custom.json","utf-8");

        //->返回给客户端内容
        res.writeHead(200,{'content-type':'text/javascript;charset=utf-8'});
        res.end(fnName+'('+con+',200)');
    }
});
server1.listen(81, function () {
    console.log("server is success,listening on 81 port!")

})