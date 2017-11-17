# load balancing with nginx

```

upstream easyio {
 ip_hash; // 保证每次请求都能请求到同一台服务器
 server localhost:8080;
 server localhost:8081;
}

location /api/ {
 proxy_pass "http://easyio/api/"
}

```
1. 当8080服务挂掉，会立即请求到8081
2. ip_hash 保证只请求到一台服务器，不会每次请求随机分配服务器
