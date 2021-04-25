---
title: Djangoで認証をカスタマイズする
date: 2021-04-26
categories:
  - django
tags:
  - django
publish: true
isTimeLine: true
sticky: 1
---

# 目次

[[TOC]]

## Django で認証をカスタマイズする

Django に付属している認証は、ほとんどの一般的なケースでは十分ですが、 すぐに使えるデフォルトでは満たされないニーズがあるかもしれません。プロジェクトで認証をカスタマイズするには、提供されているシステムの どの部分が拡張可能か、あるいは交換可能かを理解する必要があります。このドキュメントでは、認証システムをどのようにカスタマイズできるかについて詳しく説明します。

認証バックエンドは、ユーザモデルに格納されたユーザ名とパスワードを、 Django のデフォルトとは異なるサービスに対して認証する必要がある場合に、 拡張可能なシステムを提供します。

モデルにカスタムパーミッションを与えて、 Django の認証システムでチェックすることができます。

デフォルトの User モデルを拡張したり、完全にカスタマイズしたモデルを代用したりできます。

### その他の認証ソース

別の認証ソース、つまり、ユーザー名やパスワード、認証方法の別のソースに接続する必要がある場合があります。

例えば、LDAP を導入している企業では、社員全員のユーザー名とパスワードが保存されています。もしユーザが LDAP と Django ベースのアプリケーションで別々のアカウントを持っていたら、ネットワーク管理者にとってもユーザ自身にとっても面倒なことになります。

そこで、このような状況に対応するために、 Django の認証システムでは、他の認証ソースを接続することができます。Django のデフォルトのデータベースベースのスキームを上書きすることもできますし、デフォルトのシステムを他のシステムと併用することもできます。

Django に含まれている認証バックエンドの情報は、認証バックエンドリファレンスを参照してください。

### 認証バックエンドの指定について

舞台裏では、Django は認証のためにチェックする「認証バックエンド」のリ ストを管理しています。How to log a user in で説明したように、誰かが django.contrib.auth.authenticate() を呼び出すと、 Django はすべての認証バックエンドで認証を試みます。最初の認証方法が失敗したら、Django は 2 番目の認証方法を試し、それを全てのバックエンドが試されるまで繰り返します。

使用する認証バックエンドのリストは AUTHENTICATION_BACKENDS 設定で指定します。AUTHENTICATION_BACKENDS は、認証方法を知っている Python クラスを指す Python パス名のリストでなければなりません。これらのクラスは、Python パスのどこにあっても構いません。

デフォルトでは、AUTHENTICATION_BACKENDS は次のように設定されています。

```python
['django.contrib.auth.backends.ModelBackend']
```

これは Django のユーザデータベースをチェックしたり、 内蔵のパーミッションを問い合わせたりする基本的な認証バックエンドです。このバックエンドは、レートリミット機構によるブルートフォース攻撃への対策はしていません。独自の速度制限機構をカスタム認証バックエンドに実装するか、ほとんどの Web サーバで提供されている機構を使うか、どちらでも構いません。

AUTHENTICATION_BACKENDS の順番は重要で、同じユーザ名とパスワードが 複数のバックエンドで有効であった場合、Django は最初に一致したものから 処理を停止します。

バックエンドが PermissionDenied 例外を発生させた場合、認証は直ちに失敗します。Django は後続のバックエンドをチェックしません。

::: tip
ユーザが認証されると、Django はそのユーザの認証にどのバックエンドが 使われたかをそのユーザのセッションに保存し、現在認証されているユー ザへのアクセスが必要になると、そのセッションの間は同じバックエンドを再利用 します。これは、事実上、認証ソースがセッションごとにキャッシュされることを意味します。したがって、AUTHENTICATION_BACKENDS を変更した場合、ユーザに異なる方法での再認証を強制する必要がある場合には、セッションデータをクリアする必要があります。これを行う簡単な方法は、Session.objects.all().delete()を実行することです。
:::

### 認証バックエンドの作成

認証バックエンドとは、get_user(user_id)と authenticate(request, \*\*credentials)の 2 つの必須メソッドと、オプションのパーミッション関連の認証メソッドを実装したクラスです。

get_user メソッドは、user_id（ユーザ名、データベース ID など）を受け取り、ユーザオブジェクトまたは None を返します。

authenticate メソッドは、キーワード引数としてリクエスト引数とクレデンシャルを受け取ります。ほとんどの場合、以下のようになります。

```python
from django.contrib.auth.backends import BaseBackend

class MyBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        # Check the username/password and return a user.
        ...
```

しかし、次のようにトークンを認証することもできます。

