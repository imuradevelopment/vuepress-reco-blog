---
title: postgreSQLチートシート
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
# postgreSQLチートシート

|        列        |           タイプ            | 照合順序 | Null 値を許容 |              デフォルト|
|------------------|-----------------------------|----------|---------------|---------------------------------------      |
| film_id          | integer                     |          | not null      | nextval('film_film_id_seq'::regclass)       |
| title            | character varying(255)      |          | not null      ||
| description      | text                        |          |               ||
| release_year     | year                        |          |               ||
| language_id      | smallint                    |          | not null      ||
| rental_duration  | smallint                    |          | not null      | 3|
| rental_rate      | numeric(4,2)                |          | not null      | 4.99|
| length           | smallint                    |          |               ||
| replacement_cost | numeric(5,2)                |          | not null      | 19.99|
| rating           | mpaa_rating                 |          |               | 'G'::mpaa_rating|
| last_update      | timestamp without time zone |          | not null      | now()|
| special_features | text[]                      |          |               | |
| fulltext         | tsvector                    |          | not null      ||
```SQL
インデックス:
    "film_pkey" PRIMARY KEY, btree (film_id)
    "film_fulltext_idx" gist (fulltext)
    "idx_fk_language_id" btree (language_id)
    "idx_title" btree (title)
外部キー制約:
    "film_language_id_fkey" FOREIGN KEY (language_id) REFERENCES language(language_id) ON UPDATE CASCADE ON DELETE RESTRICT
参照元:
    TABLE "film_actor" CONSTRAINT "film_actor_film_id_fkey" FOREIGN KEY (film_id) REFERENCES film(film_id) ON UPDATE CASCADE ON DELETE RESTRICT
    TABLE "film_category" CONSTRAINT "film_category_film_id_fkey" FOREIGN KEY (film_id) REFERENCES film(film_id) ON UPDATE CASCADE ON DELETE RESTRICT
    TABLE "inventory" CONSTRAINT "inventory_film_id_fkey" FOREIGN KEY (film_id) REFERENCES film(film_id) ON UPDATE CASCADE ON DELETE RESTRICT
トリガー:
    film_fulltext_trigger BEFORE INSERT OR UPDATE ON film FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger('fulltext', 'pg_catalog.english', 'title', 'description')
    last_updated BEFORE UPDATE ON film FOR EACH ROW EXECUTE FUNCTION last_updated()
```
