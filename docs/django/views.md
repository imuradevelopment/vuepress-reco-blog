---
source:
    - decorators.py
    - views.py
---

# クラスベースのビュー

> Django のクラスベースのビューは、古いスタイルのビューからの脱却を歓迎します。
>
> \- \[Reinout van Rees]\[cite] です。

REST フレームワークは、Django の`View`クラスをサブクラス化した`APIView`クラスを提供しています。

`APIView`クラスは以下の点で通常の`View`クラスとは異なります。

* ハンドラメソッドに渡されるリクエストは、 Django の`HttpRequest`インスタンスではなく、 REST フレームワークの`Request`インスタンスになります。
* ハンドラメソッドは Django の`HttpResponse` ではなく、REST フレームワークの`Response` を返すことがあります。 ビューは、コンテンツネゴシエーションや、レスポンスに正しいレンダラーを設定することを管理します。
* `APIException`の例外はすべてキャッチされ、適切なレスポンスに変換されます。
* 受信したリクエストは認証され、適切なパーミッションチェックやスロットルチェックが行われた後、ハンドラメソッドにリクエストが送られます。

`APIView`クラスの使用方法は、通常の`View`クラスの使用方法とほぼ同じで、入力されたリクエストは`.get()`や`.post()` などの適切なハンドラメソッドにディスパッチされます。 さらに、APIポリシーの様々な側面を制御するために、クラスに多くの属性を設定することができます。

例えば、以下のようになります。

    from rest_framework.views import APIView
    from rest_framework.response import Response
    from rest_framework import authentication, permissions
    from django.contrib.auth.models import User

    class ListUsers(APIView):
        """
        View to list all users in the system.

        * Requires token authentication.
        * Only admin users are able to access this view.
        """
        authentication_classes = [authentication.TokenAuthentication]
        permission_classes = [permissions.IsAdminUser]

        def get(self, request, format=None):
            """
            Return a list of all users.
            """
            usernames = [user.username for user in User.objects.all()]
            return Response(usernames)

---

**注意**: Django REST Framework の`APIView`、`GenericAPIView`、様々な`Mixins`、`Viewset`の完全なメソッド、属性、関係は、最初は複雑です。ここでのドキュメントに加えて、 \[Classy Django REST Framework]\[classy-drf] リソースでは、Django REST Framework のクラスベースのビューのそれぞれについて、完全なメソッドと属性が記載された参照可能なリファレンスを提供しています。

---

## API ポリシー属性

以下の属性は、API ビューのプラグインを制御します。

### .renderer_classes

### .パーサクラス

### .authentication_classes

### .スロットル\_クラス

### .permission_classes

### .コンテントネゴシエーション\_クラス

## APIポリシーのインスタンス化メソッド

以下のメソッドは、RESTフレームワークが様々なプラガブルAPIポリシーをインスタンス化するために使用されます。 通常、これらのメソッドをオーバーライドする必要はありません。

### .get_renderers(self)

### .get_parsers(self)

### .get_authenticators(self)

### .get_throttles(self)

### .get_permissions(self)

### .get_content_negotiator(self)

### .get_exception_handler(self)

## APIポリシーの実装メソッド

以下のメソッドは、ハンドラメソッドにディスパッチする前に呼び出されます。

### .check_permissions(self, request)

### .check_throttles(self, request)

### .perform_content_negotiation(self, request, force=False)

## ディスパッチメソッド

以下のメソッドは、ビューの`.dispatch()`メソッドから直接呼び出されます。これらのメソッドは、`.get` `()、.post()、` `put()、` `patch` `()、.delete()`などのハンドラメソッドを呼び出す前または後に必要なアクションを実行します。

### .initial(self, request, \*args, \*\*kwargs)

このメソッドは、パーミッションやスロットルを実行したり、コンテンツネゴシエーションを行うために使用されます。

通常、このメソッドをオーバーライドする必要はありません。

### .handle_exception(self, exc)

ハンドラメソッドによってスローされた例外は、このメソッドに渡され、`Response`インスタンスを返すか、例外を再発生させます。

デフォルトの実装では、`rest_framework.exceptions.APIException` のサブクラスや、 Django の`Http404`や`PermissionDenied`例外を処理し、適切なエラーレスポンスを返します。

API が返すエラーレスポンスをカスタマイズする必要がある場合は、 このメソッドをサブクラス化してください。

### .initialize_request(self, request, \*args, \*\*kwargs)

ハンドラメソッドに渡されるリクエストオブジェクトが、通常の Django`HttpRequest` ではなく、`Request` のインスタンスであることを確認します。