```python
from django.contrib.auth.backends import BaseBackend

class MyBackend(BaseBackend):
    def authenticate(self, request, token=None):
        # Check the token and return a user.
        ...
```

いずれにしても、authenticate()は取得した認証情報をチェックし、認証情報が有効であれば、その認証情報にマッチしたユーザーオブジェクトを返すべきです。有効でない場合は、None を返します。

request は HttpRequest で、(バックエンドに渡す) authenticate() に提供されていなければ None になります。

Django の admin は Django の User オブジェクトと密接に結びついています。これを扱う最善の方法は、バックエンドに存在するユーザ (LDAP ディレクトリや外部 SQL データベースなど) ごとに Django User オブジェクトを作成することです。これを事前に行うスクリプトを書くか、 authenticate メソッドでユーザが初めてログインしたときに行うことができます。

ここでは、 settings.py ファイルで定義されたユーザ名とパスワードを使って認証し、 ユーザが最初に認証したときに Django User オブジェクトを生成するバックエンドの例を示します。

```python
from django.conf import settings
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User

class SettingsBackend(BaseBackend):
    """
    Authenticate against the settings ADMIN_LOGIN and ADMIN_PASSWORD.

    Use the login name and a hash of the password. For example:

    ADMIN_LOGIN = 'admin'
    ADMIN_PASSWORD = 'pbkdf2_sha256$30000$Vo0VlMnkR4Bk$qEvtdyZRWTcOsCnI/oQ7fVOu1XAURIZYoOZ3iq8Dr4M='
    """

    def authenticate(self, request, username=None, password=None):
        login_valid = (settings.ADMIN_LOGIN == username)
        pwd_valid = check_password(password, settings.ADMIN_PASSWORD)
        if login_valid and pwd_valid:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                # Create a new user. There's no need to set a password
                # because only the password from settings.py is checked.
                user = User(username=username)
                user.is_staff = True
                user.is_superuser = True
                user.save()
            return user
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
```

### カスタムバックエンドでの認証の取り扱いについて

カスタム auth バックエンドは、独自のパーミッションを提供することができます。

ユーザモデルとそのマネージャは、パーミッション検索関数 (get_user_permissions(), get_group_permissions(), get_all_permissions(), has_perm(), has_module_perms(), with_perm()) を、これらの関数を実装している任意の認証バックエンドに委ねます。

ユーザに与えられるパーミッションは、すべてのバックエンドが返すすべての パーミッションのスーパーセットになります。つまり、 Django は、任意のバックエンドが付与するパーミッションをユーザに付与します。

バックエンドが has_perm() や has_module_perms() で PermissionDenied 例外を発生させた場合、認証は直ちに失敗し、Django は後続のバックエンドをチェックしません。

バックエンドは magic admin のパーミッションを次のように実装できます。

```python
from django.contrib.auth.backends import BaseBackend

class MagicAdminBackend(BaseBackend):
    def has_perm(self, user_obj, perm, obj=None):
        return user_obj.username == settings.ADMIN_LOGIN
```

これにより、上の例でアクセスを許可されたユーザにフルパーミッションが与えられます。関連する django.contrib.auth.models.User 関数と同じ引数に加えて、 バックエンドの認証関数は全て、匿名ユーザかもしれない user オブジェクトを引数として取ることに注意してください。

完全な認可の実装は、 django/contrib/auth/backends.py の ModelBackend クラスにあります。これはデフォルトのバックエンドで、ほとんどの場合 auth_permission テーブルに問い合わせます。

#### 匿名ユーザーへの権限付与

匿名ユーザーとは、認証されていないユーザーのことです。しかし、それは必ずしもそのユーザーに何もする権限がないことを意味するものではありません。最も基本的なレベルでは、ほとんどの Web サイトが匿名ユーザにサイトの大部分を 閲覧することを許可していますし、匿名でのコメント投稿なども許可しています。

Django のパーミッションフレームワークには、匿名ユーザのパーミッションを保存する場所がありません。しかし、認証バックエンドに渡されるユーザオブジェクトが django.contrib.auth.models.AnonymousUser オブジェクトであれば、バックエンドが匿名ユーザに対するカスタムの認可動作を指定することができます。これは、再利用可能なアプリの作者にとって特に便利で、匿名アクセスを制御するための設定などを必要とせず、認証に関するすべての問題を auth バックエンドに委ねることができます。

#### オブジェクトパーミッションの扱い方について

