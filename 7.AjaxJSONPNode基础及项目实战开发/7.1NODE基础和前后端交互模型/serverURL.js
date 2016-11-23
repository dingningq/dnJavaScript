/**
 * Created by jh on 2016/9/5.
 */
var url=require("url");
var str="http://10.16.23.176:8080/index.html?name=dingning&age=27#bbs";
console.log(url.parse(str));

/*

Url {
 protocol: 'http:', 传输协议
 slashes: true,
 auth: null,
 host: '10.16.23.176:8080', 域名+端口
 port: '8080', 端口号
 hostname: '10.16.23.176', 域名（IP）
 hash: #bbs,  哈希值
 search: '?name=dingning&age=27', 问号+传递进来的数据
 query: 'name=dingning&age=27',  传递进来的数据
 pathname: '/index.html',   请求文件的路径及名称
 path: '/index.html?name=dingning&age=27',  路径名称+传递的数据
 href: 'http://10.16.23.176:8080/index.html?name=dingning&age=27#bbs' }  原始url地址

 */

console.log(url.parse(str,true)); //->增加true后，query中存储的是经过处理解析后的结果：把传递进来的多组数据以键值对方式进行存储

/*
Url {
 ...
 query: { name: 'dingning', age: '27' },
 ...}

 */