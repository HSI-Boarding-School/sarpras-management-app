import { AuthSplitLayout } from 'src/layouts/auth-split';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <GuestGuard>
      <AuthSplitLayout section={{ title: 'Selamat Datang Admin', subtitle: 'Sistem Manajemen Inventaris HSIBS' }}>{children}</AuthSplitLayout>
    </GuestGuard>
  );
}
