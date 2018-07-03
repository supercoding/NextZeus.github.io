# nodejs memory leak 

```

const http = require('http');
const memwatch = require('memwatch-next');
const heapdump = require('heapdump');

memwatch.on('leak', (info) => {
  console.error('Memory leak detected:\n', info);
  heapdump.writeSnapshot((err, filename) => {
    if (err) {
		console.error('writeSnapshot error',err);
    } else {
		console.error('Wrote snapshot: ' + filename);
    }
  });    
});

var server = http.createServer((req, res) => {
 for (var i=0; i < 1000; i++) {
   server.on('request', function leakyfunc() {});
 }

 res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
server.setMaxListeners(0);

console.log('Server running at http://127.0.0.1:1337/. Process PID: ', process.pid);


```

## Test

- autocannon -c 1 -d 60 http://localhost:1337
- top -pid <node process id>