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
- 文、又はクエリの構成要素。  
- これで改行すると個人的にスッキリする。  
文 (statement)  
- 一つの実行の単位となるSQL。  
- 文の末尾には';'を付けることができる(製品によっては付けないといけない)  
- そのまとまりが実行できるなら、文と称しても問題ない。  
式 (experssion)  
- スカラ値や式を表す。  
述語 (Predicates)  
- 論理演算の結果(true/false/unknown)を返す。  
- 条件式の中などで使用。  
演算子 (operator)
関数 (function)

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
### 列エイリアスAS (clause)
クエリ実行中に列に一時的な名前を割り当てる。  
※ASは省略可  
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
### DISTINCT (clause, operator)
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
  bcolorの重複グループの最初の行にあるbcolor, fcolorを結果セットとする。
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
SELECTで評価される行をフィルタリングするための条件を指定する。  
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
|LIKE|値がパターンにマッチした場合に真を返します。<br>（%）は、0文字以上の任意文字に一致<br>（_）は、任意の1文字に一致|
|IS NULL|値がNULLの場合は真を返します。|
|NOT|他の演算子の真偽値を入れ替える。|
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

/*
  サブクエリとIN演算子の使用
  CASTで「日付 + 時刻両方」⇒「日付」に変換している。
*/
SELECT
	customer_id,
	first_name,
	last_name
FROM
	customer
WHERE
	customer_id IN (
		SELECT customer_id
		FROM rental
		WHERE CAST (return_date AS DATE) = '2005-05-27'
	)
ORDER BY customer_id;
```
### LIMIT(clause), LIMIT OFFSET(clause)
クエリが返す行数を制限する。  
指定値が0の場合、クエリは空の集合を返す。  
NULLの場合クエリはLIMIT句を持たないため、同じ結果セットを返します。  
指定値を返す前に行数を飛ばしたい場合は、LIMIT句の後にOFFSET句を使用します。  
行の順序を制御するために必ずORDER BY句を使用しなければならない。  
また、LIMIT句は、MySQL、H2、HSQLDBなどの多くのリレーショナルデータベース管理システムで広く使用されているが、SQL標準ではない。  
SQL標準に準拠するために、PostgreSQLはFETCHクエリによって返される行数を取得する句をサポートしている。(次項)  
```SQL
SELECT
	film_id,
	title,
	release_year
FROM
	film
ORDER BY
	film_id
LIMIT 4 OFFSET 3;
```
### FETCH (clause), OFFSET FETCH (clause)
クエリによって返された行の一部を取得する。  
行の順序を制御するために必ずORDER BY句を使用しなければならない。  
```SQL
/*
  タイトルで昇順でソートされた映画の最初の10行を結果セットとする。
*/
SELECT
    film_id,
    title
FROM
    film
ORDER BY
    title 
FETCH FIRST 10 ROW ONLY;

/*
  OFFSETの使用
  タイトルで昇順ソートされた映画の5～10行目の映画を結果セットとする。
*/
SELECT
    film_id,
    title
FROM
    film
ORDER BY
    title 
OFFSET 5 ROWS 
FETCH FIRST 5 ROW ONLY;
```
### JOIN系
PostgreSQLは、内部結合、左結合、右結合、完全外部結合、クロス結合、自然結合、および自己結合と呼ばれる特別な種類の結合をサポートしている。  
それぞれ関連テーブル間の共通カラムの値に基づいて、1つ以上のテーブルからのカラムを結合するために使用される。  
↓内部, 外部, 完全結合  
![An image](/sqljoinimages/PostgreSQL-Joins-768x465.png)
#### INNER JOIN句
INNER JOINは、最初のテーブル( basket_a)を取得し、fruit_a列と次のテーブル( basket_b)のfruit_b列を順に比較します。値が一致した両方のテーブルの列を含む新しい行を作成し、結果セットに追加します。
![An image](/sqljoinimages/PostgreSQL-Join-Inner-Join.png)
```SQL
# SELECT * FROM basket_a;
#  a | fruit_a
# ---+----------
#  1 | Apple
#  2 | Orange
#  3 | Banana
#  4 | Cucumber
# インデックス:
#     "basket_a_pkey" PRIMARY KEY, btree (a)

# SELECT * FROM basket_b;
#  b |  fruit_b
# ---+------------
#  1 | Orange
#  2 | Apple
#  3 | Watermelon
#  4 | Pear
# インデックス:
#     "basket_b_pkey" PRIMARY KEY, btree (b)

