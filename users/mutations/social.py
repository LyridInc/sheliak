import os
import graphene
import requests

from users import mixins, types
from users.decorators import social_auth


class SocialAuthMutation(mixins.SocialAuthMixin, graphene.Mutation):
    social = graphene.Field(types.SocialType)

    class Meta:
        abstract = True

    class Arguments:
        provider = graphene.String(required=True)
        access_token = graphene.String(required=True)

    @classmethod
    @social_auth
    def mutate(cls, root, info, social, **kwargs):
        return cls.resolve(root, info, social, **kwargs)


class SocialAuthJWT(mixins.JSONWebTokenMixin, SocialAuthMutation):
    """Social Auth for JSON Web Token (JWT)"""


class GithubAccessToken(graphene.Mutation):
    class Arguments:
        code = graphene.String(required=True)

    access_token = graphene.String()

    def mutate(root, info, code):
        url = "https://github.com/login/oauth/access_token"
        payload = {
            'client_id': os.environ.get("GITHUB_APP_ID"),
            'client_secret': os.environ.get("GITHUB_APP_SECRET"),
            'code': code
        }
        response = requests.request("POST", url, headers={}, data=payload, files=[])
        token = ""
        if response.text:
            split_response_by_ampersand = response.text.split("&")
            if split_response_by_ampersand[0]:
                access_token_array = split_response_by_ampersand[0].split("=")
                token = access_token_array[1]
        return GithubAccessToken(access_token=token)