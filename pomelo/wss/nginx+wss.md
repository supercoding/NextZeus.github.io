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
这种方式如果没有配合nginx 的话， 只能通过ip+port直连。


### nginx 配置wss

```
map $http_upgrade $connection_upgrade {
	default upgrade;
	'' close;
}

upstream gate {
	server 127.0.0.1:3014;
}

upstream connector {
        ip_hash;
        server 127.0.0.1:3015;
        server 127.0.0.1:3016;
        server 127.0.0.1:3017;
}

server {

	listen       443;
	server_name  pomelo.game.com;

	ssl on;
	ssl_certificate cert.crt;
	ssl_certificate_key cert.key;

	ssl_session_timeout 5m;
	ssl_session_cache shared:SSL:50m;
	ssl_protocols TLSV1.1 TLSV1.2 SSLv2 SSLv3;
	ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
	ssl_prefer_server_ciphers on;

	location /gate {
	    proxy_pass http://gate;
	    proxy_http_version 1.1;
	    proxy_set_header Upgrade $http_upgrade;
	    proxy_set_header Connection "Upgrade";
	}

	#charset koi8-r;
	access_log  /var/log/nginx/log/xxx.access.log  main;

	location / {
	    root   /data/www/xxxx;
	    index  index.php index.html index.htm;
	    try_files $uri $uri/ /index.php?$args;
	}
}

# 客户端访问 wss//pomelo.game.com/gate
# 客户端访问 wss//pomelo.game.com/connector [nginx负责 load balancing(负载均衡), pomelo ]

```
