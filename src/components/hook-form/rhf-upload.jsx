import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function RHFUpload({ name, helperText, ...other }) {
  const { control, watch } = useFormContext();
  const imageUrl = watch(name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px dashed',
              borderColor: error ? 'error.main' : 'divider',
              backgroundColor: error ? 'error.lighter' : 'background.paper',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              },
            }}
          >
            <input
              hidden
              accept="image/*"
              type="file"
              id={name}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    field.onChange(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              {...other}
            />

            {imageUrl ? (
              <Stack spacing={2} alignItems="center">
                <Box
                  component="img"
                  src={imageUrl}
                  alt="preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    borderRadius: 1,
                    objectFit: 'cover',
                  }}
                />
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<Iconify icon="mdi:upload" />}
                  htmlFor={name}
                >
                  Ubah Gambar
                </Button>
              </Stack>
            ) : (
              <Stack spacing={2} alignItems="center">
                <Iconify icon="mdi:cloud-upload" sx={{ fontSize: 48, color: 'primary.main' }} />
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2">
                    Klik atau drag gambar ke sini
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Format: JPG, PNG, WebP (Max 5MB)
                  </Typography>
                </Stack>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<Iconify icon="mdi:upload" />}
                  htmlFor={name}
                >
                  Pilih Gambar
                </Button>
              </Stack>
            )}
          </Card>

          {error && (
            <Typography variant="caption" sx={{ color: 'error.main', mt: 1, display: 'block' }}>
              {error.message ?? helperText}
            </Typography>
          )}
        </Box>
      )}
    />
  );
}
