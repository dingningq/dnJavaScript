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

    //->API数据接口的处理
    var con = null,
        result={},
        customId=null,
        customPath = "./json/custom.json";

    //->首先我们把custom.json文件中的内容都获取到
    con=fs.readFileSync(customPath,"utf-8");
    //console.log(con); 字符串的JSON串
    con.length===0?con='[]':null;//为了防止 我们的custom.json中什么都没有，con是一个空字符串，我们会使用JSON.parse转换的时候会报错，我们让其等于'[]'
    con=JSON.parse(con);
    console.log("pathname:"+pathname);
    //1)获取所有的客户信息
    if (pathname === "/getList") {


        //->开始按照API文档中的规范准备给客户端返回的数据
        result={
            code:1,
            msg:"没有任何客户信息",
            data:null
        };
        if(con.length>0){
            result={
                code:0,
                msg:"成功",
                data:con
            };
        }
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;

    }

    //2)根据传递进来的客户ID获取某一个具体的客户信息
    if(pathname==="/getInfo"){
        //->把客户端传递进来的ID获取到
        customId=query["id"];

        result={
            code:1,
            msg:"客户不存在",
            data:null
        };
        for(var i=0;i<con.length;i++){
            if(con[i]["id"]==customId){
                result={
                    code:0,
                    msg:"成功",
                    data:con[i]
                };
                break;
            }
        }
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }

    //3)根据传进来的客户ID删除这个客户
    if(pathname==="/removeInfo"){
        customId=query["id"];
        var flag=false; //假设当前没有删除呢
        for(var i=0;i<con.length;i++){
            if(con[i]["id"]==customId){
                con.splice(i,1);
                flag=true; //说明已经删除了
                break;
            }
        }
        result={
            code:1,
            msg:"删除失败"
        };
        if(flag){
            fs.writeFileSync(customPath,JSON.stringify(con),"utf-8");
            result={
                code:0,
                msg:"删除成功"
            };
        }
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;


    }

    //4)增加客户信息
    if(pathname==="/addInfo"){
        //->获取客户端通过请求主体传递进来的内容
        var str="";
        req.on("data",function(chunk){
            str+=chunk;
        });
        req.on("end",function(){

            //console.log("str长度"+str.length);
            //str='{"name":"","age":"","phone":"","address":""}'
            if(str.length===0){
                res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
                res.end(JSON.stringify({
                    code:1,
                    msg:"增加失败,没有传递任何需要增加的信息"
                }));
                return;
            }
            var data=JSON.parse(str);
            //->在现有的DATA中追加一个ID：获取CON中最后一项的ID，新的ID是在原有基础上加1即可,如果之前一项都没有，我们这一项的ID就是1
            data["id"]=con.length===0?1:parseFloat(con[con.length-1]["id"])+1;
            //if(con.length===0){
            //    data['id']=1;
            //}else{
            //    data['id']=parseFloat(con[con.length-1]["id"])+1
            //}
            con.push(data);
            fs.writeFileSync(customPath,JSON.stringify(con),"utf-8");

            res.end(JSON.stringify({
                code:0,
                msg:"增加成功!"
            }));


        });
        return;
    }

    //5)修改客户信息
    if(pathname==="/updateInfo"){
        str="";
        req.on("data",function(chunk){
            str+=chunk;
        });
        req.on("end",function(){
            console.log("str"+str);
            if(str.length===0){
                res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
                res.end(JSON.stringify({
                    code:1,
                    msg:"修改失败,没有传递任何需要修改的信息"
                }));

                return;
            }
            var flag=false;//有没有修改
            var data=JSON.parse(str);
            for(var i=0;i<con.length;i++){
                if(con[i]["id"]==data["id"]){
                    con[i]=data;
                    flag=true;//修改成功
                    break;
                }
            }
            result.msg="修改失败,需要修改的客户不存在";
            if(flag){
                fs.writeFileSync(customPath,JSON.stringify(con),"utf-8");
                result={
                    code:0,
                    msg:"修改成功"
                };
            };
            res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
            res.end(JSON.stringify(result));

        });
        return;
    }

    //->如果请求的地址不是上述任何一个，则提示不存在即可
    res.writeHead(404,{'content-type':'text/plain;charset=utf-8;'});
    res.end("请求的数据接口不存在!");

});
server1.listen(8080, function () {
    console.log("server is success,listening on 8080 port!")

})