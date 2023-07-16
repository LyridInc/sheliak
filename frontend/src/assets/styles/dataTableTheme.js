import { createTheme } from '@mui/material/styles';

const DataTableTheme = () =>
	createTheme({
		components: {
			MuiTableRow: {
				styleOverrides: {
					head: { height: '40px' },
					root: {
						'&$selected': {
							'&$hover': {
								backgroundColor: '#f4f4f7',
							},
						},
					},
				},
			},
			MuiTableCell: {
				styleOverrides: {
					root: { padding: '8px' },
					head: { lineHeight: 'unset' },
				},
			},
		},
	});

export default DataTableTheme;