Django のパーミッションフレームワークには、オブジェクトパーミッショ ンの基盤がありますが、コアにはそのための実装がありません。つまり、オブジェクトパーミッションをチェックすると、常に False か空のリストが返ってきます (チェックの内容によります)。認証バックエンドは、オブジェクトに関連する各認証メソッドのキーワードパラ メータ obj と user_obj を受け取り、必要に応じてオブジェクトレベルのパーミッシ ョンを返すことができます。

### カスタムパーミッションについて

与えられたモデル・オブジェクトに対してカスタム・パーミッションを作成するには、パーミッション・モデル・メタ属性を使用します。

このタスクモデルの例では、アプリケーションに固有の 2 つのカスタムパーミッション、すなわち、ユーザーがタスクインスタンスに対してできるアクションとできないアクションを作成しています。

```python
class Task(models.Model):
    ...
    class Meta:
        permissions = [
            ("change_task_status", "Can change the status of tasks"),
            ("close_task", "Can remove a task by setting its status as closed"),
        ]
```

manage.py migrate を実行したときに、追加のパーミッションが作成されるだけです（パーミッションを作成する関数は post_migrate シグナルに接続されています）。あなたのコードは、ユーザーがアプリケーションが提供する機能にアクセスしようとしたときに、これらのパーミッションの値をチェックする役割を担っています（タスクの状態を変更したり、タスクを閉じたりします）。上記の例を続けて、以下はユーザーがタスクを閉じることができるかどうかをチェックします。

```python
user.has_perm('app.close_task')
```

### 既存の User モデルの拡張

独自のモデルを作成せずにデフォルトの User モデルを拡張するには、2 つの方法があります。必要な変更が純粋に動作上のものであり、データベースに保存されているものに変更を加える必要がない場合は、User をベースにしたプロキシモデルを作成することができます。これにより、デフォルトの順序付け、カスタムマネージャ、カスタムモデルメソッドなど、プロキシモデルが提供するあらゆる機能を利用することができます。

User に関連する情報を保存したい場合は、OneToOneField を使用して、追加情報用のフィールドを含むモデルを作成することができます。この 1 対 1 のモデルは、サイトのユーザに関する認証に関連しない情報を格納する可能性があるため、しばしばプロファイルモデルと呼ばれます。例えば、Employee モデルを作成することができます。

```python
from django.contrib.auth.models import User

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.CharField(max_length=100)
```

既存の Employee Fred Smith が User モデルと Employee モデルの両方を持っていると仮定すると、 Django の標準的な関連モデルの規約を使って関連情報にアクセスできます。

```python
>>> u = User.objects.get(username='fsmith')
>>> freds_department = u.employee.department
```

プロファイルモデルのフィールドを管理画面のユーザーページに追加するには、アプリの admin.py で InlineModelAdmin (この例では StackedInline を使用します) を定義し、User クラスに登録されている UserAdmin クラスに追加します。

```python
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from my_user_profile_app.models import Employee

# Define an inline admin descriptor for Employee model
# which acts a bit like a singleton
class EmployeeInline(admin.StackedInline):
    model = Employee
    can_delete = False
    verbose_name_plural = 'employee'

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (EmployeeInline,)

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
```

これらのプロファイルモデルは何か特別なものではなく、たまたま user モデルと一対一でリンクしている Django のモデルに過ぎません。そのため、ユーザが作成されたときに自動的に作成されるわけではありませんが、 django.db.models.signals.post_save を使えば、必要に応じて関連モデルを作成したり更新したりできます。

関連モデルを使うと、関連データを取得するためのクエリやジョインが追加されます。ニーズによっては、関連フィールドを含むカスタムユーザモデルの方が良 いかもしれませんが、プロジェクトのアプリの中でデフォルトユーザモデルへの既存 のリレーションがあれば、余分なデータベース負荷を正当化できるかもしれません。

### カスタム User モデルの代用

プロジェクトの種類によっては、Django に組み込まれた User モデルが必ずしも適切ではない認証要件があるかもしれません。例えば、あるサイトではユーザ名ではなく、メールアドレスを識別用トー クンとして使う方が理にかなっている場合があります。

Django では、 AUTH_USER_MODEL 設定にカスタムモデルを参照する値を与えることで、 デフォルトのユーザモデルをオーバーライドすることができます。

```python
AUTH_USER_MODEL = 'myapp.MyUser'
```

この点線のペアは、Django アプリの名前 (INSTALLED_APPS に入っている必要があります) と、ユーザモデルとして使いたい Django モデルの名前を記述しています。

#### プロジェクト開始時にカスタムユーザーモデルを使用する

新しいプロジェクトを始める際には、デフォルトの User モデルで十分な場合でも、カスタムユーザーモデルを設定することを強くお勧めします。このモデルは、デフォルトのユーザーモデルと同じように動作しますが、必要に応じて将来的にカスタマイズすることができます。

