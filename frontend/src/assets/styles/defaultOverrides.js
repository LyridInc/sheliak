import { deepPurple } from '@mui/material/colors';

const defaultOverrides = {
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					color: '#ffffff',
					backgroundColor: deepPurple[700],
				},
			},
		},
	},
};

export const appOverrides = {
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundColor: '#f4f4f4',
				},
			},
		},
	},
};

export default defaultOverrides;