SELECT
    a,
    fruit_a,
    b,
    fruit_b
FROM
    basket_a
INNER JOIN basket_b
    ON fruit_a = fruit_b;
#  a | fruit_a | b | fruit_b
# ---+---------+---+---------
#  1 | Apple   | 2 | Apple
#  2 | Orange  | 1 | Orange
```
サンプルDBでの3テーブルのINNER JOIN  
![An image](/sqljoinimages/customer-payment-staff-tables.png)
```SQL
/*
  支払い履歴を調べる
*/
SELECT
	c.customer_id,
	c.first_name customer_first_name,
	c.last_name customer_last_name,
	s.first_name staff_first_name,
	s.last_name staff_last_name,
	amount,
	payment_date
FROM
	customer c
INNER JOIN payment p 
    ON p.customer_id = c.customer_id
INNER JOIN staff s 
    ON p.staff_id = s.staff_id
ORDER BY payment_date
LIMIT 10;
#  customer_id | customer_first_name | customer_last_name | staff_first_name | staff_last_name | amount |        payment_date
# -------------+---------------------+--------------------+------------------+-----------------+--------+----------------------------
#          416 | Jeffery             | Pinson             | Jon              | Stephens        |   2.99 | 2007-02-14 21:21:59.996577
#          516 | Elmer               | Noe                | Jon              | Stephens        |   4.99 | 2007-02-14 21:23:39.996577
#          239 | Minnie              | Romero             | Mike             | Hillyer         |   4.99 | 2007-02-14 21:29:00.996577
#          592 | Terrance            | Roush              | Jon              | Stephens        |   6.99 | 2007-02-14 21:41:12.996577
#           49 | Joyce               | Edwards            | Mike             | Hillyer         |   0.99 | 2007-02-14 21:44:52.996577
#          264 | Gwendolyn           | May                | Jon              | Stephens        |   3.99 | 2007-02-14 21:44:53.996577
#           46 | Catherine           | Campbell           | Mike             | Hillyer         |   4.99 | 2007-02-14 21:45:29.996577
#          481 | Herman              | Devore             | Jon              | Stephens        |   2.99 | 2007-02-14 22:03:35.996577
#          139 | Amber               | Dixon              | Jon              | Stephens        |   2.99 | 2007-02-14 22:11:22.996577
#          595 | Terrence            | Gunderson          | Jon              | Stephens        |   2.99 | 2007-02-14 22:16:01.996577
```
#### LEFT JOIN句 (LEFT OUTER JOIN句)
LEFT JOINは、左テーブル( basket_a)からデータを取得し、fruit_a列の値と、 右テーブル（basket_b）のfruit_b列の値を順に比較します。  
値が一致した場合、LEFT JOINは両方のテーブルの列を含む新しい行を作成し、この新しい行を結果セットに追加します。(結果セットの行#1と#2を参照)。  
値が一致しない場合も、同様に新しい行を作成し結果セットに追加します。しかし、右のテーブル( basket_b)の列をnullで埋めます。(結果セットの行#3と#4を参照してください)。  
LEFT JOINとLEFT OUTER JOINは同義。  
RIGHT JOINは逆の動作をする。  
![An image](/sqljoinimages/PostgreSQL-Join-Left-Join.png)  
↓左テーブルのみに存在する行を選択した場合  
![An image](/sqljoinimages/PostgreSQL-Join-Left-Join-with-Where.png)  
```SQL
# SELECT * FROM basket_a;
#  a | fruit_a
# ---+----------
#  1 | Apple
#  2 | Orange
#  3 | Banana
#  4 | Cucumber
# インデックス:
#     "basket_a_pkey" PRIMARY KEY, btree (a)

# SELECT * FROM basket_b;
#  b |  fruit_b
# ---+------------
#  1 | Orange
#  2 | Apple
#  3 | Watermelon
#  4 | Pear
# インデックス:
#     "basket_b_pkey" PRIMARY KEY, btree (b)

SELECT
    a,
    fruit_a,
    b,
    fruit_b
FROM
    basket_a
LEFT JOIN basket_b 
   ON fruit_a = fruit_b;
