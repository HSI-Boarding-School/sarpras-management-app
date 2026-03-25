'use client';

import { use } from 'react';

import { ReportsDetailView } from 'src/sections/reports';

// ----------------------------------------------------------------------

export default function ReportsDetailPage({ params }) {
  const { id } = use(params);
  return <ReportsDetailView reportId={id} />;
}
