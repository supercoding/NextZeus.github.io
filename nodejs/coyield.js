// co generator特性
var fs = require("fs");

co(function*(){
    var data1 = yield readFile('./simpleKoa.js');
    console.log('data1===',data1);
    var data2 = yield readFile('./simpleKoa.js');
    console.log('data2===',data2);
});

function readFile( path ){
    return function(callback){
       fs.readFile( path , callback);
    }
}

function co( fn ) {

    var gen = fn();
    function next(err,data){   
        var result = gen.next(data);
        console.log('=====',result.value);
        if(!result.done){           
            result.value(next); 
        }
    }
    next();
}