#  a | fruit_a  | b | fruit_b
# ---+----------+---+---------
#  1 | Apple    | 2 | Apple
#  2 | Orange   | 1 | Orange
#  3 | Banana   |   | 
#  4 | Cucumber |   |

/*
  左テーブルのみに存在する行を結果セットとする。
*/
SELECT
    a,
    fruit_a,
    b,
    fruit_b
FROM
    basket_a
LEFT JOIN basket_b 
    ON fruit_a = fruit_b
WHERE b IS NULL;
#  a | fruit_a  | b | fruit_b
# ---+----------+---+---------
#  3 | Banana   |   |
#  4 | Cucumber |   |
```
サンプルDBでの3テーブルのLEFT JOIN  
![An image](/sqljoinimages/film-and-inventory-tables.png)
```SQL
/*
  DVDの在庫を調べる
*/
SELECT
	film.film_id,
	title,
	inventory_id
FROM
	film
LEFT JOIN inventory 
    ON inventory.film_id = film.film_id
ORDER BY title;

/*
  在庫のないDVDを調べる
*/
SELECT
	f.film_id,
	title,
	inventory_id
FROM
	film f
LEFT JOIN inventory i
   ON i.film_id = f.film_id
WHERE i.film_id IS NULL
ORDER BY title;
```
#### FULL OUTER JOIN句
完全外部結合または完全結合は、左右両方のテーブルのすべての行を含む結果セットを返す。  
一致する行がない場合、テーブルの列はNULLで埋める。  
![An image](/sqljoinimages/PostgreSQL-Join-Full-Outer-Join.png)  
↓各テーブルにのみ存在する行を選択した場合  
![An image](/sqljoinimages/PostgreSQL-Join-Full-Outer-Join-with-Where.png)  
```SQL
# SELECT * FROM basket_a;
#  a | fruit_a
# ---+----------
#  1 | Apple
#  2 | Orange
#  3 | Banana
#  4 | Cucumber
# インデックス:
#     "basket_a_pkey" PRIMARY KEY, btree (a)

# SELECT * FROM basket_b;
#  b |  fruit_b
# ---+------------
#  1 | Orange
#  2 | Apple
#  3 | Watermelon
#  4 | Pear
# インデックス:
#     "basket_b_pkey" PRIMARY KEY, btree (b)

SELECT
    a,
    fruit_a,
    b,
    fruit_b
FROM
    basket_a
FULL OUTER JOIN basket_b 
    ON fruit_a = fruit_b;
#  a | fruit_a  | b |  fruit_b
# ---+----------+---+------------
#  1 | Apple    | 2 | Apple
#  2 | Orange   | 1 | Orange
#  3 | Banana   |   |
#  4 | Cucumber |   | 
#    |          | 3 | Watermelon
#    |          | 4 | Pear

/*
  各テーブルにのみ存在する行を結果セットとする。
*/
SELECT
    a,
    fruit_a,
    b,
    fruit_b
FROM
    basket_a
FULL JOIN basket_b 
   ON fruit_a = fruit_b
WHERE a IS NULL OR b IS NULL;
#  a | fruit_a  | b |  fruit_b
# ---+----------+---+------------
#  3 | Banana   |   |
#  4 | Cucumber |   |
#    |          | 3 | Watermelon
#    |          | 4 | Pear
```
#### SELF JOIN
階層的なデータを問い合わせたり、同じテーブル内の行を比較したりするために自己結合を使用する。  
![An image](/sqljoinimages/film_table.png)  
```SQL
/*
  同じ長さの映画のすべての組み合わせを検索調べる。
*/
SELECT
    f1.title,
    f2.title,
    f1.length
FROM
    film f1
INNER JOIN film f2 
    ON f1.film_id <> f2.film_id AND 
       f1.length = f2.length;
```
#### CROSS JOIN句
2つの以上のテーブル内の行の積集合を求める為に使用する。  
![An image](/sqljoinimages/PostgreSQL-CROSS-JOIN-illustration.png)  
```SQL
SELECT *
FROM T1
CROSS JOIN T2;

# label | score
# -------+-------
#  A     |     1
#  B     |     1
#  A     |     2
#  B     |     2
#  A     |     3
#  B     |     3
```
### テーブルエイリアスAS (clause)
クエリの実行中にテーブルに新しい名前を一時的に割り当てる。  
※ASは省略可  
JOIN句を使用して、同じ列名を持つ複数のテーブルからデータをクエリする場合、複数のテーブルに由来する同じ列名を完全に修飾(table_name.column_name)せずに使用すると、エラーが発生する。  
その場合FROMおよびJOIN句でテーブル名のテーブルエイリアスを使用する。  
```SQL
/*
  JOINでのテーブルエイリアスの使用
  クエリの見通しを良くする
*/
SELECT
	c.customer_id,
	first_name,
	amount,
	payment_date
