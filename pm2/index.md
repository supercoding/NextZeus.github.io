## pm2 cluster request 400

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

let logger = require('log4js').getLogger('userController');

```

## pm2 deploy

项目配置如下：

```

module.exports = {
  apps: [{
    name: 'API',
    script: 'bin/www',
    args: '',
    exec_mode: 'cluster',
    instances: 0,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }],
  deploy: {
    production: {
      'user': 'root',
      'host': '47.104.216.30',
      'ref': 'origin/master',
      'repo': 'https://github.com/NextZeus/jwt.git',
      'path': '/var/www/production',
      'pre-setup': "yum install git -y;",
      'post-setup': "ls -la",
      'pre-deploy-local': "pwd; echo 'this is a local command' ",
      'pre-deploy': 'ls -la;',
      'post-deploy': 'git pull origin master;git log -n 2; npm run start_production;',
      'test': 'pm2 ls;'
    }
  }
};


```

#### deploy express app 

1. pm2 deploy production setup (上传代码到host, 创建项目目录 /var/www/production)
2. pm2 deploy production (部署代码并启动服务，执行步骤: pre-deploy-local -> pre-deploy -> post-deploy -> test)

##### 说明
1. git pull 只能放在post-deploy配置项中，才能正确的更新代码到最新的commit
2. pre-deploy-local 是在本地执行的command, 而不是在host上