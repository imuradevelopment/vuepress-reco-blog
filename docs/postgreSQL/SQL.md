---
title: SQLまとめ
date: 2020-10-01
categories:
  - SQL
tags:
  - SQL
publish: true
isTimeLine: true
sidebar: true
---
# SQL まとめ

[[TOC]]

## 共通定義
この記事ではPostgreSQLを使用しています。
### 記載について
句 (clause)  
  文、又はクエリの構成要素。  
  これで改行すると個人的にスッキリする。  
文 (statement)  
  一つの実行の単位となるSQL。  
  文の末尾には';'を付けることができる(製品によっては付けないといけない)  
  そのまとまりが実行できるなら、文と称しても問題ない。  
式 (experssion)  
  スカラ値や式を表す。  
述語 (Predicates)  
  論理演算の結果(true/false/unknown)を返す。  
  条件式の中などで使用。  

## SELECT (statement, clause)
列を選択し結果セットとして返す。  
単に重複を除いた結果をそのまま出すだけの場合はDISTINCT,まとめた結果に対して何らかの処理を加える必要がある場合はGROUP BYを用いる。  
### FROM (clause)
どのテーブルからもデータを問い合わせない場合、SELECT文のFROM句を省略することができまる。  
FROM ⇒ SELECT  
```SQL
SELECT
   first_name,
   last_name,
   email
FROM
   customer;

/* 
  アスタリスク「*」の使用
  すべての列の省略形を表す。
*/
SELECT * FROM customer;

/*
  PostgreSQL：連結演算子「||」の使用
  顧客の名,スペース,性を連結する。
*/
SELECT 
   first_name || ' ' || last_name,
   email
FROM 
   customer;
```
### AS (clause)
クエリの列に一時的な名前を割り当てる。  
```SQL
SELECT 
   first_name, 
   last_name AS surname
FROM customer;
/*
  ASは省略可能
*/
SELECT 
   first_name, 
   last_name surname
FROM customer;
/*
  式を含む列にも同様に名前を割り当て可能
  省略も可
*/
SELECT
    first_name || ' ' || last_name "full name"
FROM
    customer;
```
### ORDER BY (clause)
SELECT句から返す結果セットを並べ替える。  
SELECT句に列エイリアスが存在する場合はそれを使用できる。  
FROM ⇒ SELECT ⇒ ORDER BY の順で評価される。  
```SQL
/*
  ASC:昇順(省略できる)
  DESC:降順
*/
SELECT
	first_name,
	last_name
FROM
	customer
ORDER BY
	first_name ASC,
	last_name DESC;
/*
  LENGTH関数
*/
SELECT 
	first_name,
	LENGTH(first_name) len
FROM
	customer
ORDER BY 
	len DESC;
```
### DISTINCT (clause, 演算子?)
SELECT句の結果セットから重複行を削除する。  
重複のグループごとに1つの行を保持し、SELECT句の1つ以上の列に適用できる。  
PostgreSQLはDISTINCT ON (expression) 構文を使用して、重複の各グループの「最初の」行を保持することもできる。  
SELECT句から返される行の順序は指定されていないため、複製の各グループの「最初の」行も指定されていません。  
結果セットを予測可能にするために、常にORDER BY句を使用DISTINCT ON(expression)する。  
```SQL
/*
  複数の列を指定した場合、
  DISTINCT句は列の値の組み合わせに基づいて重複を評価する
*/
SELECT
	DISTINCT
    bcolor,
    fcolor
FROM
	distinct_demo
ORDER BY
	bcolor;

/*
  PostgreSQL：DISTINCT ON (expression)
  bcolorの重複グループの最初の行にあるbcolor, fcolorを結果セットとして返す。
*/
SELECT
	DISTINCT ON (bcolor) bcolor,
	fcolor
FROM
	distinct_demo 
ORDER BY
	bcolor,
	fcolor;
```
### WHERE (clause)
SELECT句から返された行をフィルタリングするための条件を指定する。  
WHERE句は、SELECT文のFROM句の直後に記述する。  
条件はtrue, false, unknownのいずれかに評価されなければならず、AND および OR 演算子を使用したブールを返す式の組み合わせになる。  
条件が真と評価される行のみを結果セットとする。  
FROM ⇒ WHERE ⇒ SELECT ⇒ ORDER BY  
SELECT句で列エイリアスを使用する場合、WHERE句では使用できません。  
SELECT 文以外にも、UPDATE 文および DELETE 文で WHERE 句を使用して、更新または削除する行を指定することができます。  
比較演算子, 論理演算子の使用
|比較,論理演算子|概要|
|---|---|
|=|等しい|
|>|右オペランドより大きい|
|<|右オペランドより小さい|
|>=|右オペランド以上|
|<=|右オペランド以下|
|<> or !=|等しくない|
|AND|論理演算子 AND|
|OR|論理演算子 OR|
|IN|値がリスト内のいずれかの値に一致した場合に真を返します。|
|BETWEEN|値が値の範囲の間にある場合は真を返します。|
|LIKE|値がパターンにマッチした場合に真を返します。|
|IS NULL|値がNULLの場合は真を返します。|
|NOT|演算子の真偽を入れ替える。|
```SQL
/*
  OR演算子の使用
*/
SELECT
	first_name,
	last_name
FROM
	customer
WHERE
	last_name = 'Rodriguez' OR 
	first_name = 'Adam';

/*
  IN演算子の使用
*/
SELECT
	first_name,
	last_name
FROM
	customer
WHERE 
	first_name IN ('Ann','Anne','Annie');

/*
  LIKE演算子, BETWEEN演算子の使用
*/
SELECT
	first_name,
	LENGTH(first_name) name_length
FROM
	customer
WHERE 
	first_name LIKE 'A%' AND
	LENGTH(first_name) BETWEEN 3 AND 5
ORDER BY
	name_length;
```
### LIMIT o rFETCH (clause)
テーブルから行のサブセットを選択します。
### GROUP BY (clause)
行をグループにグループ化します。
### HAVING (clause)
グループをフィルタリングします。
### JOIN系

#### INNER JOIN句

#### LEFT JOIN句

#### FULL OUTER JOIN句

#### CROSS JOIN句

### SET

#### UNION
#### INTERSECT
#### EXCEPT
