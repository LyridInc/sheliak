import LoginForm from './LoginForm';
import { AuthMutation } from 'graphql/mutations';
import { mountWithTheme } from 'helpers/Testing';

const mockResults = {
	createTokenAuthData() {
		return {
			data: {
				tokenAuth: {
					success: true,
					errors: null,
					token:
						'access_token',
					refreshToken: 'refresh_token',
					user: {
						id: 'VXNlck5vZGU6ODFjMjNiYzUtMWE3MC00ZjAyLWFiODAtYjIyMGRhMGQwOGZl',
						email: 'support@lyrid.io',
						verified: true,
						isStaff: true,
						isActive: true,
					},
				},
			},
		};
	},
};

const params = { email: 'support@lyrid.io', password: 'Lyrid123' };
const mocks = [
	{
		request: {
			query: AuthMutation.LOGIN,
			variables: params,
		},
		result: () => mockResults.createTokenAuthData(),
	},
];

it('should render the email, password and submit button', () => {
	cy.spy(mockResults, 'createTokenAuthData').as('createTokenAuthDataSpy');
	mountWithTheme(LoginForm, {}, mocks);

	// Login button should be disabled
	cy.findByRole('button', { name: /login/i }).should('be.disabled');

	cy.findByRole('textbox').type(params.email);

	// Login button should still be disabled
	cy.findByRole('button', { name: /login/i }).should('be.disabled');

	cy.findByPlaceholderText(/password/i).type(params.password, { sensitive: true });

	// Login button should be enabled.
	cy.findByRole('button', { name: /login/i }).should('be.enabled');

	cy.findByRole('button', { name: /login/i }).click();

	cy.get('@createTokenAuthDataSpy').should('be.calledOnce');
});
