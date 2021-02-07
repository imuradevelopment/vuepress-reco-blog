---
title: Git
date: 2020-10-01
categories:
 - Git
 - バージョン管理
tags:
 - Git
 - バージョン管理
publish: true
sticky: 1
isTimeLine: true
sidebar: true
isComment: false
---

# Git

```ps1
# ログ系
# 1行表示
git log --oneline

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

```
