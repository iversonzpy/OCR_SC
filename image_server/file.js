var http = require('http');
var fs = require('fs');
var url = require('url');
// 创建服务器
http.createServer( function (request, response) { 
   // 解析请求，包括文件名
   var pathname = url.parse(request.url).pathname;
   // 输出请求的文件名
   console.log("Request for " + pathname + " received.");
   // 从文件系统中读取请求的文件内容
   fs.readFile(pathname.substr(1), function (err, data) {
   var urlContent = pathname.substr(1);
   if(urlContent.lastIndexOf("jpg") > -1){
       if (err) {
         console.log(err);
         // HTTP 状态码: 404 : NOT FOUND
         // Content Type: text/plain
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else{            
         // HTTP 状态码: 200 : OK
         // Content Type: text/plain
         response.writeHead(200, {'Content-Type': 'image/jpeg'});
        var imageFilePath = pathname.substr(1);
        var stream = fs.createReadStream( imageFilePath );
        var responseData = [];//存储文件流
        if (stream) {//判断状态
            stream.on( 'data', function( chunk ) {
              responseData.push( chunk );
            });
            stream.on( 'end', function() {
               var finalData = Buffer.concat( responseData );
               response.write( finalData );
               response.end();
            });
        }             
      }
   }else if(urlContent.lastIndexOf("html") > -1){
　　   if (err) {
         console.log(err);
         // HTTP 状态码: 404 : NOT FOUND
         // Content Type: text/plain
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else{            
         // HTTP 状态码: 200 : OK
         // Content Type: text/plain
         response.writeHead(200, {'Content-Type': 'text/html'});           
         // 响应文件内容
         response.write(data.toString());       
      }
      //  发送响应数据
      response.end();
   }else{
     console.log("unSupport Type, Please contact Administrator err url="+urlContent); 
   }    
   });  
}).listen(8000);
console.log('Server starts running at port 8000');