```python
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass
```

AUTH_USER_MODEL を指定することを忘れないでください。マイグレーションを作成したり、初めて manage.py migrate を実行する前に、この作業を行ってください。

また、アプリの admin.py でモデルを登録します。

```python
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

admin.site.register(User, UserAdmin)
```

### プロジェクトの途中でカスタムユーザーモデルに変更する

データベースのテーブルを作成した後に AUTH_USER_MODEL を変更することは、外部キーや多対多の関係などに影響するため、かなり困難です。

この変更は自動的に行うことができず、手動でスキーマを修正し、古いユーザーテーブルからデータを移動し、場合によっては手動でいくつかのマイグレーションを適用し直す必要があります。手順の概要については #25313 を参照してください。

スワップ可能なモデルに対する Django の動的依存機能の制限により、 AUTH_USER_MODEL が参照するモデルは、そのアプリの最初のマイグレーション (通常は 0001_initial と呼ばれます) で作成しなければなりません。そうしないと、依存関係の問題が発生します。

さらに、動的な依存関係のために Django が自動的に依存関係のループを断ち切ることができないので、マイグレーションの実行時に CircularDependencyError に遭遇するかもしれません。このエラーが出た場合は、ユーザモデルが依存しているモデルを 2 回目のマイグレーションに移すことで、ループを断ち切る必要があります。(通常のやり方を確認したい場合は、ForeignKey を持つ通常のモデルを 2 つ作って、 makemigrations がその循環依存をどのように解決するかを見てみるといいでしょう)

### 再利用可能なアプリと AUTH_USER_MODEL について

再利用可能なアプリは、カスタムユーザーモデルを実装すべきではありません。プロジェクトでは多くのアプリを使用することがあり、カスタムユーザーモデルを実装した 2 つの再利用可能なアプリを一緒に使用することができませんでした。ユーザーごとの情報をアプリに保存する必要がある場合は、以下のように settings.AUTH_USER_MODEL に ForeignKey または OneToOneField を使用してください。

### User モデルの参照について

User を直接参照している場合（外部キーで参照している場合など）、AUTH_USER_MODEL の設定が異なるユーザーモデルに変更されているプロジェクトでは、コードが動作しません。

#### get_user_model()

User を直接参照するのではなく、django.contrib.auth.get_user_model() を使ってユーザモデルを参照する必要があります。このメソッドは、現在アクティブなユーザモデルを返します。 カスタムユーザモデルが指定されていればそれを、そうでなければ User を返します。

ユーザモデルへの外部キーや多対多のリレーションを定義する際には、 AUTH_USER_MODEL 設定を使ってカスタムモデルを指定する必要があります。例えば、以下のようになります。

```python
from django.conf import settings
from django.db import models

class Article(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
```

ユーザーモデルが送信するシグナルに接続する場合は、AUTH_USER_MODEL の設定でカスタムモデルを指定する必要があります。例えば、以下のようになります。

```python
from django.conf import settings
from django.db.models.signals import post_save

def post_save_receiver(sender, instance, created, **kwargs):
    pass

post_save.connect(post_save_receiver, sender=settings.AUTH_USER_MODEL)
```

一般的には、インポート時に実行されるコードで AUTH_USER_MODEL を設定したユーザモデルを参照するのが最も簡単ですが、 Django がモデルをインポートしている最中に get_user_model() を呼び出すことも可能なので、 models.ForeignKey(get_user_model(), ...) を使うこともできます。

例えば @override_settings(AUTH_USER_MODEL=...) を使って、アプリが複数のユーザモデルでテストされていて、 get_user_model() の結果をモジュールレベルの変数にキャッシュしている場合は、 setting_changed シグナルを listen してキャッシュをクリアする必要があるかもしれません。例えば、以下のようになります。

```python
from django.apps import apps
from django.contrib.auth import get_user_model
from django.core.signals import setting_changed
from django.dispatch import receiver

@receiver(setting_changed)
def user_model_swapped(**kwargs):
    if kwargs['setting'] == 'AUTH_USER_MODEL':
        apps.clear_cache()
        from myapp import some_module
        some_module.UserModel = get_user_model()
```

### カスタムユーザーモデルの指定

カスタム・ユーザー・モデルを使ってプロジェクトを開始した場合、これがプロジェクトにとって正しい選択であるかどうかを検討してください。

