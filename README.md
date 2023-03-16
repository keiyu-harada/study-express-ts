# Express x TypeScriptの勉強

## 環境構築

### volta（Node.js）
```bash
$ curl https://get.volta.sh | bash

$ volta install node@19

$ node -v
v19.8.1
```


### npm
```bash
$ npm install typescript

$ npm install express 
$ npm install -D @types/express

$ npm install cors
$ npm install -D @types/cors

$ npm intall mysql2
$ npm install -D @types/mysql
```

入れたら楽だった
```bash
$ npm install nodemon
```

### MySQL

[こちら](https://prog-8.com/docs/mysql-env) のまま

```bash
$ brew install mysql

$ brew services start mysql
```

```sql
DROP DATABASE IF EXISTS `book_app`;
CREATE DATABASE `book_app` DEFAULT CHARSET utf8 COLLATE utf8_bin;


CREATE TABLE `books` (
`id` VARCHAR(256) NOT NULL,
`name` VARCHAR(256) NOT NULL,
`author` VARCHAR(256) DEFAULT NULL,
`published_date` DATE DEFAULT NULL,
`description` VARCHAR(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;
```


### .envファイル
一番上の階層に作成
```
# express
PORT=

# DB
DB_HOST="" #localhostだと動かないので、127.0.0.1
DB_PORT=3306
DB_USER=""
DB_PASSWORD=""
DB_DATABASE=""
```

下記コマンドを実行
```bash
$ export $(cat .env | xargs)
```

## 実行

```bash
$ npm start
```
