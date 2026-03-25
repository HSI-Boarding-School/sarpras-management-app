import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export function AuthSplitSection({
  sx,
  method,
  methods,
  layoutQuery = 'md',
  title = 'Selamat Datang',
  imgUrl = `${CONFIG.assetsDir}/logo/logohsibs-white.png`,
  subtitle = 'Sistem Manajemen Inventaris HSIBS',
  ...other
}) {
  return (
    <Box
      sx={[
        (theme) => ({
          background: `linear-gradient(135deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.primary.dark} 100%)`,
          px: 3,
          pb: 3,
          width: 1,
          maxWidth: 480,
          display: 'none',
          position: 'relative',
          pt: 'var(--layout-header-desktop-height)',
          [theme.breakpoints.up(layoutQuery)]: {
            gap: 6,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component="img"
        alt="HSIBS Logo"
        src={imgUrl}
        sx={{ width: 120, height: 120, objectFit: 'contain' }}
      />

      <div>
        <Typography variant="h4" sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', mt: 1.5 }}>
            {subtitle}
          </Typography>
        )}
      </div>

      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', mt: 2, fontSize: '0.95rem' }}>
        Kelola inventaris sekolah dengan mudah dan efisien
      </Typography>
    </Box>
  );
}
