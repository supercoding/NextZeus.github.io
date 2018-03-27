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
