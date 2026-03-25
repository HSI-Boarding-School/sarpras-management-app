'use client';

import { use } from 'react';

import { InventoryDetailView } from 'src/sections/inventory';

// ----------------------------------------------------------------------

export default function InventoryDetailPage({ params }) {
  const { id } = use(params);
  return <InventoryDetailView itemId={id} />;
}
