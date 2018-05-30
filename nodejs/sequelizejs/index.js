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
        this.UserSchema = sequelize.define('user', {
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
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
        raw: true, //false 查询出的结果包含了model definition
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
})
.then(() => {
    return connM.sequelize.close();
})
.catch(e => {
    console.error('error %j',e);
});