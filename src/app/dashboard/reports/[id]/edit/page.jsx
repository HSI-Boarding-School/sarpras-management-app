'use client';

import { use } from 'react';

import { ReportsEditView } from 'src/sections/reports';

// ----------------------------------------------------------------------

export default function ReportsEditPage({ params }) {
  const { id } = use(params);
  return <ReportsEditView reportId={id} />;
}
