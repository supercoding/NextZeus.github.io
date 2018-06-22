var childprocess = require('child_process');
var worker = childprocess.fork('./worker.js');

console.log('pid in master:', process.pid);

// child process.send
worker.on('message', function(msg) {
  console.log('master worker on message :', msg);
});

// 只监听本进程的emit的信息
process.on('message', function(msg) {
  console.log('master process.on message :', msg);
});

worker.send('master worker.send---');
process.emit('message', 'master process.emit------');