すべてのユーザー関連情報を 1 つのモデルにまとめておけば、関連するモデルを検索するための追加の、あるいはより複雑なデータベース・クエリの必要性がなくなります。一方で、アプリ固有のユーザー情報を、カスタムユーザーモデルとの関係を持つモデルに格納する方が適している場合もあります。これにより、各アプリは、他のアプリの前提条件と衝突したり壊したりすることなく、独自のユーザーデータの要件を指定することができます。また、ユーザモデルをできるだけシンプルにして、認証に焦点を当て、 Django がカスタムユーザモデルに期待する最低限の要件に従うことになります。

デフォルトの認証バックエンドを使う場合、モデルには本人確認のために使える 一意のフィールドを一つ用意しなければなりません。これはユーザ名でもメールアドレスでも、その他のユニークな属性でも構いません。サポートするカスタム認証バックエンドを使用する場合は、 一意でないユーザ名フィールドを使用することができます。

準拠したカスタム・ユーザ・モデルを構築する最も簡単な方法は、AbstractBaseUser を継承することです。AbstractBaseUser は、ハッシュ化されたパスワードやトークン化されたパスワードのリセットなど、ユーザ・モデルの中核となる実装を提供します。その後、いくつかの重要な実装の詳細を提供する必要があります。

#### class models.CustomUser

##### username_field

一意の識別子として使用される user モデルのフィールドの名前を説明する文字列です。これは通常、ある種のユーザー名になりますが、メールアドレスやその他のユニークな識別子にすることもできます。このフィールドは、ユニークでなければなりません（つまり、定義で unique=True が設定されている必要があります）。

以下の例では、フィールド識別子を識別フィールドとして使用しています。

```python
class MyUser(AbstractBaseUser):
    identifier = models.CharField(max_length=40, unique=True)
    ...
    USERNAME_FIELD = 'identifier'
```

##### EMAIL_FIELD（電子メール・フィールド）

User モデルの email フィールドの名前を表す文字列。この値は get_email_field_name()によって返されます。

##### required_fields（必須フィールド）

createuperuser 管理コマンドでユーザを作成する際に入力を求められるフィールド名のリスト。ユーザーはこれらのフィールドのそれぞれに値を入力するよう促されます。ブランクが False または未定義であるすべてのフィールドを含まなければならず、ユーザーが対話的に作成されるときに促される追加のフィールドを含むことができます。REQUIRED_FIELDS は、Django の他の部分、例えば admin でのユーザ作成には影響しません。

例えば、生年月日と身長の 2 つの必須フィールドを定義したユーザモデルの 部分的な定義を以下に示します。

```python
class MyUser(AbstractBaseUser):
    ...
    date_of_birth = models.DateField()
    height = models.FloatField()
    ...
    REQUIRED_FIELDS = ['date_of_birth', 'height']
```

::: tip
REQUIRED_FIELDS には、ユーザ・モデルのすべての必須フィールドを含める必要があります。ただし、USERNAME_FIELD や password は常に入力を求められるため、これらのフィールドを含めるべきではありません。
:::

##### is_active（アクティブ）

ユーザーが "アクティブ "とみなされているかどうかを示すブーリアン属性です。この属性は AbstractBaseUser の属性として提供され、デフォルトでは True になります。この属性をどのように実装するかは、選択した認証バックエンドの詳細によります。詳細は、ビルトインユーザーモデルの is_active 属性のドキュメントを参照してください。

##### get_full_name()

オプションです。フルネームのような、ユーザのより長い正式な識別子です。実装されていれば、 django.contrib.admin のオブジェクトの履歴に、ユーザ名と一緒に表示されます。

##### get_short_name()

オプションです。ユーザのファーストネームのような、短くてインフォーマルな識別子です。実装されていれば、 django.contrib.admin のヘッダにあるユーザへの挨拶の中で、ユーザ名を置き換えます。

::: tip
AbstractBaseUser のインポート

AbstractBaseUser と BaseUserManager は django.contrib.auth.base_user からインポートできるので、 INSTALLED_APPS に django.contrib.auth を含めなくてもインポートできます。
:::

以下の属性とメソッドは、AbstractBaseUser のどのサブクラスでも利用可能です。

#### クラス models.AbstractBaseUser

##### get_username()

USERNAME_FIELD で指定されたフィールドの値を返します。

##### clean()

normalize_username()を呼び出して、ユーザー名を正規化します。このメソッドをオーバーライドする場合は、正規化を保持するために必ず super()を呼び出してください。

##### classmethod get_email_field_name()

EMAIL_FIELD 属性で指定された電子メール・フィールドの名前を返します。EMAIL_FIELD が指定されていない場合のデフォルトは'email'です。

##### classmethod normalize_username(username)