通常、このメソッドをオーバーライドする必要はありません。

### .finalize_response(self, request, response, \*args, \*\*kwargs)

ハンドラメソッドから返された`Response`オブジェクトが、コンテントネゴシエーションによって決定された正しいコンテントタイプにレンダリングされることを保証します。

通常、このメソッドをオーバーライドする必要はありません。

---

# 関数ベースのビュー

> クラスベースのビューが常に優れたソリューションであるというのは間違いです。
>
> \- \[Nick Coghlan]\[cite2]。

RESTフレームワークでは、通常の関数ベースのビューを扱うこともできます。 REST フレームワークには、関数ベースのビューをラップするシンプルなデコレータが用意されていて、 (通常の Django`HttpRequest` ではなく)`Request`のインスタンスを受け取り、 (Django`HttpResponse` ではなく)`Response`を返すようになっていて、リクエストの処理方法を設定できます。

## @api_view()

**署名します。** `@api_view(http_method_names=['GET'])`

この機能の中核となるのが`api_view`デコレーターで、ビューが応答すべきHTTPメソッドのリストを受け取ります。例えば、手動でデータを返すだけの非常にシンプルなビューを書く場合は、このようになります。

    from rest_framework.decorators import api_view

    @api_view()
    def hello_world(request):
        return Response({"message": "Hello, world!"})

このビューは、\[settings] で指定されているデフォルトのレンダラー、パーサー、認証クラスなどを使用します。

デフォルトでは、`GET`メソッドのみ受け付けます。その他のメソッドは、"405 Method Not Allowed "で応答します。この動作を変更するには、ビューが許可するメソッドを以下のように指定します。

    @api_view(['GET', 'POST'])
    def hello_world(request):
        if request.method == 'POST':
            return Response({"message": "Got some data!", "data": request.data})
        return Response({"message": "Hello, world!"})

## APIポリシーデコレーター

デフォルトの設定を上書きするために、RESTフレームワークはビューに追加できるデコレータのセットを提供しています。 これらは、`@api_view`デコレータの*後*（下）になければなりません。 たとえば、\[スロットル]\[スロットリング]を使用して、特定のユーザーが 1 日に 1 回しか呼び出せないようにするビューを作成するには、`@throttle_classes`デコレータを使用し、スロットル クラスのリストを渡します。

    from rest_framework.decorators import api_view, throttle_classes
    from rest_framework.throttling import UserRateThrottle

    class OncePerDayUserThrottle(UserRateThrottle):
        rate = '1/day'

    @api_view(['GET'])
    @throttle_classes([OncePerDayUserThrottle])
    def view(request):
        return Response({"message": "Hello for today! See you tomorrow!"})

これらのデコレータは、前述の`APIView`サブクラスに設定された属性に対応しています。

使用可能なデコレータは次のとおりです。

* `@renderer_classes(...)`
* `パーサークラス(...)`
* `認証_クラス(...)`
* `@throttle_classes(...)`
* `パーミッションクラス(...)`

これらのデコレーターはそれぞれ、クラスのリストまたはタプルである1つの引数を取ります。

## ビュースキーマデコレーター

関数ベースのビューのデフォルトのスキーマ生成をオーバーライドするには、`@schema`デコレータを使用します。これは、`@api_viewdecorator`の*後*（下）に記述する必要があります。たとえば、次のようになります。

    from rest_framework.decorators import api_view, schema
    from rest_framework.schemas import AutoSchema

    class CustomAutoSchema(AutoSchema):
        def get_link(self, path, method, base_url):
            # override view introspection here...

    @api_view(['GET'])
    @schema(CustomAutoSchema())
    def view(request):
        return Response({"message": "Hello for today! See you tomorrow!"})

このデコレーターは、\[Schemas documentation]\[schemas]で説明されているように、単一の`AutoSchema`インスタンス、`AutoSchema`サブクラスインスタンス、または`ManualSchema`インスタンスを取ります。スキーマ生成からビューを除外するために`None`を渡すことができます。

    @api_view(['GET'])
    @schema(None)
    def view(request):
        return Response({"message": "Will not appear in schema!"})

[cite]: https://reinout.vanrees.org/weblog/2011/08/24/class-based-views-usage.html

[cite2]: http://www.boredomandlaziness.org/2012/05/djangos-cbvs-are-not-mistake-but.html

[settings]: settings.md

[throttling]: throttling.md

[schemas]: schemas.md

[classy-drf]: http://www.cdrf.co
