import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// ----------------------------------------------------------------------

export function RHFSelect({ name, helperText, options = [], ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          select
          fullWidth
          {...field}
          value={field.value ?? ''}
          error={!!error}
          helperText={error?.message ?? helperText}
          {...other}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
