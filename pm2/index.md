# 坑
1. pm2 cluster模式下 即使两个不同的服务，端口冲突，也不会报错。会被pm2的master 放到一个cluster下。 异常表现，请求接口时304，时400.

## log4js config

```

{
    "appenders":{
        "everything":{
            "type":"dateFile",
            "filename":"/data/logs/all-the-logs.logs",
            "pattern":".yyyy-MM-dd",
            "compress":true
        },
        "userController":{
            "type":"dateFile",
            "filename":"/data/logs/userController-logs.logs",
            "pattern":".yyyy-MM-dd",
            "compress":true
        },
    },
    "categories":{
        "default":{
            "appenders":["everything"],
            "level":"debug"
        },
        "userController":{
            "appenders":["userController"],
            "level":"debug"
        },
        "everything":{
            "appenders":["everything"],
            "level":"debug"
        }
    },
    "pm2":  true
}

```
