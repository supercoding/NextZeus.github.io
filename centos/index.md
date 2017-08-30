# Centos服务器

## 端口使用情况查看命令
```

$ netstat -lnp|grep 3062  [查看端口号]
(Not all processes could be identified, non-owned process info
 will not be shown, you would have to be root to see it all.)
tcp        0      0 :::3062                     :::*                        LISTEN      7642/node  [7643进程ID]
$ kill -9 7642 [杀掉进程]
$ kill -9 7642
kill: kill 7642 failed: 没有那个进程
$ netstat -lnp|grep 3062 [再看 端口占用就没有了]
(Not all processes could be identified, non-owned process info
 will not be shown, you would have to be root to see it all.)

```