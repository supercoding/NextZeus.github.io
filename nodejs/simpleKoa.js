var co = require('co');

function SimpleKoa(){
    this.middlewares = [];
}
SimpleKoa.prototype = {
    
    use: function(gf){
        this.middlewares.push(gf);
    },
    
    listen: function(){
        this._run();
    },
    _run: function(){
        var ctx = this;
        var middlewares = ctx.middlewares;
        return co(function *(){
            var prev = null;
            var i = middlewares.length;
            
            while (i--) {
                prev = middlewares[i].call(ctx, prev);
            }
            yield prev;
        });
    }
};


var app = new SimpleKoa();

app.use(function *(next){
    this.body = '1';
    yield next;
    this.body += '5';
    console.log(this.body);
});
app.use(function *(next){
    this.body += '2';
    yield next;
    this.body += '4';
});
app.use(function *(next){
    this.body += '3';
});
app.listen();
