import '@testing-library/cypress/add-commands';

Cypress.Commands.add('login', (params) => {
	cy.visit('/');

	// Login button should be disabled
	cy.findByRole('button', { name: /login/i }).should('be.disabled');

	cy.findByRole('textbox').type(params.email);

	// Login button should still be disabled
	cy.findByRole('button', { name: /login/i }).should('be.disabled');

	cy.findByPlaceholderText(/password/i).type(params.password, { sensitive: true });

	// Login button should be enabled.
	cy.findByRole('button', { name: /login/i }).should('be.enabled');

	cy.findByRole('button', { name: /login/i }).click();

	cy.location('pathname', { timeout: 60000 }).should('include', '/dashboard');

	cy.findByText(/user activity/i).should('exist');
});
