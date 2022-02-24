import os

from django.http import HttpResponse
from django.urls import path, re_path
from django.conf import settings
from django.contrib import admin
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache

from graphene_django.views import GraphQLView
from users import signals  # noqa


def getversion(request):
    return HttpResponse(os.environ.get("DOCKER_TAG"))


urlpatterns = [
    path("graphql", csrf_exempt(GraphQLView.as_view(graphiql=True)), name="graphql"),
]

# These urls are need for Operational purposes.
if settings.MODE != 'PROD':
    urlpatterns += [
        path(r'admin/', admin.site.urls),
        re_path(r"^$", never_cache(TemplateView.as_view(template_name='index.html'))),
        re_path(r"^(?:.*)/?$", never_cache(TemplateView.as_view(template_name='index.html'))),
    ]

# This URL is a catch all URL if nothing matches above.
urlpatterns += [
    re_path('version', getversion),
]
