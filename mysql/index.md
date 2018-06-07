
# mac install mysql

```

brew install mysql@5.7.6
mysql.server start
mysql -uroot
update user set authentication_string=password('123456') where User='root';
mysql.server restart

```