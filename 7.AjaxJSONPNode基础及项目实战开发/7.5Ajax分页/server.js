/**
 * Created by jh on 2016/9/29.
 */
var http=require("http"),
    url=require("url"),
    fs=require("fs");
var server1=http.createServer(function(req,res){
    var urlObj=url.parse(req.url,true),
        pathname=urlObj["pathname"],
        query=urlObj["query"];

    //->静态资源(项目)文件的请求处理：服务端接收到具体的请求文件后把文件中的源代码返回给客户端进行渲染即可
    var reg=/\.(HTML|CSS|JS)/i;
    if(reg.test(pathname)){
        var suffix=reg.exec(pathname)[1].toUpperCase(),
            suffixMIME=suffix==="HTML"?"text/html":(suffix==="CSS"?"text/css":"text/javascript");
        try{
            res.writeHead(200,{'content-type':suffixMIME+';charset=utf-8;'});
            res.end(fs.readFileSync("."+pathname,"utf-8"));
        }catch(e){
            res.writeHead(404);
            res.end("file is not found!");
        }
        return;
    }

    //->API 接口文档中规定的数据请求处理
    var data=JSON.parse(fs.readFileSync("./json/student.json","utf-8"));
    if(pathname==="/getList"){
        var n=query["n"],
            ary=[];
        for(var i=(n-1)*10;i<=n*10-1;i++){
            //->通过规律计算的索引比最大的索引都要大，直接的跳出即可，不需要在存储了（说明它已经是最后一页了）
            if(i>data.length-1){
                break;
            }
            ary.push(data[i]);
        }
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify({
            code:0,
            msg:"成功",
            total:Math.ceil(data.length/10), //向上取整，总页数
            data:ary
        }));
        return;
    }

    if(pathname==="/getInfo"){
        var studentId=query["id"],
            obj=null;
        for(i=0;i<data.length;i++){
            if(data[i]["id"]==studentId){
                obj=data[i];

            }

        }

        var result={
            code:1,
            msg:"内容不存在！",
            data:null
        };
        if(obj){
            result={
                code:0,
                msg:"成功",
                data:obj
            }
        }

        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }

    //->请求的接口不存在
    res.writeHead(404,{'content-type':'text/plain;charset=utf-8;'});
    res.end("请求的数据接口不存在aa!");
});
server1.listen(88,function(){
    console.log("server is success,listening on 88 port!")
})