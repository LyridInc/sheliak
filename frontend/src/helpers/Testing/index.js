import React from 'react';
import AppLocale from 'i18n';
import { mount } from '@cypress/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import { createTheme, ThemeProvider } from '@mui/material';

import { URLConstant } from 'constants/index';
import defaultTheme from 'assets/styles/defaultTheme';
import defaultOverrides from 'assets/styles/defaultOverrides';
import { SheliakToastContainer } from 'components/Toast/ToastContainer';

export const mountWithTheme = (Comp, props = {}, mocks = []) => {
	let component;

	const landingTheme = {
		...defaultTheme,
		...defaultOverrides,
	};

	component = mount(
		<MockedProvider mocks={mocks} addTypename={false}>
			<IntlProvider locale="en" messages={AppLocale['en'].messages}>
				<ToastProvider autoDismiss components={{ ToastContainer: SheliakToastContainer }}>
					<MemoryRouter initialEntries={[{ pathname: URLConstant.HOME }]}>
						<ThemeProvider theme={createTheme(landingTheme)}>
							<Comp {...props} />
						</ThemeProvider>
					</MemoryRouter>
				</ToastProvider>
			</IntlProvider>
		</MockedProvider>,
	);

	return component;
};
