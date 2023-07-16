import json
import graphene
from datetime import timedelta, datetime, date
from collections import OrderedDict
from operator import itemgetter
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db.models.expressions import Window, RawSQL
from django.db.models.functions import TruncDate, RowNumber
from django.db.models import Count, Q, OuterRef, Subquery, Sum, Case, IntegerField, When, F, ValueRange
from graphql_jwt.decorators import staff_member_required
from graphene_django.filter.fields import DjangoFilterConnectionField

from helpers.utils import percentage_change
from users.models import UserLogin
from users.filters import UserLoginFilter, UserGrowthFilter
from users.types import LoginStatisticsType, AccountStatisticsType, UserGrowthStatisticsType

User = get_user_model()


class StatisticsQuery(graphene.ObjectType):
    account_statistics = graphene.Field(
        AccountStatisticsType,
        date_start=graphene.Date(required=True),
        date_end=graphene.Date(required=True)
    )
    user_growth_statistics = graphene.List(
        UserGrowthStatisticsType,
        date_start=graphene.Date(required=True),
        date_end=graphene.Date(required=True)
    )
    login_statistics = DjangoFilterConnectionField(LoginStatisticsType, filterset_class=UserLoginFilter)

    @staff_member_required
    def resolve_account_statistics(self, info, date_start, date_end):
        date_start = timezone.make_aware(datetime.combine(date_start, datetime.min.time()))
        date_end = timezone.make_aware(datetime.combine(date_end, datetime.min.time()))
        no_of_days = date_end - date_start

        # ---------------------------------------------
        all_active_users_qs = UserLogin.objects.values('user').distinct().count()
        all_qs = User.objects.aggregate(
            total=Count('id'),
            verified=Count('status', filter=Q(status__verified=True)),
            unverified=Count('status', filter=Q(status__verified=False)),
            deactivated=Count('is_active', filter=Q(is_active=False)),
            superuser=Count('is_superuser', filter=Q(is_superuser=True)),
            staff=Count('is_staff', filter=Q(is_staff=True)),
            never_login=Count('last_login', filter=Q(last_login=None)),
        )
        all_qs.update(active_users=all_active_users_qs)
        # ---------------------------------------------

        # ---------------------------------------------
        last_x_days_active_users_qs = UserLogin.objects.filter(
            timestamp__gte=date_start,
            timestamp__lte=date_end
        ).values('user').distinct().count()

        last_x_days_qs = User.objects.filter(
            date_joined__gte=date_start,
            date_joined__lte=date_end
        ).aggregate(
            total=Count('id'),
            verified=Count('status', filter=Q(status__verified=True)),
            unverified=Count('status', filter=Q(status__verified=False)),
            deactivated=Count('is_active', filter=Q(is_active=False)),
            superuser=Count('is_superuser', filter=Q(is_superuser=True)),
            staff=Count('is_staff', filter=Q(is_staff=True)),
            never_login=Count('last_login', filter=Q(last_login=None)),
        )
        last_x_days_qs.update(active_users=last_x_days_active_users_qs)
        # ---------------------------------------------

        # ---------------------------------------------
        trends_data = User.objects.filter(
            Q(date_joined__gte=date_start, date_joined__lte=date_end) |
            Q(date_joined__gte=date_start - no_of_days, date_joined__lte=date_start)
        ).annotate(
            joined=Count('id'),
            verified=Count('status', filter=Q(status__verified=True)),
        ).aggregate(
            current_joined=Sum(
                Case(
                    When(date_joined__gte=date_start, date_joined__lte=date_end, then=1),
                    default=0,
                    output_field=IntegerField(),
                ) * F('joined')
            ),
            current_verified=Sum(
                Case(
                    When(date_joined__gte=date_start, date_joined__lte=date_end, then=1),
                    default=0,
                    output_field=IntegerField(),
                ) * F('verified')
            ),
            previous_joined=Sum(
                Case(
                    When(date_joined__gte=date_start - no_of_days, date_joined__lte=date_start, then=1),
                    default=0,
                    output_field=IntegerField(),
                ) * F('joined')
            ),
            previous_verified=Sum(
                Case(
                    When(date_joined__gte=date_start - no_of_days, date_joined__lte=date_start, then=1),
                    default=0,
                    output_field=IntegerField(),
                ) * F('verified')
            ),
        )

        distinct_users = UserLogin.objects.filter(
            Q(timestamp__gte=date_start, timestamp__lte=date_end) |
            Q(timestamp__gte=date_start - no_of_days, timestamp__lte=date_start)
        ).values("user").annotate(
            current_count=Count("user", filter=Q(timestamp__gte=date_start, timestamp__lte=date_end), distinct=True),
            previous_count=Count("user", filter=Q(timestamp__gte=date_start - no_of_days, timestamp__lte=date_start),
                                 distinct=True)
        )

        current_average_logins = distinct_users.aggregate(Sum("current_count"))["current_count__sum"]
        previous_average_logins = distinct_users.aggregate(Sum("previous_count"))["previous_count__sum"]

        trends = {
            "percentage_change_joined": percentage_change(trends_data['previous_joined'],
                                                          trends_data['current_joined']),
            "percentage_change_verified": percentage_change(trends_data['previous_verified'],
                                                            trends_data['current_verified']),
            "percentage_change_logins": percentage_change(previous_average_logins, current_average_logins)
        }
        # ---------------------------------------------

        # ---------------------------------------------
        top_10_logins = User.objects.filter(
            user_logins__timestamp__gte=date_start,
            user_logins__timestamp__lte=date_end
        ).annotate(
            logins=Count('user_logins')
        ).order_by("-logins")[:10]
        # ---------------------------------------------

        return AccountStatisticsType(
            last_x_days=last_x_days_qs,
            trends_in_percent=trends,
            top_10_logins=top_10_logins,
            **all_qs
        )

    @staff_member_required
    def resolve_user_growth_statistics(self, info, date_start, date_end):
        date_start = timezone.make_aware(datetime.combine(date_start, datetime.min.time())).date()
        date_end = timezone.make_aware(datetime.combine(date_end, datetime.min.time())).date()

        users = User.objects.filter(
            Q(date_joined__date__gte=date_start, date_joined__date__lte=date_end)
        ).select_related('status') \
            .annotate(date=TruncDate('date_joined')) \
            .order_by('date')

        statistics = users.values('date').annotate(
            new_users=Count('id'),
            new_verified_users=Count(Case(When(status__verified=True, then=1))),
            new_unverified_users=Count(Case(When(status__verified=False, then=1))),
        ).filter(date=OuterRef('date'))[:100]

        results = users.distinct('date').annotate(
            new_users=Subquery(statistics.values('new_users')),
            new_verified_users=Subquery(statistics.values('new_verified_users')),
            new_unverified_users=Subquery(statistics.values('new_unverified_users')),
        )

        # Convert queryset to list for further manipulation
        results = list(results.values('date', 'new_users', 'new_verified_users', 'new_unverified_users'))

        # Python processing for cumulative total
        total_users = User.objects.filter(date_joined__date__lt=date_start).count()
        total_verified_users = User.objects.filter(date_joined__date__lt=date_start, status__verified=True).count()
        total_unverified_users = total_users - total_verified_users

        # Initialize the starting date and empty results dictionary
        current_date = date_start
        filled_results = {}

        for result in results:
            # If the date exists in results, add the counts to total counts
            while current_date < result['date']:
                # If the date is missing in results, add previous day's count
                filled_results[current_date] = {
                    'date': current_date,
                    'new_users': 0,
                    'new_verified_users': 0,
                    'new_unverified_users': 0,
                    'total_users': total_users,
                    'total_verified_users': total_verified_users,
                    'total_unverified_users': total_unverified_users
                }
                current_date += timedelta(days=1)

            total_users += result['new_users']
            total_verified_users += result['new_verified_users']
            total_unverified_users += result['new_unverified_users']
            result['total_users'] = total_users
            result['total_verified_users'] = total_verified_users
            result['total_unverified_users'] = total_unverified_users

            filled_results[result['date']] = result
            current_date += timedelta(days=1)

        while current_date <= date_end:
            # If the date is missing in results, add previous day's count
            filled_results[current_date] = {
                'date': current_date,
                'new_users': 0,
                'new_verified_users': 0,
                'new_unverified_users': 0,
                'total_users': total_users,
                'total_verified_users': total_verified_users,
                'total_unverified_users': total_unverified_users
            }
            current_date += timedelta(days=1)

        # Sorting the data based on date
        sorted_results = sorted(filled_results.values(), key=itemgetter('date'))

        return [UserGrowthStatisticsType(**result) for result in sorted_results]

    @staff_member_required
    def resolve_login_statistics(self, info, **kwargs):
        activities = UserLoginFilter(kwargs).qs.select_related('user') \
            .annotate(date=TruncDate('timestamp')) \
            .order_by('date')

        statistics = activities.values('date').annotate(
            unique=Count('user', distinct=True),
            total=Count('id'),
            github=Count('provider', filter=Q(provider="social_core.backends.github.GithubOAuth2")),
            google=Count('provider', filter=Q(provider="social_core.backends.google.GoogleOAuth2")),
            django=Count('provider', filter=Q(provider="django.contrib.auth.backends.ModelBackend")),
            facebook=Count('provider', filter=Q(provider="social_core.backends.facebook.FacebookOAuth2"))
        ).filter(date=OuterRef('date'))

        return activities.distinct('date').annotate(
            unique=Subquery(statistics.values('unique')),
            total=Subquery(statistics.values('total')),
            github=Subquery(statistics.values('github')),
            google=Subquery(statistics.values('google')),
            facebook=Subquery(statistics.values('facebook')),
            django=Subquery(statistics.values('django'))
        )
