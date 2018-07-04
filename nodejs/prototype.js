Object.prototype.greet = function(){
    console.log('Object greet');
}

var Person = function(name){
    this.name = name;
}

let alex = new Person('alex');

Person.prototype.greet = function(){
    console.log(`Hello ${this.name}`);
}

Person.prototype.greet1 = function(){
    console.log(`Hello ${this.name}`);
}

console.log(`Person.prototype: ${Person.prototype}`)
console.log('alex.__proto__ ', alex.__proto__);

alex.greet();
// 如果Person.prototype没有greet , 则继续向上找 Object.prototype
// alex.greet -> Person.prototype.greet (没有找到) -> Object.prototype.greet
// alex is a Person 
console.log(`Object.getPrototypeOf(alex) === Person.prototype: ${Object.getPrototypeOf(alex) === Person.prototype}`);

console.log(`Object.getPrototypeOf(Person.prototype) === Object.prototype; ${Object.getPrototypeOf(Person.prototype) === Object.prototype}`);

console.log(`Object.getPrototypeOf(Object.prototype) === null; ${Object.getPrototypeOf(Object.prototype) === null}`);

// 函数的原型is Function.prototype, Person is a function 
console.log(`Object.getPrototypeOf(Person) === Function.prototype; ${Object.getPrototypeOf(Person) === Function.prototype}`);


const greeter = {
    greet() {
        console.log(`Hi ${this.name}`);
    }
};
// 工厂函数 比 构造函数 简单直接
// 工厂函数直接返回一个对象 不调用new
const bob = Object.create(greeter);
bob.name = "Bob";
bob.greet(); // "Hi Bob"
Object.getPrototypeOf(bob) === greeter; // true


function createPerson(name, prototype) {
    const person = Object.create(prototype);
    person.name = name;
    return person;
}
const ada = createPerson("Ada", greeter);
ada.greet(); // "Hi Ada"

// class 底层用的还是prototype
class Army{
    constructor(name){
        this.name = name;
    }
    greet(){
        console.log(`Hello ${this.name}`);
    }
}

let army = new Army();
console.log('army.__proto__ == Army.prototype ',army.__proto__ == Army.prototype);
console.log(Army.prototype.constructor.valueOf());


//   通过构造函数或者工厂函数或者类创建的对象，newObject
// newObject.__proto__ == <Constructor>.prototype