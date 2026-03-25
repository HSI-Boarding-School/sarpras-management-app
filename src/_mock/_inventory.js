import { _mock } from './_mock';

// Cabang HSIBS
export const INVENTORY_BRANCHES = [
  { value: 'sukabumi', label: 'HSIBS Sukabumi' },
  { value: 'purworejo', label: 'HSIBS Purworejo' },
  { value: 'bekasi', label: 'HSIBS Bekasi' },
];

// Lokasi barang berdasarkan cabang
export const INVENTORY_LOCATIONS_BY_BRANCH = {
  sukabumi: [
    'Kantor Kepala Sekolah',
    'Kantor Guru',
    'Masjid Utama',
    'Masjid Lama',
    'Asrama An Nawawi',
    'Asrama Ibnu Hajar',
    'Asrama Abu Hatim',
    'Asrama Adz Dzahabi',
    'Asrama Imam Bukhori',
    'Kantor HSIB',
    'Dapur',
    'Kamar Mandi',
  ],
  purworejo: [
    'Kantor Wakasek',
    'Dapur',
    'Masjid Ar Rayyan',
    'Kamar Musyrif Ibnu Qayyim',
    'Kamar Musyrif Ibnu Taimiyah',
    'Kamar Musyrif Ibnu Katsir',
    'Asrama Ibnu Taimiyah',
    'Asrama Ibnu Katsir',
    'Asrama Ibnu Qayyim',
    'Kamar Mandi',
  ],
  bekasi: [
    'Kelas',
    'Kantor Musyrif',
    'Asrama Santri',
    'Asrama Musyrif',
    'Dapur',
    'Lainnya',
  ],
};

// Lokasi barang di HSI Boarding School (untuk backward compatibility)
export const INVENTORY_LOCATIONS = [
  'Kantor Kepala Sekolah',
  'Kantor Guru',
  'Kantor Wakasek',
  'Masjid Utama',
  'Masjid Lama',
  'Masjid Ar Rayyan',
  'Asrama An Nawawi',
  'Asrama Ibnu Hajar',
  'Asrama Abu Hatim',
  'Asrama Adz Dzahabi',
  'Asrama Imam Bukhori',
  'Asrama Ibnu Taimiyah',
  'Asrama Ibnu Katsir',
  'Asrama Ibnu Qayyim',
  'Kamar Musyrif Ibnu Qayyim',
  'Kamar Musyrif Ibnu Taimiyah',
  'Kamar Musyrif Ibnu Katsir',
  'Dapur',
  'Kantor HSIB',
  'Kamar Mandi',
  'Kelas',
  'Kantor Musyrif',
  'Asrama Santri',
  'Asrama Musyrif',
  'Lainnya',
];

// Helper function to get locations by branch
export const getLocationsByBranch = (branch) => {
  return INVENTORY_LOCATIONS_BY_BRANCH[branch] || INVENTORY_LOCATIONS;
};

// Status barang
export const INVENTORY_STATUS = [
  { value: 'baik', label: 'Baik' },
  { value: 'rusak', label: 'Rusak' },
];

// Mock data untuk barang inventaris
export const _inventoryItems = Array.from({ length: 24 }, (_, index) => ({
  id: _mock.id(index),
  name: `Barang Inventaris ${index + 1}`,
  branch: INVENTORY_BRANCHES[index % INVENTORY_BRANCHES.length].value,
  location: INVENTORY_LOCATIONS[index % INVENTORY_LOCATIONS.length],
  quantity: _mock.number.nativeL(index) || Math.floor(Math.random() * 100) + 1,
  status: INVENTORY_STATUS[index % 2].value,
  image: _mock.image.cover(index),
  description: _mock.description(index),
  createdAt: _mock.time(index),
}));

// Mock data untuk laporan
export const _reports = Array.from({ length: 8 }, (_, index) => ({
  id: _mock.id(index),
  title: `Laporan Inventaris ${index + 1}`,
  description: _mock.description(index),
  createdAt: _mock.time(index),
  updatedAt: _mock.time(index),
  fileUrl: `/reports/laporan-${index + 1}.pdf`,
}));

// Summary data untuk dashboard
export const getInventorySummary = () => {
  const totalItems = _inventoryItems.length;
  const totalQuantity = _inventoryItems.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    return sum + qty;
  }, 0);
  const damagedItems = _inventoryItems.filter((item) => item.status === 'rusak').length;

  return {
    totalItems: Number(totalItems) || 0,
    totalQuantity: Number(totalQuantity) || 0,
    damagedItems: Number(damagedItems) || 0,
    goodItems: Number(totalItems - damagedItems) || 0,
  };
};
