# express-jwt

[issue](https://github.com/auth0/express-jwt/issues/53)

```


app.use('/api', expressJwt({secret: secret}).unless({path: /\/api\/public/i }));

```