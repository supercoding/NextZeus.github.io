# 使用nodejs readline分析gzip日志


## 错误日志格式

```
2018-09-22 09:13:30: unhandledRejection  { WriteError({"code":11000,"index":0,"errmsg":"E11000 duplicate key error collection: game.mines index: index_1 dup key: { : 416901 }","op":{"areaId":1,"index":416901,"power":12725.908885,"price":0.00010353,"preRoundPrice":0.00010353,"prePreRoundPrice":0.00010353,"preRoundPower":20366.10594,"prePreRoundPower":20343.17394,"startTime":1537549035000,"endTime":1537549050000,"_id":"5ba5973a1705f84514a4b6e3","__v":0}}) // this is one line, not two line
    at /data/work/game/Server/node_modules/mongoose/node_modules/mongodb/lib/bulk/unordered.js:535:15
    at handleCallback (/data/work/game/Server/node_modules/mongoose/node_modules/mongodb/lib/utils.js:128:55)
    at resultHandler (/data/work/game/Server/node_modules/mongoose/node_modules/mongodb/lib/bulk/unordered.js:456:5)
    at handler (/data/work/game/Server/node_modules/mongoose/node_modules/mongodb-core/lib/topologies/replset.js:1210:22)
    at /data/work/game/Server/node_modules/mongoose/node_modules/mongodb-core/lib/connection/pool.js:541:18
    at _combinedTickCallback (internal/process/next_tick.js:131:7)
    at process._tickDomainCallback (internal/process/next_tick.js:218:9)
  name: 'BulkWriteError',
  message: 'E11000 duplicate key error collection: game.mines index: index_1 dup key: { : 416901 }',
  driver: true,
  code: 11000,
  index: 0,
  errmsg: 'E11000 duplicate key error collection: game.mines index: index_1 dup key: { : 416901 }',
  getOperation: [Function],
  toJSON: [Function],
  toString: [Function],
  result:
   BulkWriteResult {
     ok: [Getter],
     nInserted: [Getter],
     nUpserted: [Getter],
     nMatched: [Getter],
     nModified: [Getter],
     nRemoved: [Getter],
     getInsertedIds: [Function],
     getUpsertedIds: [Function],
     getUpsertedIdAt: [Function],
     getRawResponse: [Function],
     hasWriteErrors: [Function],
     getWriteErrorCount: [Function],
     getWriteErrorAt: [Function],
     getWriteErrors: [Function],
     getLastOp: [Function],
     getWriteConcernError: [Function],
     toJSON: [Function],
     toString: [Function],
     isOk: [Function] } }

```

## Code
```

const fs       = require('fs');
const zlib     = require('zlib');
const readline = require('readline');

let lineReader = readline.createInterface({
  input: fs.createReadStream('/data/logs/server-prod-error.log.gz').pipe(zlib.createGunzip())
});

lineReader.on('line', (line) => {
  let startStr = '{"areaId';
  let endStr = '"__v":0}';
  if (line.includes('WriteError') && line.includes(startStr) && line.includes(endStr)){
    console.warn('========>>>>>>>>', line);
    let index = line.indexOf(startStr);
    let endIndex = line.indexOf(endStr);
    let Log = line.substring(index, endIndex + endStr.length);
    console.log(Log);
  }
});

```