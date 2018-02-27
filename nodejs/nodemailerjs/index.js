var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var hbs = require('nodemailer-express-handlebars');

var opt = {
    port : 465,
    host : 'smtp.qq.com',
    auth : {
        user : "pengpengpet@asiainnovations.com",
        pass : "Petgame001"
    },
    secure : true
};

let transporter = nodemailer.createTransport(smtpTransport(opt));

let options = {
    viewPath:   './views',
    extName:    '.hbs'
};

transporter.use('compile', hbs(options));

var mail = {
   from: 'pengpengpet@asiainnovations.com',
   to: 'hautlixiaodong@163.com',
   subject: 'Crypto Island Email Verification Code',
   template: 'email',
   context: {
       email: 'hautlixiaodong@163.com',
       vcode:   '123465'
   }
}

transporter.sendMail(mail, function(err,resp){
    if(err){
        console.error(err);
    } else {
        console.log('success');
    }
});

