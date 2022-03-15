import os
import re
import graphene
import requests
from requests_oauthlib import OAuth1
from urllib.parse import parse_qs

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
    
    
class TwitterRequestToken(graphene.Mutation):
    authenticate_url = graphene.String()
    request_oauth_token = graphene.String()
    request_oauth_secret = graphene.String()
    
    def mutate(root, info):
        request_url = "https://api.twitter.com/oauth/request_token"
        oauth = OAuth1(client_key=os.environ.get("TWITTER_APP_ID"),
                       client_secret=os.environ.get("TWITTER_APP_SECRET"),
                       callback_uri=os.environ.get("TWITTER_APP_REQ_CALLBACK"))
        
        response = requests.post(url=request_url, auth=oauth)
        credentials = parse_qs(response.content)
        request_oauth_token = credentials.get(b'oauth_token')[0].decode('utf-8')
        request_oauth_secret = credentials.get(b'oauth_token_secret')[0].decode('utf-8')
        
        authenticate_url = "https://api.twitter.com/oauth/authenticate?oauth_token={}"\
            .format(request_oauth_token)
        
        return TwitterRequestToken(authenticate_url=authenticate_url,
                                   request_oauth_token=request_oauth_token,
                                   request_oauth_secret=request_oauth_secret)
    
    
class TwitterAccessToken(graphene.Mutation):
    class Arguments:
        request_token = graphene.String(required=True)
        verifier = graphene.String(required=True)
    
    access_token = graphene.String()
    access_token_secret = graphene.String()
    
    def mutate(root, info, request_token, verifier):
        access_url = "https://api.twitter.com/oauth/access_token"
        oauth = OAuth1(client_key=os.environ.get("TWITTER_APP_ID"),
                       resource_owner_key=request_token,
                       verifier=verifier)
        
        response = requests.post(url=access_url, auth=oauth)
        credentials = parse_qs(response.content)
        access_token = credentials.get(b'oauth_token')[0].decode('utf-8')
        access_secret = credentials.get(b'oauth_token_secret')[0].decode('utf-8')
        
        return TwitterAccessToken(access_token=access_token, access_token_secret=access_secret)