# 工作遇见的问题

## redis 删除 匹配的key 
- redis-cli --raw keys *DEL* | xargs redis-cli del

## centos7 install nodejs@8

curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
sudo yum install gcc-c++ make
sudo yum install nodejs


## 本机配置免密码登陆阿里云服务器

1. ssh登陆阿里云服务器
2. ssh-keygen #一路回车默认
3. 本机执行: scp ~/.ssh/id_rsa.pub root@host:/root/ # 将本机ssh公钥拷贝到阿里云服务器
4. 阿里云服务器执行：
    mv id_rsa.pub ~/.ssh/xiaodong.li.pub
    cd ~/.ssh
    cat xiaodong.li.pub >> authorized_keys

## 阿里云服务器 bash: rsync: command not found 报错原因以及解决办法

阿里云服务器也需要安装rsync

sudo yum install rsync -y

## mongodb update netsted object field

let option = {};
option['a.b'] = 1; // not option.a.b
option['a.c'] = 1; // not option.a.c

// option = {'a.b': 1 , 'a.c':1}


## git stash apply

git stash apply --index 0

## docker-compose INTERNAL ERROR: cannot create temporary directory!

https://github.com/docker/compose/issues/3262

docker-compose restar 失败，返回错误解决方法
删除一个container, 然后重新发布Docker

## 排行榜先到先得

score + '.' + (endTime - Date.now() )

endTime 一定要远一些，一定要保证榜单周期内的 endTime - Date.now() 结果的第一位数一样