const Sequelize = require('sequelize');

class Connection{
    constructor(){
        this.sequelize = new Sequelize('blog', 'root', 'b3RmELKOvCUrAdxIg0GEmugc3SY',{
            host: 'localhost',
            port: 3306,
            dialect: 'mysql',
            operatorsAliases: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });
        this.sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(e => {
            console.error('Unable to connect to the database:', e);
        });
    }
}

class User {
    constructor(sequelize){
        this.UserSchema = sequelize.define('user', 
        {
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            }
        }, 
        {
            getterMethods: {
                fullName() {
                    return this.firstName + ' ' + this.lastName;
                }
            },
            setterMethods: {
                fullName(value) {
                    const names = value.split(' ');
                    this.setDataValue('firstName', names[0]);
                    this.setDataValue('lastName', names[1]);
                }
            }
        });
    }
}

let connM = new Connection();
let sequelize = connM.sequelize;
let userM = new User(sequelize).UserSchema;

// userM.create({
//     firstName: 'John',
//     lastName: 'Hancock'
// })
// .then(() => {
return userM.findAll()
// })
.then(async (users) => {
    console.log(` users.length  ${users.length}`);
    let user = await userM.findOne();
    console.log(`firstName ${user.get('firstName')}`);

    return sequelize.query('select * from users', {
        model: userM,
        logging: console.log,
        plain: false,
        raw: true, //false 查询出的结果包含了model definition
        type: Sequelize.QueryTypes.SELECT
    });
})
.then((info) => {
    console.log('select * from users ', info);
    return sequelize.query('select * from users where id = :id;', {
        model: userM,
        logging: console.log,
        plain: false,
        raw: false, //false 查询出的结果包含了model definition
        type: Sequelize.QueryTypes.SELECT,
        replacements: { id: 1}
    });
})
.then((info) => {
    console.log('select * from users where id = :id;', info);
    return sequelize.query('select * from users where id = ? and firstName = ?;', {
        model: userM,
        logging: console.log,
        plain: false,
        raw: true, //false 查询出的结果包含了model definition
        type: Sequelize.QueryTypes.SELECT,
        replacements: [2, 'John']
    });
})
.then((info) => {
    console.log('select * from users where id = ? and firstName = ?;', info);
    return userM.findOne({
        where: {id: 1},
        attributes: ['id', ['firstName', 'name']] //firstName as name
    });
})
.then((info) => {
    console.log('findOne;', info.dataValues);
    return userM.findById(1)
})
.then((info) => {
    console.log('findById;', info.dataValues);
    return userM.max('id');
})
.then((info) => {
    console.log('max:', info);
    return userM.findOrCreate({where : { id: 1}, defaults: {job: 'Technical Lead Javascript'}})
        .spread((user, created) => {
            console.log('findOrCreate ',user.get());
            console.log('created ',created);
        });
})
.then(() => {
    return userM.findAndCountAll({
        where: {
            id: {
                [Sequelize.Op.gt]: 2
            }
        },
        offset:2,
        limit: 2,
        raw: true
    })
    .then(info => {
        console.log('findAndCountAll ',info);
    })
})
.then(() => {
    return connM.sequelize.close();
})
.catch(e => {
    console.error('error %j',e, new Error(e).stack);
});