NFKC Unicode 正規化をユーザー名に適用し、異なる Unicode コードポイントを持つ視覚的に同一の文字が同一とみなされるようにします。

##### is_authenticated（認証済み）

常に True である読み取り専用の属性です（AnonymousUser.is_authenticated が常に False であるのとは対照的です）。これは、ユーザーが認証されたかどうかを知るためのものです。これはいかなるパーミッションも意味せず、ユーザーがアクティブかどうか、有効なセッションを持っているかどうかもチェックしません。通常は request.user のこの属性をチェックして、（現在ログインしているユーザーを表す）AuthenticationMiddleware によって入力されているかどうかを調べますが、この属性はどの User インスタンスでも True であることを知っておくべきです。

##### is_anonymous

読み取り専用の属性で、常に False です。これは User オブジェクトと AnonymousUser オブジェクトを区別するためのものです。一般的には、この属性よりも is_authenticated を使用することをお勧めします。

##### set_password(raw_password)

ユーザーのパスワードを与えられた生の文字列に設定し、パスワードのハッシュ化を行います。AbstractBaseUser オブジェクトの保存はしません。

raw_password が None の場合は、set_unusable_password()を使用した場合と同様に、パスワードは使用できないパスワードに設定されます。

##### check_password(raw_password)

与えられた生の文字列がそのユーザーの正しいパスワードであれば、True を返します。(これは、比較の際にパスワードのハッシュ化を行います。)

##### set_unusable_password()

ユーザーにパスワードが設定されていないことをマークします。このユーザーの check_password()は決して True を返しません。AbstractBaseUser オブジェクトを保存していません。

アプリケーションの認証が LDAP ディレクトリのような既存の外部ソースに対して行われる場合には、これが必要になるかもしれません。

##### has_usable_password()

set_unusable_password()がこのユーザーに対して呼ばれていたら False を返します。

##### get_session_auth_hash()

パスワードフィールドの HMAC を返します。パスワード変更時にセッションを無効にするために使用します。

AbstractUser は、AbstractBaseUser のサブクラスです。

#### class models.AbstractUser

##### clean()

BaseUserManager.normalize_email()を呼んでメールを正規化します。このメソッドをオーバーライドする場合は、正規化を保持するために必ず super()を呼び出してください。

### カスタムユーザーモデル用のマネージャーを書く

ユーザモデル用のカスタムマネージャも定義しなければなりません。ユーザモデルが username, email, is_staff, is_active, is_superuser, last_login, date_joined フィールドを Django のデフォルトユーザと同じように定義している場合は、 Django の UserManager をインストールすることができます。しかし、ユーザモデルが異なるフィールドを定義している場合は、 BaseUserManager を拡張して 2 つのメソッドを追加したカスタムマネージャを定義する必要があります。

#### class models.CustomUserManager

##### create_user(username_field, password=None, \*\*other_fields)

create_user()のプロトタイプは、username フィールドに加えて、すべての必須フィールドを引数として受け取る必要があります。例えば、ユーザモデルがユーザ名フィールドとして email を使用し、必須フィールドとして date_of_birth を持っている場合、create_user は次のように定義されるべきです。

```python
def create_user(self, email, date_of_birth, password=None):
    # create user here
    ...
```

##### create_superuser(username_field, password=None, \*\*other_fields)

create_superuser()のプロトタイプは、username フィールドに加えて、すべての必須フィールドを引数として受け入れる必要があります。例えば、ユーザーモデルがユーザー名フィールドとして email を使用し、必須フィールドとして date_of_birth を持つ場合、create_superuser は次のように定義する必要があります。

```python
def create_superuser(self, email, date_of_birth, password=None):
    # create superuser here
    ...
```

USERNAME_FIELD または REQUIRED_FIELDS の ForeignKey の場合、これらのメソッドは既存のインスタンスの to_field(デフォルトでは primary_key)の値を受け取ります。

BaseUserManager は、以下のユーティリティーメソッドを提供します。

#### class models.BaseUserManager

##### classmethod normalize_email(email)

メールアドレスのドメイン部分を小文字にすることで、メールアドレスを正規化します。

##### get_by_natural_key(username)

USERNAME_FIELD で指定されたフィールドの内容を使用して、ユーザ・インスタンスを取得します。

##### make_random_password(length=10, allowed_chars='abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789')

指定された長さ、指定された許容文字列を持つランダムなパスワードを返します。なお、allowed_chars のデフォルト値には、ユーザを混乱させる可能性のある文字は含まれていません。

- i、l、I、1（小文字の i、小文字の L、大文字の i、数字の 1）
- o、O、0（アルファベット小文字の o、アルファベット大文字の o、ゼロ）

