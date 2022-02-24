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
						'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJlbWFpbCI6ImdlZWthc2h1QGdtYWlsLmNvbSIsInN1YiI6IjgxYzIzYmM1LTFhNzAtNGYwMi1hYjgwLWIyMjBkYTBkMDhmZSIsImV4cCI6MTY0MTMxMTA5NywiaWF0IjoxNjQxMzAzODk3LCJpc3MiOiJpZC5zdGFnaW5nMDEubHlyaWQuaW8iLCJtb2RpZmllZCI6IjIwMjEtMTItMTYgMDk6MzY6MTAuNjkyNzI5KzAwOjAwIiwidmVyaWZpZWQiOnRydWUsIm5hbWUiOiJBc2hpc2ggU2FpbmkiLCJhbHRlcm5hdGVfaWRzIjpbImF1dGgwfDVlOTQwNDNiN2E2MTUyMGM2MWVkMGRhOCJdfQ.cL0izubUOseMnp1LkZ_-mqo4FCDj_3zUQBhus9RAZu6gCN76_QIqoL8V9yTMNoFjGTSIK4BKEyXQXYDZdMXs4pX9uQJbIQwBgugGqLp_rreyGCg5omMbvr_JcKckM7dR7rHpsBpPwy6we5yCI6WKjwbAe8iE3Tv51HAtrBHbVlsqAncRerpmiwk3DU1UveAVlGDCuLThPgubR7toepCyLD5hh5xEJIk7Poerda2xIT2Kva4ncyGiX6qO2Zmt4NKnDR0rIPf6SD7Wd4TUvKi-otzerLevJpstsYXNxGocxtb5NIQqFi1cCPPzLJaKcz4C45_8dSF9oAsA5nwdMLgAfcftRbWsTT6teS1iH_phwbDZkw42Lb4vmzF3UFO8mAELR3Xe30YwdG-jtn1R8VYQ1pxmatVSZpqe-xCpQmwt9HgM7Se4stecnAQmorK8LRuRpL3-UlOAev0KscLWUVO6foQVn6QyHrqzGWyBuTL-SFVlFHtEnA0ZH0QwWmA-0GjDmkgIrzNyEBecSG6Wp6QDn08XXWmk7PnsZ121z4z1MPwRne3uFDcoG86wTRPiy3B6fYGG16X471LQYYhGLwxBwcqOPoaQW3dhr_ZNOoxdMhQBwoFiefNonsjZofXH42Us-j7bTQDiA6Qjk4iIzQcsiy60DYzuwcxVgpD4wL5q4uM',
					refreshToken: 'f0bf37c8b23710f1f835861469e13eb8e18c80c5',
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
