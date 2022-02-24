import graphene
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db.models.functions import TruncDate
from django.db.models import Count, Q, OuterRef, Subquery
from graphql_jwt.decorators import staff_member_required
from graphene_django.filter.fields import DjangoFilterConnectionField

from helpers.utils import pct_change
from users.filters import UserLoginFilter
from users.types import LoginStatisticsType, AccountStatisticsType

User = get_user_model()


class StatisticsQuery(graphene.ObjectType):
    account_statistics = graphene.Field(AccountStatisticsType)
    login_statistics = DjangoFilterConnectionField(LoginStatisticsType, filterset_class=UserLoginFilter)

    @staff_member_required
    def resolve_account_statistics(self, info):
        qs = User.objects.aggregate(
            total=Count('id'),
            verified=Count('status', filter=Q(status__verified=True)),
            unverified=Count('status', filter=Q(status__verified=False)),
            deactivated=Count('is_active', filter=Q(is_active=False)),
            superuser=Count('is_superuser', filter=Q(is_superuser=True)),
            staff=Count('is_staff', filter=Q(is_staff=True)),
            never_login=Count('last_login', filter=Q(last_login=None)),
        )

        last_90_days_qs = User.objects.filter(date_joined__gte=timezone.now() - timedelta(days=90)).aggregate(
            total=Count('id'),
            verified=Count('status', filter=Q(status__verified=True)),
            unverified=Count('status', filter=Q(status__verified=False)),
            deactivated=Count('is_active', filter=Q(is_active=False)),
            superuser=Count('is_superuser', filter=Q(is_superuser=True)),
            staff=Count('is_staff', filter=Q(is_staff=True)),
            never_login=Count('last_login', filter=Q(last_login=None)),
        )

        current = User.objects.filter(
            date_joined__range=(timezone.now() - timedelta(days=7), timezone.now())
        ).aggregate(
            total=Count('id'),
            verified=Count('status', filter=Q(status__verified=True)),
        )

        previous = User.objects.filter(
            date_joined__range=(timezone.now() - timedelta(days=14), timezone.now() - timedelta(days=7))
        ).aggregate(
            total=Count('id'),
            verified=Count('status', filter=Q(status__verified=True)),
        )

        trends = {}
        for key, val in current.items():
            trends.update({'percent_%s' % key: pct_change(previous[key], val)})

        return AccountStatisticsType(
            last_90_days=last_90_days_qs,
            last_7_days_trends=trends,
            **qs
        )

    @staff_member_required
    def resolve_login_statistics(self, info, **kwargs):
        activities = UserLoginFilter(kwargs).qs.select_related('user') \
            .annotate(date=TruncDate('timestamp')) \
            .order_by('-date')

        statistics = activities.values('date') \
            .annotate(unique=Count('user', distinct=True),
                      total=Count('id'),
                      github=Count('provider', filter=Q(provider="social_core.backends.github.GithubOAuth2")),
                      google=Count('provider', filter=Q(provider="social_core.backends.google.GoogleOAuth2")),
                      django=Count('provider', filter=Q(provider="django.contrib.auth.backends.ModelBackend")),
                      facebook=Count('provider', filter=Q(provider="social_core.backends.facebook.FacebookOAuth2"))) \
            .filter(date=OuterRef('date'))

        return activities.distinct('date').annotate(unique=Subquery(statistics.values('unique')),
                                                    total=Subquery(statistics.values('total')),
                                                    github=Subquery(statistics.values('github')),
                                                    google = Subquery(statistics.values('google')),
                                                    facebook = Subquery(statistics.values('facebook')),
                                                    django=Subquery(statistics.values('django')))