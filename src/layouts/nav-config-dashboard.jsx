import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
      },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Manajemen Inventaris',
    items: [
      {
        title: 'Inventaris',
        path: paths.dashboard.inventory.root,
        icon: ICONS.product,
        children: [
          { title: 'Daftar Barang', path: paths.dashboard.inventory.list },
          { title: 'Detail Barang', path: paths.dashboard.inventory.cards },
          { title: 'Tambah Barang', path: paths.dashboard.inventory.create },
        ],
      },
      {
        title: 'Laporan',
        path: paths.dashboard.reports.root,
        icon: ICONS.file,
        children: [
          { title: 'Daftar Laporan', path: paths.dashboard.reports.root },
          { title: 'Buat Laporan', path: paths.dashboard.reports.create },
        ],
      },
    ],
  },
];
