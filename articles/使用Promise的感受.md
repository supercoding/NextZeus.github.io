# 使用Promise的感受

## 起因
团队新建项目的时候，打算升级服务器端和客户端的技术栈，所以就有了这个糟心并收获颇丰的服务器搭建的过程

## 架子
Express + JWT＋ Mongoose + ioredis + request (Promise)

## 感受
1. 刚开始的时候 因为使用过更高版本的async await，就会觉得promise非常的别扭，比自己用async库更别扭，内心是极度的排斥
2. 在强大内心的驱动下，在大脑中残留对promise的记忆下，继续深入接触promise, 浏览bluebird库的API。一点点的写demo实例去体会promise的设计初衷
3. mongoose, ioredis, request 都可以支持promise化，所以没有遇到太大的问题
4. 接下来就是比较糟心的过程了
5. 虽然使用promise.then方法非常的方便，但是由于没有了解到规范的异常处理，对于在promise中途出现错误应该如何处理，处于一个未知的状态，内心有些交集
6. 还要在使用mongoose, request的时候，处理返回结果的方式也有些变化，request虽然支持了promise,但是我觉得支持的不是那么的完美。查看stack overflow后，发现要把原来的xxx方法替换成xxxAsync方法. 
7. mongoose 查询或者创建的数据，通过return 返回到下一个then(function(result){})中。 就像async.waterfall(...function(info,cb){})一样。 了解了之后，也感觉到了promise还是有那么一点不错的地方。
8. 说到头来 其实最痛苦的过程 就是要改变原来的习惯，去使用新的方法。 
