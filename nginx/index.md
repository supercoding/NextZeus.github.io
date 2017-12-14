# 基本概念
### 负载均衡方式
- 手动选择
- DNS轮询
	- dig ntp.api.bz
	- 可靠性低
	- 负载分配不均衡
- 四/七层负载均衡设备
	- 物理层


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


[http://www.thegeekstuff.com/2017/05/nginx-location-examples/](nginx-location-examples)

# 调研问题
1. location 优先级
2. location 正则匹配 [使用工具]
3. proxy_pass
4. rewrite 
5. listen 80