FROM
	customer c
INNER JOIN payment p 
    ON p.customer_id = c.customer_id
ORDER BY 
   payment_date DESC;

/*
  自己結合
  同じクエリでテーブルを2回参照する
*/
SELECT
    e.first_name employee,
    m .first_name manager
FROM
    employee e
INNER JOIN employee m 
    ON m.employee_id = e.manager_id
ORDER BY manager;
```
### GROUP BY (clause)
行をグループに分割する。  
GROUP BY句は集計関数と共に使用できるが、集計関数の使用は必須ではない。  
サンプルDBのpaymentテーブルでの例  
![An image](/sqljoinimages/payment.png)  
```SQL
/*
  SUM関数の使用
  各顧客の支払い合計金額を調べる。
*/
SELECT
	customer_id,
	SUM (amount)
FROM
	payment
GROUP BY
	customer_id
ORDER BY
	SUM (amount) DESC;

#  customer_id |  sum
# -------------+--------
#          148 | 211.55
#          526 | 208.58
#          178 | 194.61
#          137 | 191.62
#          144 | 189.60
#          459 | 183.63
#          181 | 167.67
#          410 | 167.62
#          236 | 166.61
#          403 | 162.67

/*
  JOINと共に使用する。
*/
SELECT
	first_name || ' ' || last_name full_name,
	SUM (amount) amount
FROM
	payment
INNER JOIN customer USING (customer_id)    	
GROUP BY
	full_name
ORDER BY amount;

#     full_name    | amount
# -----------------+--------
#  Brian Wyman     |  27.93
#  Leona Obrien    |  32.90
#  Caroline Bowman |  37.87
#  Anthony Schwab  |  47.85
#  Tiffany Jordan  |  49.88
#  Kirk Stclair    |  50.83
#  Bobbie Craig    |  52.81
#  Jo Fowler       |  54.85
#  Penny Neal      |  56.84
#  Johnny Turpin   |  57.81

/*
  COUNT関数の使用
*/
SELECT
	staff_id,

	COUNT (payment_id)
FROM
	payment
GROUP BY
	staff_id;

#  staff_id | count
#----------+-------
#        1 |  7292
#        2 |  7304

/*
  複数列での使用
*/
SELECT 
	customer_id, 
	staff_id, 
	SUM(amount) 
FROM 
	payment
GROUP BY 
	staff_id, 
	customer_id
ORDER BY 
    customer_id;

#  customer_id | staff_id |  sum
# -------------+----------+-------
#            1 |        1 | 60.85
#            1 |        2 | 53.85
#            2 |        1 | 55.86
#            2 |        2 | 67.88
#            3 |        1 | 59.88
#            3 |        2 | 70.88
#            4 |        1 | 49.88
#            4 |        2 | 31.90
#            5 |        1 | 63.86
#            5 |        2 | 70.79
```
#### GROUPING SETS
GROUPING SETSを使用すると、1つのクエリで複数のグループ化セットを定義することができる。  
まず下記のコードブロックに示すように、GROUP BY句の意味をもう一度考える。  
次のコードブロックまで飛ばしてもOK  
```SQL
#  brand | segment | quantity
# -------+---------+----------
#  ABC   | Premium |      100
#  ABC   | Basic   |      200
#  XYZ   | Premium |      100
#  XYZ   | Basic   |      300

/*
  ブランドで販売されている製品の数を返す。
  (brandのグループを定義している)
*/
SELECT
    brand,
    SUM (quantity)
FROM
    sales
GROUP BY
    brand;

#  brand | sum
# -------+-----
#  ABC   | 300
#  XYZ   | 400

/*
  すべてのブランドとセグメントで販売された製品の数を返す。
  (空のグループを定義している)
*/

SELECT SUM (quantity) FROM sales;

#  sum
# -----
#  700

