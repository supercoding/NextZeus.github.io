//  进程间通信

[参考demo](https://github.com/fool2fish/blog/issues/14)


## master

```

var childprocess = require('child_process');
var worker = childprocess.fork('./worker.js');

console.log('pid in master:', process.pid);

worker.on('message', function(msg) {
  console.log('1:', msg);
})
process.on('message', function(msg) {
  console.log('2:', msg);
})

worker.send('---');
process.emit('message', '------');


```

## worker

```
console.log('pid in worker:', process.pid);

process.on('message', function(msg) {
  console.log('3:', msg);
});

process.send('===');
process.emit('message', '======');

```