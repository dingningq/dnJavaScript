/**
 * Created by jh on 2016/9/6.
 */

var http=require("http"),
    url=require("url"),
    fs=require("fs");

//->创建一个服务
var server1=http.createServer(function(req,res){

    //->解析客户端请求地址中的文件目录名称以及传递给当前服务器的数据内容
        var urlObj=url.parse(req.url,true),
            pathname=urlObj["pathname"],
            query=urlObj["query"];

    //->处理静态资源文件的请求(HTML/CSS/JS...)
    var reg=/\.(HTML|JS|CSS|JSON|TXT|ICO)/i;
    if(reg.test(pathname)){
        //->获取请求文件的后缀名
        var suffix=reg.exec(pathname)[1].toUpperCase();
        //->根据请求文件的后缀名获取到当前文件的MIME类型
        var suffixMIME="text/plain";
        switch (suffix){
            case "HTML":
                suffixMIME="text/html";
                break;
            case "CSS":
                suffixMIME="text/css";
                break;
            case "JS":
                suffixMIME="text/javascript";
                break;
            case "JSON":
                suffixMIME="application/json";
                break;
            case "ICO":
                suffixMIME="application/octet-stream";
                break;
        }

        try{
            //->按照指定的目录读取文件中的内容或者代码(读取出来的内容都是字符串格式的)
            var conFile=fs.readFileSync("."+pathname,"utf-8");
            //->重写响应头信息：告诉客户端的浏览器我返回的内容是什么样的MIME类型&&指定返回的内容格式是UTF-8编码的，返回的中文汉字就不会出现乱码了
            res.writeHead(200,{'content-type':suffixMIME+';charset=utf-8;'});

            //->服务端向客户端返回的内容应该也是字符串
            res.end(conFile);
        }catch(e){
            res.writeHead(404,{'content-type':'text/plain;charset=utf-8;'});
            res.end("request file is not found~")
        }


    }

    //->如果客户端请求的资源文件不存在，我们不加try catch服务会终止，这样不好，所以我们添加try cathc捕获异常信息，这样即使不存在，服务也不会报错，同样也不会终止
    //try{
    //    var con=fs.readFileSync("."+pathname,"utf-8");
    //    res.end(con);
    //}catch(e){
    //    res.end("requset file is not find~~")
    //}





    //if(pathname==='/index.html'){
    //    var con=fs.readFileSync("./index.html","utf-8");
    //    res.end(con);
    //    return;
    //}
    //if(pathname==='/css/index.css'){
    //    con=fs.readFileSync("./css/index.css","utf-8");
    //    res.end(con);
    //    return;
    //}
    //if(pathname==='/js/index.js'){
    //    con=fs.readFileSync("./js/index.js","utf-8");
    //    res.end(con);
    //    return;
    //}
});
//->为当前的这个服务配置端口
server1.listen(8088,function(){
    console.log("server is success listening on 8088 port!")
})