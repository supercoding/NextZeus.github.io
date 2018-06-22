console.log('pid in worker:', process.pid);

// parent worker.send or current process.emit
process.on('message', function(msg) {
  console.log('worker process.on message :', msg);
});

// parent worker.on
process.send('worker process.send===');

// parent worker.on or current process.on
process.emit('message', 'worker process.emit======');