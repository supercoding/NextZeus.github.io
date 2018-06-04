# mongodb 操作笔记
# 更新数组

[mongodb-update-objects-in-a-documents-array-nested-updating](https://stackoverflow.com/questions/10522347/mongodb-update-objects-in-a-documents-array-nested-updating)

```

Input
{
    uid: 1,
    items: [
        {
            itemId: 'item001',
            amount: 0
        },
        {
            itemId: 'item002',
            amount: 0
        }
    ]
}

Command
db.getCollection('users').update({uid:1,'items.itemId':'item001'},{$inc:{'items.$.amount':1}}, false, true);

最后两个参数如果缺少 则update无效

Output
{
    uid: 1,
    items: [
        {
            itemId: 'item001',
            amount: 1
        },
        {
            itemId: 'item002',
            amount: 0
        }
    ]
}

```

# 更新对象

```

Input
{
    uid: 1,
    mixed: {
        hello: 'world'
    }
}

Command
db.getCollection('users').update({uid: 1},{$set:{'mixed.hello':'nihao'}})


Output
{
    uid: 1,
    mixed: {
        hello: 'world'
    }
}

```