/*
1つクエリをで、複数のグループ化セットを取得する。
これを実現するには、UNION ALLを使用して上記のすべてのクエリを組み合わせる。
UNION ALLでは、すべての結果セットが互換性のあるデータ型で同じ数の列を持つ必要があるため、
以下のようにそれぞれの選択リストにNULLを追加してクエリを調整する必要があります。
*/
SELECT
    brand,
    segment,
    SUM (quantity)
FROM
    sales
GROUP BY
    brand,
    segment

UNION ALL

SELECT
    brand,
    NULL,
    SUM (quantity)
FROM
    sales
GROUP BY
    brand

UNION ALL

SELECT
    NULL,
    segment,
    SUM (quantity)
FROM
    sales
GROUP BY
    segment

UNION ALL

SELECT
    NULL,
    NULL,
    SUM (quantity)
FROM
    sales;

#  brand | segment | sum
# -------+---------+-----
#  XYZ   | Basic   | 300
#  ABC   | Premium | 100
#  ABC   | Basic   | 200
#  XYZ   | Premium | 100
#  ABC   |         | 300
#  XYZ   |         | 400
#        | Basic   | 500
#        | Premium | 200
#        |         | 700
```
このようにUNION ALL等を使用して、複数にグループを1つのクエリで取得する場合、
- クエリが長くなる。
- UNION前のクエリ毎にテーブルをスキャンしなければならないため、パフォーマンスの問題が生じる。  
これらの問題を解決し、より効率的にするためにGROUP BY句のサブ句であるGROUPING SETS句が存在する。  
前述の通り、GROUPING SETSを使用すると、1つのクエリで複数のグループ化セットを定義することができる。  
```SQL
#  brand | segment | quantity
# -------+---------+----------
#  ABC   | Premium |      100
#  ABC   | Basic   |      200
#  XYZ   | Premium |      100
#  XYZ   | Basic   |      300

/*
  
  複数のグループ化セットを取得する。
*/
SELECT
    brand,
    segment,
    SUM (quantity)
FROM
    sales
GROUP BY
    GROUPING SETS (
        (brand, segment),
        (brand),
        (segment),
        ()
    );

#  brand | segment | sum
# -------+---------+-----
#        |         | 700
#  XYZ   | Basic   | 300
#  ABC   | Premium | 100
#  ABC   | Basic   | 200
#  XYZ   | Premium | 100
#  ABC   |         | 300
#  XYZ   |         | 400
#        | Basic   | 500
#        | Premium | 200
```
#### GROUPING (function)
列名または式を受け入れ、GROUP BY 節で指定されたものと一致する必要がある。  
引数が現在のグループ化セットのメンバであればビット 0 を返し、そうでなければビット 1 を返す。  
HAVING句でGROUPING関数を使うと、各ブランドの小計を見つけることができます。  
```SQL
/*
  GROUPING関数の使用
*/
SELECT
	GROUPING(brand) grouping_brand,
	GROUPING(segment) grouping_segment,
	brand,
	segment,
	SUM (quantity)
FROM
	sales
GROUP BY
	GROUPING SETS (
		(brand),
		(segment),
		()
	)
ORDER BY
	brand,
	segment;

#  grouping_brand | grouping_segment | brand | segment | sum
# ----------------+------------------+-------+---------+-----
#               0 |                1 | ABC   |         | 300
#               0 |                1 | XYZ   |         | 400
#               1 |                0 |       | Basic   | 500
#               1 |                0 |       | Premium | 200
#               1 |                1 |       |         | 700

/*
  HAVING句でのGROUPING関数の使用
*/
SELECT
	GROUPING(brand) grouping_brand,
	GROUPING(segment) grouping_segment,
	brand,
	segment,
	SUM (quantity)
FROM
	sales
GROUP BY
	GROUPING SETS (
		(brand),
		(segment),
		()
	)
HAVING GROUPING(brand) = 0	
ORDER BY
	brand,
	segment;

#  grouping_brand | grouping_segment | brand | segment | sum
# ----------------+------------------+-------+---------+-----
#               0 |                1 | ABC   |         | 300
#               0 |                1 | XYZ   |         | 400
```
#### CUBE
GROUP BY句のサブ句です。  
CUBEを使用すると、複数のグループ化セットを生成することができます。  
最初に、SELECT 文の GROUP BY 節で CUBE サブ句を指定します。  
2 番目に、SELECT リストで、分析する列 (ディメンジョンまたはディメンジョン列) と集計関数式を指定します。  
3 番目に、GROUP BY 節で、CUBE サブ句の括弧内のディメンジョン・カラムを指定します。  
クエリは、CUBE で指定されたディメンジョン列に基づいて、可能なすべてのグループ化セットを生成します。  
一般的に、CUBEで指定した列の数をn個とすると、2^n個の組み合わせになります。  
下記は同じ意味を表します。  
```SQL
CUBE(c1,c2,c3) 

