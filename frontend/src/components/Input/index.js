import React from 'react';
import { TextField, Box, FormControlLabel, Switch } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const renderTextField = (control, errors, fieldName, intlPrefix, options = { type: 'text', required: false }) => {
	return (
		<FormattedMessage id={`${intlPrefix}.placeholder`}>
			{(placeholder) => (
				<Controller
					name={fieldName}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							type={options.type}
							label={<FormattedMessage id={`${intlPrefix}.label`} />}
							variant="standard"
							InputLabelProps={{
								shrink: true,
							}}
							error={!!errors[fieldName]}
							helperText={errors[fieldName] ? errors[fieldName].message : ''}
							placeholder={placeholder[0]}
							fullWidth
							required={options.required}
						/>
					)}
				/>
			)}
		</FormattedMessage>
	);
};

const renderSwitch = (control, fieldName, intlPrefix) => {
	return (
		<Box display="flex" justifyContent="flex-start">
			<FormattedMessage id={`${intlPrefix}.label`}>
				{(label) => (
					<Controller
						name={fieldName}
						control={control}
						render={({ field }) => (
							<FormControlLabel
								name={fieldName}
								control={<Switch {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
								label={label[0]}
							/>
						)}
					/>
				)}
			</FormattedMessage>
		</Box>
	);
};

const renderAutoComplete = (control, errors, fieldName, options = [], intlPrefix = '') => {
	return (
		<FormattedMessage id={`${intlPrefix}.placeholder`}>
			{(placeholder) => (
				<Controller
					name={fieldName}
					control={control}
					render={({ field }) => (
						<Autocomplete
							{...field}
							disablePortal
							options={options}
							getOptionLabel={(option) => option.label}
							renderInput={(params) => (
								<TextField
									{...params}
									label={<FormattedMessage id={`${intlPrefix}.label`} />}
									InputLabelProps={{ shrink: true }}
									error={!!errors[fieldName]}
									helperText={errors[fieldName] ? errors[fieldName].message : ''}
									placeholder={placeholder[0]}
									fullWidth
									variant="standard"
								/>
							)}
							value={options?.find((option) => option.value === field.value)}
							onChange={(_, value) => field.onChange(value?.value)}
						/>
					)}
				/>
			)}
		</FormattedMessage>
	);
};

const renderDatePickerField = (control, errors, fieldName, intlPrefix = '') => {
	return (
		<FormattedMessage id={`${intlPrefix}.placeholder`}>
			{(placeholder) => (
				<Controller
					name={fieldName}
					control={control}
					// defaultValue={defaultValue}
					render={({ field }) => (
						<DatePicker
							// value={field.value || null}
							{...field}
							label={<FormattedMessage id={`${intlPrefix}.label`} />}
							placeholder={placeholder[0]}
							// onChange={field.onChange}
							fullWidth
							sx={{ width: '100%' }}
							renderInput={(params) => (
								<TextField
									{...params}
									InputLabelProps={{ shrink: true }}
									error={!!errors[fieldName]}
									helperText={errors[fieldName] ? errors[fieldName].message : ''}
									variant="standard"
								/>
							)}
						/>
					)}
				/>
			)}
		</FormattedMessage>
	);
};

export { renderTextField, renderSwitch, renderAutoComplete, renderDatePickerField };