### Django のデフォルト User を拡張する

Django の User モデルで十分満足していて、さらにプロファイル情報を追加した い場合は、 django.contrib.auth.models.AbstractUser をサブクラス化して、 カスタムのプロファイルフィールドを追加することもできますが、カスタムユー ザモデルの仕様決めの「モデル設計の考慮点」で説明したように、別のモデルを 作ることをお勧めします。AbstractUser は、デフォルトの User の完全な実装を抽象モデルとして提供します。

### カスタムユーザと組み込みの auth フォームについて

Django の組み込みフォームやビューは、扱うユーザモデルについて一定の 仮定を置いています。

以下のフォームは、AbstractBaseUser のサブクラスに対応しています。

- 認証フォーム。USERNAME_FIELD で指定されたユーザ名フィールドを使用します。
- SetPasswordForm
- パスワード変更フォーム
- AdminPasswordChangeForm
  以下のフォームは、ユーザ・モデルに関する前提条件を設定しており、その前提条件を満たす場合はそのまま使用できます。

PasswordResetForm: PasswordResetForm: ユーザモデルには、ユーザの識別に使用できる get_email_field_name()で返される名前(デフォルトは email)でユーザの電子メールアドレスを格納するフィールドと、非アクティブなユーザのパスワードリセットを防ぐための is_active という名前のブール値のフィールドがあると仮定しています。  
最後に、以下のフォームは User に関連しており、カスタムユーザモデルで動作するように書き換えるか拡張する必要があります。

- UserCreationForm
- UserChangeForm  
  カスタムユーザーモデルが AbstractUser のサブクラスであれば、これらのフォームをこのように拡張することができます。

```python
from django.contrib.auth.forms import UserCreationForm
from myapp.models import CustomUser

class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = UserCreationForm.Meta.fields + ('custom_field',)
```

### カスタムユーザと django.contrib.admin の関係

カスタムユーザモデルを admin でも使えるようにするには、ユーザモデルにいくつかの 追加属性とメソッドを定義する必要があります。これらのメソッドにより、管理者はユーザの管理コンテンツへのアクセスを制御できるようになります。

#### クラス models.CustomUser

##### is_staff(スタッフ)

そのユーザーが管理サイトへのアクセスを許可されている場合は、True を返します。

##### is_active(アクティブ)

ユーザーアカウントが現在アクティブであれば、True を返します。

##### has_perm(perm, obj=None):

ユーザーが指定されたパーミッションを持っている場合、True を返します。obj が指定された場合は、特定のオブジェクトインスタンスに対してパーミッションをチェックする必要があります。

##### has_module_perms(app_label):

has_module_perms(app_label): ユーザーが指定されたアプリのモデルにアクセスするパーミッションを持っていれば True を返します。

また、カスタムユーザモデルを admin に登録する必要があります。カスタムユーザモデルが django.contrib.auth.models.AbstractUser を継承している場合は、 Django の既存の django.contrib.auth.admin.UserAdmin クラスを利用できます。しかし、ユーザモデルが AbstractBaseUser を拡張している場合は、カスタムの ModelAdmin クラスを定義する必要があります。デフォルトの django.contrib.auth.admin.UserAdmin をサブクラス化することもできますが、django.contrib.auth.models.AbstractUser 上のフィールドを参照する定義のうち、カスタムユーザクラスにないものはすべてオーバーライドする必要があります。

::: tip
django.contrib.auth.admin.UserAdmin のサブクラスであるカスタム ModelAdmin を使っている場合、カスタムフィールドを fieldsets(ユーザ編集時に使うフィールド)と add_fieldsets(ユーザ作成時に使うフィールド)に追加する必要があります。例えば、以下のようになります。

```python
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    ...
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('custom_field',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('custom_field',)}),
    )
```

詳細は完全な例を参照してください。
:::

### カスタムユーザとパーミッションについて

Django のパーミッションフレームワークを自分のユーザクラスに簡単に組み込 むことができるように、Django は PermissionsMixin を提供しています。これは、ユーザモデルのクラス階層に含めることができる抽象モデルで、 Django のパーミッションモデルをサポートするのに必要なメソッドやデータベースフィールドをすべて提供します。

PermissionsMixin は以下のメソッドと属性を提供します。

#### クラス models.PermissionsMixin

##### is_superuser（スーパーユーザー）

論理値です。このユーザーが、明示的に割り当てずにすべてのパーミッションを持っていることを指定します。

##### get_user_permissions(obj=None)

ユーザーが直接持っているパーミッション文字列のセットを返します。

