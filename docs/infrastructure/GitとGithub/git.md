---
title: Git
date: 2020-10-01
categories:
 - Git
tags:
 - Git
publish: true
isTimeLine: true
sidebar: true
isComment: false
---

# Git

```ps1
# ログ系
# 1行表示
git log --name-status

# reset系
# 作業コピーのリセット
git checkout .

# リポジトリ整理
# ローカルブランチ表示と削除
git branch
git branch -D ブランチ名 # 未マージでも削除merge
git branch --delete ブランチ名 # マージ済みで駆除
# リモートブランチ削除
git branch --remote
git push --delete origin ブランチ名
# コミットをまとめる

# ログの成形
git log --date=format-local:'%Y/%m/%d %H:%M:%S'  --pretty=format:"  %C(magenta)コミット    : %h%n  日時        : %ad%n  コミットmsg : %s" -1 --name-status

# 出力先が端末のときに色をつけて表示する
git config --global color.ui auto   

```
