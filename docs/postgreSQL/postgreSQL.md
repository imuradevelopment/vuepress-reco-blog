---
title: postgreSQL
date: 2020-10-01
categories:
 - postgreSQL
 - SQL
tags:
 - postgreSQL
 - SQL
publish: true
isTimeLine: true
sidebar: true
---

完全なFront Matterケース

# postgreSQL

よく使うPostgreSQLで利用可能なコマンドのチートシートです。
環境：psql (PostgreSQL) 9.5.0

## 端末上で使うコマンド
#### サーバの起動
`$ pg_ctl start -D /usr/local/var/postgres`

#### サーバの終了
`$ pg_ctl stop -D /usr/local/var/postgres`

#### サーバが起動しているかの確認
`$ ps aux | grep postgres`

#### データベース接続
`$ psql -d database -U user -h host`

* -d: データベース名(未指定だと、ログインユーザー名のデータベースに接続する)
* -U: ユーザ名(未指定だと、ログインユーザー名になる)
* -h: ホスト名(未指定だと、localhostになる)

#### データベース一覧表示
`$ psql -l`

#### PostgreSqlバージョン表示
`$ psql -V`

#### PostgreSqlに関するヘルプ
`$ psql -help`


## psql上で使うコマンド
postgresの部分には接続中のDB名が入る。

#### psqlの終了
`postgres=# \q`

#### ユーザ一覧を表示
`postgres=# \du`

#### データベース一覧を表示
`postgres=# \l`

#### 他のデータベースに接続
`postgres=# \c dbname`

#### データベース作成
`postgres=# create database dbname;`

#### 接続中のデータベースの情報を表示
`postgres=# \conninfo`

#### テーブル一覧を表示
`postgres=# \z`

#### テーブル定義を確認
`postgres=# \d tablename`
*tablename*には任意のテーブル名を入れる。

#### カレントディレクトリ変更
`postgres=# \cd directory`
カレントディレクトリをdirectoryに変更する。

#### CSV形式のファイルをテーブルに挿入
`postgres=# \copy tablename from filename DELIMITER AS ','`

#### ファイルからコマンドを実行
`postgres=# \i filename.sql`
ファイルから入力を読み取り、実行する。

#### コマンドラインの履歴の表示
`postgres=# \s`
\sの後にファイル名を入力すると、そのファイル名に結果を出力する。

#### '\'に関するヘルプの表示
`postgres=# \?`

#### シェル上のコマンドを使いたい場合
`postgres=# \! command`
*command*の部分にlsやpwdを入れるとpsql上でもシェル上のコマンドが実行できる。


::: tip ヒント
This is a tip
:::

::: warning 警告
This is a warning
:::

::: danger 警告
This is a dangerous warning
:::

::: details コードスニペットのテスト

```js{2}
let str = "HelloWorld";
console.log(str);
```

:::

::: theorem テスト
テストの内容

::: right
[wikipedia](https://zh.wikipedia.org/wiki/%E7%89%9B%E9%A1%BF%E8%BF%90%E5%8A%A8%E5%AE%9A%E5%BE%8B)
:::

::: details Markdown テーブル
| Tables | Are | Cool |
| ------------- |:-------------:| -----:|
| col 3 is | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat | \$1 |
:::

## バッジ <Badge text="beta" type="warning"/>

_[HTML]: Hyper Text Markup Language  
_[W3C]: World Wide Web Consortium  
The HTML specification is maintained by the W3C.

==このようにハイライト表示==

文章内の一部を<mark>このようにハイライト表示</mark>させることができます。

@[youtube](https://www.youtube.com/watch?v=KsOCxwt-5FQ)

<p class="demo" :class="$style.example"></p>

<style module>
.example {
  color: #41b883;
}
</style>

<script>
export default {
  props: ['slot-key'],
  mounted () {
    document.querySelector(`.${this.$style.example}`)
      .textContent = 'この文章のみスタイリングする書き方'
  }
}
</script>