obj が渡された場合は、この特定のオブジェクトに対するユーザーパーミッションのみを返します。

##### get_group_permissions(obj=None)

ユーザーがグループを介して持っているパーミッション文字列のセットを返します。

obj が渡された場合は、この特定のオブジェクトに対するグループ・パーミッションのみを返します。

##### get_all_permissions(obj=None)

そのユーザーが持っているパーミッション文字列のセットを、グループとユーザーの両方のパーミッションを通して返します。

obj が渡された場合は、この特定のオブジェクトに対するパーミッションのみを返します。

##### has_perm(perm, obj=None)

perm は"<app label>.<permission codename>"というフォーマットです（permissions 参照）。User.is_active と is_superuser がともに True の場合、このメソッドは常に True を返します。

obj が渡された場合、このメソッドはモデルに対するパーミッションをチェックするのではなく、この特定のオブジェクトに対するパーミッションをチェックします。

##### has_perms(perm_list, obj=None)

ユーザーが指定された各パーミッションを持っていれば True を返します。各パーミッションは"<app label>.<permission codename>"というフォーマットです。User.is_active と is_superuser が共に True の場合、このメソッドは常に True を返します。

obj が渡された場合、このメソッドはモデルのパーミッションをチェックするのではなく、特定のオブジェクトのパーミッションをチェックします。

##### has_module_perms(パッケージ名)

与えられたパッケージ (Django アプリのラベル) でユーザが何らかのパーミッションを持っていれば True を返します。User.is_active と is_superuser がともに True の場合、このメソッドは常に True を返します。

::: tip
PermissionsMixin を含まない場合は、ModelBackend の permissions メソッドを呼び出さないようにする必要があります。ModelBackend は、ユーザモデルで特定のフィールドが利用できることを前提としています。ユーザーモデルがそれらのフィールドを提供していない場合は、パーミッションをチェックする際にデータベースエラーが発生します。  
:::

### カスタムユーザとプロキシモデル

カスタムユーザモデルの制限として、カスタムユーザモデルをインストールす ると、User を拡張したプロキシモデルが壊れてしまいます。プロキシモデルは具象のベースクラスに基づいていなければなりません。カ スタムユーザモデルを定義すると、Django がベースクラスを確実に特定する機能が なくなります。

もしあなたのプロジェクトがプロキシモデルを使っているなら、プロキ シを修正してプロジェクトで使われているユーザモデルを拡張するか、プロキ シの動作を User サブクラスにマージする必要があります。

### 完全な例

ここでは、管理者に準拠したカスタムユーザーアプリの例を紹介します。このユーザーモデルは、ユーザー名にメールアドレスを使用し、生年月日を必須としています。ユーザーアカウントに管理者フラグを立てるだけで、権限チェックは行いません。このモデルは、ユーザー作成フォームを除く、すべての組み込みの認証フォームとビューに対応しています。この例では、ほとんどのコンポーネントがどのように動作するかを説明していますが、本番用のプロジェクトに直接コピーすることは想定していません。

このコードはすべて、カスタム認証アプリの models.py ファイルに含まれます。

```python
from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)


class MyUserManager(BaseUserManager):
    def create_user(self, email, date_of_birth, password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            date_of_birth=date_of_birth,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, date_of_birth, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            date_of_birth=date_of_birth,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class MyUser(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    date_of_birth = models.DateField()
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['date_of_birth']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin
```

そして、このカスタムユーザモデルを Django の admin に登録するには、アプリの admin.py ファイルに次のようなコードが必要になります。

```python
from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError

from customauth.models import MyUser


class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = MyUser
        fields = ('email', 'date_of_birth')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    disabled password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = MyUser
        fields = ('email', 'password', 'date_of_birth', 'is_active', 'is_admin')


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'date_of_birth', 'is_admin')
    list_filter = ('is_admin',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('date_of_birth',)}),
        ('Permissions', {'fields': ('is_admin',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'date_of_birth', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()


# Now register the new UserAdmin...
admin.site.register(MyUser, UserAdmin)
# ... and, since we're not using Django's built-in permissions,
# unregister the Group model from admin.
admin.site.unregister(Group)
```

最後に、settings.py で AUTH_USER_MODEL を設定して、カスタムモデルをプロジェクトのデフォルトユーザーモデルとして指定します。

```python
AUTH_USER_MODEL = 'customauth.MyUser'
```

::: warning
Django 3.2 で変更されました。
古いバージョンでは ReadOnlyPasswordHashField がデフォルトでは無効になっておらず、UserChangeForm.clean_password() はユーザが何を提供しても初期値を返すようになっています。  
:::
