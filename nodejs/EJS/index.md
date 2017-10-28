# EJS 模版

## static file

```

app.use(static(__dirname + '/public'));

//index.ejs


第一种：<link href="/stylesheet/style.css"> 绝对路径
和
第二种：<link href="stylesheet/style.css"> 相对路径
是有区别的

当你的接口是 /a/b/c的时候 ，如果是第一种方式，没有任何问题，但是第二种设置就有问题了， 页面会提示/a/b/c/style.css 不存在

```

