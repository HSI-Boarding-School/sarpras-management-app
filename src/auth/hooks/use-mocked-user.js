import { _mock } from 'src/_mock';

// To get the user from the <AuthContext/>, you can use

// Change:
// import { useMockedUser } from 'src/auth/hooks';
// const { user } = useMockedUser();

// To:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Admin HSIBS',
    email: 'admin@hsibs.id',
    photoURL: _mock.image.avatar(24),
    phoneNumber: _mock.phoneNumber(1),
    country: 'Indonesia',
    address: 'HSIBS Boarding School',
    state: 'Jawa Barat',
    city: 'Sukabumi',
    zipCode: '43000',
    about: 'Administrator Sistem Inventaris HSIBS Boarding School',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}
