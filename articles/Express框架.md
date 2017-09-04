# Express框架学习

## Hello World

### express app 

```

var express = require('express');

var app = express(); //create application

//todo 中间件设置  处理http请求 解析http 请求头信息 req.body, req.query,...

app.get('/',function(req, res, next){
	return res.status(200).send('hello world);
});

app.listen(3000);

```

### http server

```

//app.js

var express = require('express');

var app = express(); //create application

//todo 中间件设置  处理http请求 解析http 请求头信息 req.body, req.query,...

app.get('/',function(req, res, next){
	return res.status(200).send('hello world);
});

module.exports = app;


bin/wwww

var app = require('../app');
var http = require('http');
var port = 3000;
app.set('port', port);

var server = http.createServer(app);
server.listen(port);

```


## 解析
1. app = express() 创建应用程序
2. app.listen() 应用程序监听某个端口的请求
3. app.get('/', cb) 设置应用接口请求响应函数


## 解惑

[express-js-app-listen-vs-http-server-listen](https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen)

#### Express.js - app.listen vs server.listen

This may be a very basic question but I simply don't get it.
What is the difference between creating an app using Express.js and starting the app listening on port 1234 

for example:

```
var express = require('express');
var app = express();

//app.configure, app.use etc

app.listen(1234);

```
and adding an http server:

```

var express = require('express'), http = require('http');
var app = express();
var server = http.createServer(app);

//app.configure, app.use etc

server.listen(1234);

```

What's the **difference** ?


The second form (creating an HTTP server yourself, instead of having Express create one for you) is useful if you want to reuse the HTTP server, for example to run socket.io within the same HTTP server instance:

```
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
...
server.listen(1234);

```

However, app.listen() also returns the HTTP server instance, so with a bit of rewriting you can achieve something similar without creating an HTTP server yourself:

```

var express   = require('express');
var app       = express();

// app.use/routes/etc...

var server    = app.listen(3033);
var io        = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  ...
});

```