# 阿里云

## 本机配置免密码登陆阿里云服务器

1. ssh登陆阿里云服务器
2. ssh-keygen #一路回车默认
3. 本机执行: scp ~/.ssh/id_rsa.pub root@host:/root/ # 将本机ssh公钥拷贝到阿里云服务器
4. 阿里云服务器执行：
    - mv id_rsa.pub ~/.ssh/nextzeus.pub
    - cd ~/.ssh
    - cat nextzeus.pub >> authorized_keys