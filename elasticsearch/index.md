# elk

```

var elasticsearch = require('elasticsearch');

var Client = new elasticsearch.Client({  
    host: 'localhost:9200',
    log: 'info'
});

let _ = require('underscore');
let Promise = require('bluebird');
let util = require('./util');
// create Kibana index patterns

/**
* check if the index exists
*/
function indexExists(indexName) {  
    return Client.indices.exists({
        index: indexName
    });
}

/**
* create the index
*/
function initIndex(indexName) {  
    return Client.indices.create({
        index: indexName
    });
}

function getMapping(indexName) {
    return Client.indices.getMapping({
        index: indexName
    });
}

function putMapping(index, map) {
    return Client.indices.putMapping({
        index: index,
        type: 'document',
        body: {
            properties: map
        }
    });
}



function postData(index, params) {
    return Client.index({
        index,
        type: 'document',
        body: params
    });
}

let channels = ['weixin','qq','fb', 'google', 'twitter'];
let ad_froms = ['fb','twitter','baidu'];
let currency_types = ['gifto','eth','coin'];

function makeUserData() {
    return {
        uid: _.random(10001,10005),
        upUid: _.random(100001,999999),
        loginTime: Date.now(),
        login_channel: channels[_.random(channels.length)],
        login_ad_from: ad_froms[_.random(ad_froms.length)],
        login_date: new Date(),
        login_year: 2018,
        login_month: _.random(1,12),
        login_day:_.random(1,31),
        create_date:  new Date(),
        create_year: 2018,
        create_month: _.random(1,12),
        create_day: _.random(1,31)
    };
}


function makeStreamData() {
    return {
        stream_from_upUid: _.random(10),
        stream_to_upUid: '39999999',
        stream_transaction_id: _.random(10000000),
        stream_type: _.random(1,2), // 1 收入 2 支出
        stream_channel: channels[_.random(channels.length)], // 渠道
        stream_ad_from: ad_froms[_.random(ad_froms.length)], // 广告源
        stream_class: _.random(8), // 流水来源 0默认 1,孵化 2,内购, 3,买卖, 4,礼包 5,挖矿 6,献祭 7,邀请 8,体力
        stream_amount: _.random(1000), // 金额数量
        stream_currency_type: currency_types[_.random(currency_types.length)],  // 流水货币类型 gifto, eth, coin
        create_date: new Date(),
        create_time: Date.now(),
        create_year: 2018,
        create_month: _.random(1,12),
        create_day: _.random(1,31),
    };
}

// text 类型 没办法aggregate 尽量用 number

const Mapping = {
    stream: {
        stream_from_upUid: {type: 'text'},
        stream_to_upUid:{type: 'text'},
        stream_transaction_id: {type: 'text'},
        stream_type: {type: 'short', index: true}, // 1 收入 2 支出
        stream_channel: {type: 'text', index: true}, // 渠道
        stream_ad_from: {type: 'text', index: true}, // 广告源
        stream_class: {type: 'short'}, // 流水来源 0默认 1,孵化 2,内购, 3,买卖, 4,礼包 5,挖矿 6,献祭 7,邀请 8,体力
        stream_amount: {type: 'float'}, // 金额数量
        stream_currency_type: {type: 'text'},  // 流水货币类型 gifto, eth, coin
        create_date: {type:'date', index: true},
        create_time: {type: 'long'},
        create_year: {type: 'short'},
        create_month: {type: 'short'},
        create_day: {type: 'short'},
    },
    user:{
        uid: {type:'text'},
        upUid: {type:'text'},
        loginTime: {type:'long'},
        login_channel: {type: 'text', index: true}, // 渠道
        login_ad_from: {type: 'text', index: true}, // 广告源
        login_date: {type:'date', index:true},
        login_year: {type:'short'},
        login_month: {type:'short'},
        login_day: {type:'short'},
        create_date: {type:'date'},
        create_year: {type:'short'},
        create_month: {type:'short'},
        create_day: {type:'short'},
    }
}
async function run(indexName) {
    let connected = await Client.ping();
    if(connected){
        let exists = await indexExists(indexName);
        console.log('exists index ? ', exists);
        if(!exists){
            let resp = await initIndex(indexName);
            console.log('initIndex resp %j', resp);
        }

        let existsMapping = await getMapping(indexName);
        console.log('existsMapping ? ', existsMapping);
        if(!existsMapping[indexName] || existsMapping[indexName] && existsMapping[indexName].mappings && !_.keys(existsMapping[indexName].mappings).length){
            console.log('hahsh');
            let resp = await putMapping(indexName, Mapping[indexName]);
            console.log('putMapping resp %j', resp);
        }

        setInterval(() =>{
            switch (indexName) {
                case 'user':
                    postData(indexName, makeUserData());
                    break;
                case 'stream':
                    postData(indexName, makeStreamData());
                default:
                    break;
            }
        },100);
    }    
}

let indexName = 'stream';
run(indexName);

```