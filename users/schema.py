import graphene
from graphql_auth import mutations

from users.queries import StatisticsQuery, UserQuery
from users.mutations import (
    SocialAuthJWT, GithubAccessToken, SendWelcomeEmail, PasswordSetAdmin, UserRegisterAdmin, UserPatchAdmin, UserPatch, DeleteUserAdmin
)


class Query(
    StatisticsQuery,
    UserQuery,
):
    pass


class Mutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    password_set = mutations.PasswordSet.Field()
    password_change = mutations.PasswordChange.Field()
    # archive_account = mutations.ArchiveAccount.Field()
    # delete_account = mutations.DeleteAccount.Field()
    # send_secondary_email_activation =  mutations.SendSecondaryEmailActivation.Field()
    # verify_secondary_email = mutations.VerifySecondaryEmail.Field()
    # swap_emails = mutations.SwapEmails.Field()
    # remove_secondary_email = mutations.RemoveSecondaryEmail.Field()

    # django-graphql-jwt inheritances
    token_auth = mutations.ObtainJSONWebToken.Field()
    verify_token = mutations.VerifyToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    revoke_token = mutations.RevokeToken.Field()

    # Social
    social_auth = SocialAuthJWT.Field()
    social_auth_github = GithubAccessToken.Field()

    # custom
    send_welcome_email = SendWelcomeEmail.Field()
    update_account = UserPatch.Field()

    # staff/admin
    password_set_admin = PasswordSetAdmin.Field()
    register_admin = UserRegisterAdmin.Field()
    update_account_admin = UserPatchAdmin.Field()
    delete_account_admin = DeleteUserAdmin.Field()