'use client';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useMockedUser } from 'src/auth/hooks';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';
import { useBoolean } from 'minimal-shared/hooks';

// ----------------------------------------------------------------------

export function AccountDrawer({ sx, ...other }) {
  const { user } = useMockedUser();

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const renderLogo = () => (
    <Box
      component="img"
      alt="HSIBS Logo"
      src={`${CONFIG.assetsDir}/logo/logohsibs.png`}
      sx={{ width: 80, height: 80, objectFit: 'contain' }}
    />
  );

  return (
    <>
      <AccountButton
        onClick={onOpen}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 320 } },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            top: 12,
            left: 12,
            zIndex: 9,
            position: 'absolute',
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Box
            sx={{
              pt: 8,
              pb: 3,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {renderLogo()}

            <Typography variant="subtitle1" noWrap sx={{ textAlign: 'center' }}>
              Admin Sarpras
            </Typography>
          </Box>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={onClose} />
        </Box>
      </Drawer>
    </>
  );
}
