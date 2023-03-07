import express, {query} from "express";
import * as mysql from "mysql2";
import config from "./config";
import {Connection} from "mysql2";
import * as crypto from "crypto";

const app: express.Express = express();

const cors = require('cors');
app.use(cors());
/*
  リクエストを受け取ったらJSONペイロードを持つリクエストを解析するもので、
  body-parserをベースにしています
  https://expressjs.com/ja/api.html#express.json
*/
app.use(express.json());

/*
  URLエンコードされたペイロードを持つリクエストを解析するもので、
  body-parserをベースにしています
  https://expressjs.com/ja/api.html#express.urlencoded
*/
app.use(express.urlencoded({ extended: true }));

/*
  指定されたポートで接続をlistenする
*/
app.listen(config.port, () => {
  console.log(`Start on port ${config.port}.`);
});

/*
  MySQLと接続するため情報
*/
const connection = async () => {
  return await mysql.createConnection(config.db);
};

function debugTime(httpMethod: string) {
  const time = new Date();
  const now = `${httpMethod}: ${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()}`;
  console.log(now)
}

/*
  .get
    指定されたコールバック関数で、
    指定されたパスへのHTTP GETリクエストをルーティングします

  req, res
    req: app.getの第一引数で指定されたパスに入ってきたHTTPリクエストを表すオブジェクト
    res: 指定されたパスに入ってきたリクエストに対するHTTPレスポンスを構成するためのオブジェクトです
    https://qiita.com/syumiwohossu/items/f9ee317f31adc3ad387b

  promise.then()
    Promiseに成功した場合、実行する

  connection.query
    クエリの実行

  res.send(rows)
    HTTP レスポンスを送信する
    引数はbody
    今回はクエリ結果が入っているはず
*/
app.get("/books", (req: express.Request, res: express.Response) => {
  connection()
    .then((connection: Connection) => {
      connection.query("SELECT * FROM books;",
        function (err, results) {
          connection.end();
          debugTime("GET");
          res.send(results);
        });
    });
});

app.get("/books/:bookId", (req: express.Request, res: express.Response) => {
  connection()
    .then((connection: Connection) => {
      connection.query("SELECT * FROM books WHERE id = ?;",
        [req.params.bookId],
        function (err, results) {
        connection.end();
        debugTime("GET");
        res.send(results);
      });
    });
});


app.post("/books/add", (req: express.Request, res: express.Response) => {
  connection()
    .then((connection: Connection) => {
      const uid = crypto.randomUUID();
      const name = req.body.name === void 0 ? null : req.body.name;
      const author = req.body.name === void 0 ? null : req.body.author;
      const published_date = req.body.name === void 0 ? null : req.body.published_date;
      const description = req.body.name === void 0 ? null : req.body.description;

      connection.query("INSERT INTO books(id, name, author, published_date, description) VALUES (?, ?, ?, ?, ?)",
        [uid, name, author, published_date, description],
        function (err){
        connection.end();
        debugTime("POST");
        if(err === null){
          res.status(200).send();
        } else {
          res.status(400).send({ error: err });
        };
      });
    });
});

app.delete("/books/del/:bookId", (req: express.Request, res: express.Response) => {
  connection()
    .then((connection: Connection) => {
      connection.query("DELETE FROM books WHERE id = ?;",
        [req.params.id],
        function (err){
        connection.end();
        debugTime("DELETE");
        if(err === null){
          res.status(200).send();
        } else {
          res.status(400).send({ error: err });
        };
      });
    });
});

/*
  TODO:
    気になる箇所:
      - NULLにアップデートができない
*/
app.put("/books/update/:bookId", (req: express.Request, res: express.Response) => {
  connection()
    .then((connection: Connection) => {
      connection.query(`UPDATE books SET ? WHERE id = "${req.params.bookId}";`,
        [req.body],
        function (err) {
          connection.end();
          debugTime("PUT");
          if(err === null){
            res.status(200).send();
          } else {
            res.status(400).send({ error: err });
          };
        });
    });
});

/*
  TODO:
    - エラー処理
    - トランザクション
*/