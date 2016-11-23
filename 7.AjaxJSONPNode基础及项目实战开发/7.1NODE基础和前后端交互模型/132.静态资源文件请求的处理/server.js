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

    //->处理静态资源文件的请求(HTML/CSS/JS...)->"前端路由"
    var reg=/\.(HTML|JS|CSS|JSON|TXT|ICO)/i;
    if(reg.test(pathname)){
        var suffix=reg.exec(pathname)[1].toUpperCase();
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
            var conFile=fs.readFileSync("."+pathname,"utf-8");
            res.writeHead(200,{'content-type':suffixMIME+';charset=utf-8;'});
            res.end(conFile);
        }catch(e){
            res.writeHead(404,{'content-type':'text/plain;charset=utf-8;'});
            res.end("request file is not found~")
        }


    }

});
//->为当前的这个服务配置端口
server1.listen(8088,function(){
    console.log("server is success listening on 8088 port!")
})