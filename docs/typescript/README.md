---
title: TypeScript
date: 2020-10-01
categories:
 - TypeScript
tags:
 - TypeScript
publish: true
isTimeLine: true
sidebar: true
isComment: false
---

# typescript

javascriptにコンパイルされる、静的型システムがついた上位集合

1. 型検査に通るように書く
1. javascriptの文法が使える

## インストール

```sh
npm install -g typescript
```

tsc(コンパイル)が使えるようになる  
仕組み的にできない構文もあるので「es6 compat table」等で検索して調べられる。  

```sh
tsc xxx.ts
tsc xxx.ts --target 2015
tsc xxx.ts --target ES6
```

## なぜtypescript?

1. [ドキュメントとしての側面を利用するため](#ドキュメントとしての側面を利用するため)
1. [Linterとしての側面を利用するため](#Linterとしての側面を利用するため)
1. [ES5へのコンパイラとしての側面を利用するため](#ES5へのコンパイラとしての側面を利用するため)

### ドキュメントとしての側面を利用するため

関数等のdocが使える(javadoc的なもの)  
?の引数は任意  

### Linterとしての側面を利用するため

Linter：実行前にコードが正しいか検証するツール  
コンパイル時にエラー検知できる(実行してからポチポチせずに分かる)  
エディタにtypescriptが内臓されていると書いてる最中にわかる便利  
⇒他のListでは使えない型での判別がある  
⇒typescriptとして間違っていてもjsファイルはコンパイルされる  

### ES5へのコンパイラとしての側面を利用するため(Babel的な)

ESXに対応していないブラウザにも対応できる(ES5は主流ブラウザで対応済み)  
つまり、古いブラウザに対しても新しい文法で書ける  
デフォルトではES3にコンパイル(トランスパイル)  

## typescript実践

[typescriptの型の記述](#typescriptの型の記述)
[コンパイラを使う方法](#コンパイラを使う方法)
[typescriptでのClassの使い方](#typescriptでのClassの使い方)
[inteface](#inteface)
[応用型](#応用型)
[ジェネリクス(型の引数)](#ジェネリクス(型の引数))
[デコレーター(＠とか)](#デコレーター(＠とか))
[健康管理アプリ作成](#健康管理アプリ作成)
[モジュールとwebpack](#モジュールとwebpack)
[typescriptでのjavascriptライブラリの使い方](#typescriptでのjavascriptライブラリの使い方)
[typescriptで始めるreact.js](#typescriptで始めるreact.js)

### typescriptの型の記述

1. 「typescriptの型」と「javascriptの型」
    tsとjsの型がそれぞれある。
    1. typescript  
        tsc(jsではなくtsの型検査)⇒js変換
    1. javascript  
        javascriptエンジン(V8エンジン等)で変換される(バイナリ)が  
        型の概念はある(not a number等のエラーが返ってくる)
1. boolean型, number型, string型

    ```typescript
    // boolean
    let hasValue: boolean = true;
    // number
    let count: number = 10;
    let float: number = 3.14;
    let negative: number = -10;
    // string
    let single: string = "hello";
    let double: string = "hello";
    let backq: string = `hello`;

    ```

1. 「型注釈」と「推論型」
    注釈型⇒「: 型名」
    推論型⇒「代入している値から推測する」
    基本的に推論型でOKで、型推論ができない場合のみ注釈型を使う。
1. オブジェクトに型をつける

    ```typescript
    // object(カンマではなくセミコロン)
    const person: {
    // すべての型を定義する
    name: string;
    age: number;
    } = {
    name: "jack",
    age: 21,
    };
    ```

1. 配列に型をつけるArray型はこう使う

    ```typescript
    // Array
    const fruits: string[] = ["Apple", "Banana", "Grape"];
    ```

1. Tuple型を使用して、決まった内容の配列を作る

    ```typescript
    // Tuple(pushでは追加できる)
    const book: [string, number, boolean] = ["business", 1500, false];
    book.push(21);
    // 参照時にエラーが出る
    console.log(book[3]);
    ```

1. Enum型を使ってまとまったグループを分かりやすく定義する列挙型を使う方法
    特定のまとまったグループのみを受け入れる。  

    ```typescript
    // Enum
    enum CoffeSize {
    SHORT = "SHORT",
    TALL = "TALL",
    GRANDE = "GRANDE",
    VENTI = "VENTI"
    }
    // Enum(初期化なしでもOK)
    enum CoffeSize {
    SHORT,
    TALL,
    GRANDE,
    VENTI
    }

    const coffee = {
    hot: true,
    size: CoffeSize.TALL
    }
    ```

1. どんな方にもなるany型について知る  

    ```typescript
    //any(typescriptは関与しない)
    let anything: any = true;
    anything = "hello";
    let num = 1;
    ```

1. Union型を使って複数の型を使う方法  

    ```typescript
    //union
    //代入されている値によって使えるメソッド等が変わる
    let unionType: number | string = 10;
    unionType = "Hello";
    let unionTypes: (number | string)[] = [10, "heelo"];
    ```

1. Literal型を使って特定の値のみを取り扱う方法  

    ```typescript
    //Literal
    //constでliteral型
    //letでstring型として推論される
    const apple: "apple" = "apple";
    //unionと使う事でenum型に似た動きができる
    //objectではなくただの文字列として解釈されるが、
    //数が2,3個であればenumよりもすっきりかける。
    const clothSize:{
    color: string;
    size: "samll" | "medium" | "larde";
    } = {
    color: "white",
    size: "larde"
    }
    ```

1. typeエイリアスを使って複雑な型を適応させる方法

    ```typescript
    //typeエイリアス
    //ClothSize型として使用できるようになる
    type ClothSize = "samll" | "medium" | "larde"
    ```

1. 関数に型を適応させる方法

    ```typescript
    //関数の型
    //戻り値の型は型推論が効くが書いておいた方が無難
    function add(num1: number, num2: number): number {
    return num1 + num2;
    }
    //void：戻り値が存在しないとき(tsc後はundefindを返す)
    //ただし明示的にretun句を用いることでundifind型を定義できる
    function sayAny(anyStr: string):void {
    console.log(anyStr);
    }
    ```

1. 関数型を使って、特例の関数のみを代入できる変数を作る

    ```typescript
    //関数を代入する変数の型(無名関数の場合は=>の左右どちらか型がついていればOK)
    const anoterAdd: (n1: number, n2: number) => number = function (num1, num2) {
    return num1 + num2;
    }

    //アロー関数の場合は左に書く事が多い
    const doubleNumber: (num :number) => number = num => num * 2;
    ```

1. callback関数の型をはこう書く

    ```typescript
    //コールバック関数の型
    function doubleAndHandle(num: number, cb: (num: number) => number): void {
    const doubleNum = cb(num * 2);
    console.log(doubleNum);
    }

    doubleAndHandle(21, doubleNum => {
    return doubleNum
    });
    ```

1. unknown型を使って、柔軟でanyよりも厳しい型を定義する方法

    ```typescript
    //unknown(anyに似ている)
    let unknownInput: unknown;
    let anyInput: any;
    let text: string;
    unknownInput = "hello";
    unknownInput = 21;
    unknownInput = true;
    text = anyInput;
    //typeofで型を確かめてから使う
    if (typeof unknownInput === "string") {
    text = unknownInput;
    }
    ```

1. never型を使って、起こりえない値の型を使用する方法

    ```typescript
    //never
    function error(message: string): never {
    throw new Error(message);
    }
    console.log("This is an Error.");
    ```

### コンパイラを使う方法

1. watchモードで保存時に自動でコンパイル

    ```sh
    tsc index.ts (-w or --watch)
    ```

1. tsconfig.json

    tsconfig.jsonの作成(watchモードと併用可能)  

    ```sh
    tsc --init
    ```

    ```json
    {
        "complerOptions": {
            "target": "es6(デフォルトではes3なので状況に応じて設定)",
            "lib": [
                "ES6",
                "DOM",
                "DOM.Iterable",
                "ScriptHost",
            ],
            "AllowJs": true,
            "CheckJs": true,
            "declaration": true,
            "declarationMap": true,
            "sourceMap": true,
            "outDir": "./dist",
            "rootDir": "./src",
            "removeComments": true,
            "noEmit": true,
            "noEmitOnError": true,
            "downlevelIteration": true,
            "noUnuserdLocals": true,
            "noUnuserdParameters": true,
            },
        "include": [
            "index.ts",
            "ワイルドカードでtscファイルを指定"
        ],
        "exculude": [
            "node_modules(何か設定する場合は再定義が必要)",
            "**/.spec.ts",
            "ワイルドカードで省くファイルを指定"
        ],
        "files": [
            "ワイルドカードが使用できない"
            "include < exculude < files"
        ]
    }
    ```

1. targetを指定して、特定バージョンのJsファイルにコンパイル

1. libを指定して、Typescriptが用意している型の定義を追加する

1. allowJs, checkJs, jsx, declarationMapの設定はこう使う

1. SourceMapを使用して、ブラウザでTypeScriptを操作する方法(デバックしやすくする)

1. outDirとrootDir, removeComments, noEmit, downlevellteration1の使い方

1. noEmitOnErrorオプションを使って、エラーが出たときにコンパイルしない方法

1. nolmplicAnyやstrictNullChecksなどのstrictの設定はこう使う

1. 綺麗なコードを書くための設定をする方法

### typescriptでのClassの使い方

### inteface

### 応用型

### ジェネリクス(型の引数)

### デコレーター(＠とか)

### 健康管理アプリ作成

### モジュールとwebpack

### typescriptでのjavascriptライブラリの使い方

### typescriptで始めるreact.js
