import { deepPurple, indigo } from '@mui/material/colors';

const defaultTheme = {
	palette: {
		primary: {
			light: deepPurple[500],
			main: deepPurple[700],
			dark: deepPurple[900],
			contrastText: '#ffffff',
		},

		secondary: {
			light: indigo[500],
			main: indigo[700],
			dark: indigo[900],
			contrastText: '#ffffff',
		},
	},
};

export default defaultTheme;
