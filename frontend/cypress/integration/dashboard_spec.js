describe('dashboard', () => {
	it('login', () => {
		cy.login({ email: 'support@lyrid.io', password: 'Lyrid123' });
	});
});