GROUPING SETS (
    (c1,c2,c3), 
    (c1,c2),
    (c1,c3),
    (c2,c3),
    (c1),
    (c2),
    (c3), 
    ()
 ) 
```
```SQL
#  brand | segment | quantity
# -------+---------+----------
#  ABC   | Premium |      100
#  ABC   | Basic   |      200
#  XYZ   | Premium |      100
#  XYZ   | Basic   |      300

SELECT
    brand,
    segment,
    SUM (quantity)
FROM
    sales
GROUP BY
    CUBE (brand, segment)
ORDER BY
    brand,
    segment;

#  brand | segment | sum
# -------+---------+-----
#  ABC   | Basic   | 200
#  ABC   | Premium | 100
#  ABC   |         | 300
#  XYZ   | Basic   | 300
#  XYZ   | Premium | 100
#  XYZ   |         | 400
#        | Basic   | 500
#        | Premium | 200
#        |         | 700

```
#### ROLLUP
GROUP BY句のサブ句です。  
ROLLUPを使用すると、複数のグループ化セットを生成することができます。  
CUBEサブ句とは異なり、ROLLUPは指定された列に基づいて可能なすべてのグループ化セットを生成しません。  
選択列のサブセットを作成するだけです。  
入力カラム間の階層を想定し、その階層を考慮して意味のあるすべてのグループ化セットを生成します。  
ROLLUPがレポートの小計や総計を生成するのによく使われる理由です。  
ROLLUPの一般的な使用法は、年>月>日の階層を考慮して、年、月、日ごとのデータの集計を計算することです。  
下記は同じ意味を表します。  
```SQL
ROLLUP(c1,c2,c3)

GROUPING SETS (
    (c1, c2, c3)
    (c1, c2)
    (c1)
    ()
 ) 
```
サンプルテーブルsalesの例  
出力を見るとよくわかるように、3列目はABCブランドの売上高、6列目はXYZブランドの売上高を表示しています。  
最後の行は、すべてのブランドとセグメントの合計を表示しています。  
この例では、ブランド > セグメントという階層になっています。
```SQL
#  brand | segment | quantity
# -------+---------+----------
#  ABC   | Premium |      100
#  ABC   | Basic   |      200
#  XYZ   | Premium |      100
#  XYZ   | Basic   |      300

SELECT
    brand,
    segment,
    SUM (quantity)
FROM
    sales
GROUP BY
    ROLLUP (brand, segment)
ORDER BY
    brand,
    segment;
```
サンプルDB、rentalテーブルでの例  
![An image](/sqljoinimages/rental.png)  
```SQL
/*
  ROLLUPを使って1日、1ヶ月、1年あたりのレンタル数を求めます。
*/
SELECT
    EXTRACT (YEAR FROM rental_date) y,
    EXTRACT (MONTH FROM rental_date) M,
    EXTRACT (DAY FROM rental_date) d,
    COUNT (rental_id)
FROM
    rental
GROUP BY
    ROLLUP (
        EXTRACT (YEAR FROM rental_date),
        EXTRACT (MONTH FROM rental_date),
        EXTRACT (DAY FROM rental_date)
    );

#   y   | m | d  | count
# ------+---+----+-------
#  2005 | 5 | 24 |     8
#  2005 | 5 | 25 |   137
#  2005 | 5 | 26 |   174
#  2005 | 5 | 27 |   166
#  2005 | 5 | 28 |   196
#  2005 | 5 | 29 |   154
#  2005 | 5 | 30 |   158
#  2005 | 5 | 31 |   163
#  2005 | 5 |    |  1156
#  2005 | 6 | 14 |    16
#  2005 | 6 | 15 |   348
```
### HAVING (clause)
グループや集計の検索条件を指定する。  
WHERE ⇒ GROUP BY ⇒ HAVING ⇒ SELECT  
WHERE句は行に適用され、HAVING句は行のグループに適用される。  
サンプルDBのpaymentテーブルでの例  
![An image](/sqljoinimages/payment.png)  
```SQL
/*
  200ドル以上の支出をしている顧客を調べる。
*/
SELECT
	customer_id,
	SUM (amount)
