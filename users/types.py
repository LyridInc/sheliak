import graphene
from graphene.relay import Node
from django.contrib.auth import get_user_model
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType
from social_django import models as social_models
from graphql_auth.settings import graphql_auth_settings as app_settings

from helpers.utils import dashed_to_camel, PaginatorConnection
from users.models import UserLogin, Profile

User = get_user_model()


class ProfileType(DjangoObjectType):
    class Meta:
        model = Profile

    gender = graphene.String()

    def resolve_gender(self, info):
        return self.get_gender()


class UserAdminType(DjangoObjectType):
    class Meta:
        model = User
        interfaces = (graphene.Node,)
        connection_class = PaginatorConnection

    @classmethod
    def get_queryset(cls, queryset, info):
        return queryset.select_related("profile")


class UserType(DjangoObjectType):
    class Meta:
        model = User
        filter_fields = app_settings.USER_NODE_FILTER_FIELDS
        exclude = app_settings.USER_NODE_EXCLUDE_FIELDS
        interfaces = (Node,)
        skip_registry = True
        connection_class = PaginatorConnection

    pk = graphene.String()
    verified = graphene.Boolean()
    full_name = graphene.String()

    def resolve_pk(self, info):
        return self.pk

    def resolve_verified(self, info):
        return self.status.verified

    def resolve_full_name(self, info):
        return self.get_full_name()

    @classmethod
    def get_queryset(cls, queryset, info):
        return queryset.select_related("status")


class CamelJSON(GenericScalar):
    @classmethod
    def serialize(cls, value):
        return dashed_to_camel(value)

    class Meta:
        name = 'SocialCamelJSON'


class SocialType(DjangoObjectType):
    extra_data = CamelJSON()

    class Meta:
        model = social_models.UserSocialAuth

    def resolve_extra_data(self, info, **kwargs):
        self.extra_data.pop('access_token', None)
        return self.extra_data


class StatisticsType(graphene.ObjectType):
    total = graphene.Int()
    verified = graphene.Int()
    unverified = graphene.Int()
    deactivated = graphene.Int()
    superuser = graphene.Int()
    staff = graphene.Int()
    never_login = graphene.Int()
    active_users = graphene.Int()


class StatisticsTrendsType(graphene.ObjectType):
    percentage_change_joined = graphene.Float()
    percentage_change_verified = graphene.Float()
    percentage_change_logins = graphene.Float()


class Top10Logins(graphene.ObjectType):
    user = graphene.Field(UserType)
    logins = graphene.Int()

    def resolve_user(self, info):
        return self


class AccountStatisticsType(StatisticsType, graphene.ObjectType):
    last_x_days = graphene.Field(StatisticsType)
    trends_in_percent = graphene.Field(StatisticsTrendsType)
    top_10_logins = graphene.List(Top10Logins)


class LoginStatisticsType(DjangoObjectType):
    class Meta:
        model = UserLogin
        interfaces = (Node,)

    date = graphene.DateTime()
    total = graphene.Int()
    unique = graphene.Int()
    github = graphene.Int()
    google = graphene.Int()
    facebook = graphene.Int()
    django = graphene.Int()


class UserGrowthStatisticsType(graphene.ObjectType):
    date = graphene.DateTime()
    total_users = graphene.Int()
    total_verified_users = graphene.Int()
    total_unverified_users = graphene.Int()
    new_users = graphene.Int()
    new_verified_users = graphene.Int()
    new_unverified_users = graphene.Int()
