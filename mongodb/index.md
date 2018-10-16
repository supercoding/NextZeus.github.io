# mongoose

## connect multi url


## mongodb-aggregation-by-day-based-on-unix-timestamp

[group by day with timestamp](https://stackoverflow.com/questions/33078773/mongodb-aggregation-by-day-based-on-unix-timestamp)

## document create isNew tag

```

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({uid:Number, name:String});
userSchema.pre('save', function(){
	if(this.isNew){
		console.log('isNew---', this);
	} else {
		console.log('not new', this);
	}
});

let userModel;

async function run(){
	mongoose.connect('mongodb://localhost:27017/mocha');
	// await mongoose.connection.dropDatabase();
	userModel = mongoose.model('user', userSchema);
}

run().then(async () => {
	await userModel.create({uid:1});
	let user = await userModel.findOne();
	console.log('user ',user);
	user.name = 'hello';
	await user.save();
});

isNew--- { _id: 5aba094f63c6144fb5a23e62, uid: 1 }
user  { _id: 5aba094f63c6144fb5a23e62, uid: 1, __v: 0 }
not new { _id: 5aba094f63c6144fb5a23e62, uid: 1, __v: 0, name: 'hello' }

```

# Sharded 分片

- 分片：每个分片包含分片数据的子集。从MongoDB 3.6开始，必须将分片部署为副本集。
- mongos：mongos充当查询路由器，提供客户端应用程序和分片集群之间的接口。
- 配置服务器：配置服务器存储群集的元数据和配置设置。从MongoDB 3.4开始，配置服务器必须部署为副本集（CSRS）。

注意内存争用可能会成为大型部署的问题

# mongoose connect secondary replicateSet

```

// 1 

let conn = mongoose.createConnection(url, {user:'xxx', pass:'xxx', config:{autoIndex: false},replset: {readPreference: 'secondary'}});

// 2  

let conn = mongoose.createConnection(url, {user:'xxx', pass:'xxx', config:{autoIndex: false}});
let schema =  new mongoose.Schema({},{read:'secondary'})
let model = conn.model(modelName, schema);

// 3
let conn = mongoose.createConnection(url, {user:'xxx', pass:'xxx', config:{autoIndex: false}};
let schema = new mongoose.Schema({});
let model = conn.model(modelName, schema);
model.find().read('secondary').then(info => {});

```

# mongoose no schema query data

```
let mongoose = require('mongoose');

let conn = mongoose.createConnection('mongodb://localhost/test', {'autoIndex': false});


conn.on('connected', function (err) {
    console.log('mongoose connected  error ' + err);
});

conn.on('error', function (err) {
    console.log('mongoose throw error  ' + err);
});

conn.on('disconnected', function (err) {
    console.log('mongoose disconnected error ' + err);
});

let userModel = conn.model('user', new mongoose.Schema({ any: mongoose.Schema.Types.Mixed }));

userModel.findOne().then(info => {
    let user = info.toJSON(); // 转化为json -> mongodb $toObject()底层处理转化成了一个object;
    console.log('nickname %j', user.nickname);
});

```