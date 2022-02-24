""" Users schema tests """
import pytest


@pytest.mark.django_db
class TestLoginMutation:
    mutation = """
        mutation tokenAuth($email:String!, $password:String!) {
            tokenAuth(email: $email, password: $password) {
                success,
                errors,
                token,
                refreshToken,
                user {
                    id,
                    email,
                    verified,
                }
            }
        }
    """

    def test_login_active_user(self, graphql_query, user, json_loads):
        """Test logging in an active user."""
        result = json_loads(
            graphql_query(
                self.mutation,
                variables={
                    "email": user.email,
                    "password": "Lyrid123",
                },
            ).content
        )

        assert result['data']['tokenAuth'], 'Must have proper structure!'
        assert result['data']['tokenAuth']['success'], 'Must have success flag as True'
        assert result['data']['tokenAuth']['token'], 'Must have token field populated'
        assert result['data']['tokenAuth']['user']['email'] == user.email, 'Must match the existing user email'
