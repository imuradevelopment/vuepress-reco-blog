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

# postgreSQL メモ

[[TOC]]

## 端末上で使うコマンド

#### サーバの起動

`pg_ctl start -D /usr/local/var/postgres`

#### サーバの終了

`pg_ctl stop -D /usr/local/var/postgres`

#### サーバが起動しているかの確認

`tasklist | ? { $_ -like "postgres*" }`

#### データベース接続

`psql -d database -U user -h host`

- -d: データベース名(未指定だと、ログインユーザー名のデータベースに接続する)
- -U: ユーザ名(未指定だと、ログインユーザー名になる)
- -h: ホスト名(未指定だと、localhost になる)

#### データベース一覧表示

`psql -l`

#### PostgreSql バージョン表示

`psql -V`

#### PostgreSql に関するヘルプ

`psql -help`

## psql 上で使うコマンド

postgres の部分には接続中の DB 名が入る。

#### psql の終了

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
カレントディレクトリを directory に変更する。

#### CSV 形式のファイルをテーブルに挿入

`postgres=# \copy tablename from filename DELIMITER AS ','`

#### ファイルからコマンドを実行

`postgres=# \i filename.sql`
ファイルから入力を読み取り、実行する。

#### シェル上のコマンドを使いたい場合

`postgres=# \! command`
*command*の部分に ls や pwd を入れると psql 上でもシェル上のコマンドが実行できる。
