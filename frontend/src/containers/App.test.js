import App from './App';
import { mountWithTheme } from 'helpers/Testing';

it('should render the landing page.', () => {
	mountWithTheme(App);

	// Login button should be disabled
	cy.findByRole('button', { name: /login/i }).should('be.disabled');
});
