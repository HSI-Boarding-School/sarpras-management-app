'use client';

import { use } from 'react';

import { InventoryEditView } from 'src/sections/inventory';

// ----------------------------------------------------------------------

export default function InventoryEditPage({ params }) {
  const { id } = use(params);
  return <InventoryEditView itemId={id} />;
}
