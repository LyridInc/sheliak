"""Top level conftest module."""
import json
import pytest
from django.urls import reverse
from graphene_django.utils import testing
from django.contrib.auth import get_user_model


@pytest.fixture
def user():
    user = get_user_model().objects.create_user(email='support@lyrid.io', password='Lyrid123',
                                                first_name='Support', is_active=True)
    """Return a db user."""
    return user


@pytest.fixture
def superuser():
    user = get_user_model().objects.create_user(email='support-su@lyrid.io', password='Lyrid123',
                                                first_name='Support-SU', is_active=True, is_staff=True)
    """Return a db super user."""
    return user


@pytest.fixture
def graphql_query(client):
    """Return a client query fn without logged-in user."""

    def func(*args, **kwargs):
        return testing.graphql_query(
            *args,
            **kwargs,
            client=client,
            graphql_url=reverse("graphql"),
        )

    return func


@pytest.fixture
def graphql_query_user(client, user):
    """Return a client query fn."""

    def func(*args, **kwargs):
        return testing.graphql_query(
            *args,
            **kwargs,
            client=client,
            graphql_url=reverse("graphql"),
        )

    client.force_login(user)
    return func


@pytest.fixture
def json_loads():
    """Return json loads."""
    return json.loads


@pytest.fixture
def user_client(client, user):
    """Return logged in client."""
    client.force_login(user)
    return client


@pytest.fixture
def superuser_client(client, superuser):
    """Return logged in superuser client."""
    client.force_login(superuser)
    return client