FROM
	payment
GROUP BY
	customer_id
HAVING
	SUM (amount) > 200;

#  customer_id |  sum
# -------------+--------
#          526 | 208.58
#          148 | 211.55
```
### UNION (operator)
複数のクエリの結果セットを1つの結果セットに結合する。  
どちらかの結果セットで利用可能な行を返す。  
UNION演算子は結合された結果セットからすべての重複した行を削除するため、重複した行を保持したい場合、UNION ALLを使用する必要がある。  
UNION演算子を実行するためには下記の条件を満たしている必要がある。  
- 両方のクエリの結果セットはカラムの数と順序が同じでなければならない。
- データ型には互換性が無ければいけない。
最終的な結果セットの行をソートするには、2番目のクエリでORDER BY句を使用する。  
完全に正規化されていない類似のテーブルからのデータを結合するためにUNION演算子を使用することがよくある。  
UNIONの動作を示す。  
![An image](/sqljoinimages/PostgresQL-UNION.png)  
```SQL
#           title           | release_year
# --------------------------+--------------
#  The Shawshank Redemption |         1994
#  The Godfather            |         1972
#  12 Angry Men             |         1957
# 
#         title        | release_year
# --------------------+--------------
#  An American Pickle |         2020
#  The Godfather      |         1972
#  Greyhound          |         2020

/*
  UNION演算子の使用
*/
SELECT * FROM top_rated_films
UNION
SELECT * FROM most_popular_films;
#           title           | release_year
# --------------------------+--------------
#  An American Pickle       |         2020
#  Greyhound                |         2020
#  The Shawshank Redemption |         1994
#  The Godfather            |         1972
#  12 Angry Men             |         1957

/*
  UNION ALL演算子の使用
*/
SELECT * FROM top_rated_films
UNION ALL
SELECT * FROM most_popular_films
ORDER BY title;

#           title           | release_year
# --------------------------+--------------
#  12 Angry Men             |         1957
#  An American Pickle       |         2020
#  Greyhound                |         2020
#  The Godfather            |         1972
#  The Godfather            |         1972
#  The Shawshank Redemption |         1994
```
### INTERSECT (operator)
複数のクエリの結果セットを1つの結果セットに結合する。  
両方の結果セットで利用可能な行を返す。  
INTERSECT演算子を実行するためには下記の条件を満たしている必要がある。  
- 両方のクエリの結果セットはカラムの数と順序が同じでなければならない。
- データ型には互換性が無ければいけない。
INTERSECTの動作を示す。  
![An image](/sqljoinimages/PostgreSQL-INTERSECT-Operator-300x206.png)  
最終的な結果セットの行をソートするには、2番目のクエリでORDER BY句を使用する。  
```SQL
#           title           | release_year
# --------------------------+--------------
#  The Shawshank Redemption |         1994
#  The Godfather            |         1972
#  12 Angry Men             |         1957
# 
#         title        | release_year
# --------------------+--------------
#  An American Pickle |         2020
#  The Godfather      |         1972
#  Greyhound          |         2020

/*
  INTERSECT演算子の使用
*/
SELECT *
FROM most_popular_films 
INTERSECT
SELECT *
FROM top_rated_films;

#      title     | release_year
# ---------------+--------------
#  The Godfather |         1972
```
### EXCEPT
複数のクエリの結果セットを1つの結果セットに結合する。  
最初の結果セットに存在し、2番目の結果セットに存在しない行を返す。  
EXCEPTの動作を示す。  
![An image](/sqljoinimages/PostgreSQL-EXCEPT-300x202.png)  
```SQL
#           title           | release_year
# --------------------------+--------------
#  The Shawshank Redemption |         1994
#  The Godfather            |         1972
#  12 Angry Men             |         1957
# 
#         title        | release_year
# --------------------+--------------
#  An American Pickle |         2020
#  The Godfather      |         1972
#  Greyhound          |         2020

/*
  EXCEPT演算子の使用
*/
SELECT * FROM top_rated_films
EXCEPT 
SELECT * FROM most_popular_films
ORDER BY title;

#           title           | release_year
# --------------------------+--------------
#  12 Angry Men             |         1957
#  The Shawshank Redemption |         1994
```
