由于自己的服务器有gate , connector 两种front服务器，所有就选择这样配置。

```
app.configure('production|development', 'connector|gate', function() {

  app.set('connectorConfig',

    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : true,
      useProtobuf : true,
      ssl: {
        type: 'wss',
          key: fs.readFileSync('./keys/server.key'),
          cert: fs.readFileSync('./keys/server.crt'),
      }
    });
});

```

### nginx 配置wss

- nginx1.3+默认支持wss连接，基本上不需要特殊的配置

```
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
	listen       443 ssl;
	server_name  pomelo.game.com;

	ssl on;
	ssl_certificate ./game.com.crt;
	ssl_certificate_key ./game.com.key;
	ssl_session_timeout 5m;
	ssl_protocols SSLv2 SSLv3 TLSv1;
	ssl_ciphers HIGH:!aNULL:!MD5;
	ssl_prefer_server_ciphers on;

    access_log  ./logs/https.pomelo.game.com.access.log main;

	location / {
	    index  index.html index.htm;
	}

	error_page   500 502 503 504  /50x.html;
	location = /50x.html {
		root   html;
	}
}

```

### 客户端访问

url:	'wss://pomelo.game.com:3014'

