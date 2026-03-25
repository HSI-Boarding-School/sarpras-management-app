'use client';

import { useState, useEffect, useMemo } from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Form, Field } from 'src/components/hook-form';

import { INVENTORY_LOCATIONS_BY_BRANCH, INVENTORY_STATUS, INVENTORY_BRANCHES, getLocationsByBranch } from 'src/_mock/_inventory';
import { getInventoryItemById, updateInventoryItem, getBranches, getLocationsByBranch as getLocationsFromDB } from 'src/lib/db';

// ----------------------------------------------------------------------

const EditInventorySchema = zod.object({
  name: zod.string().min(1, { message: 'Nama barang wajib diisi!' }),
  branch: zod.string().min(1, { message: 'Cabang wajib dipilih!' }),
  location: zod.string().min(1, { message: 'Lokasi wajib dipilih!' }),
  quantity: zod.coerce.number().min(1, { message: 'Jumlah minimal 1!' }),
  status: zod.string().min(1, { message: 'Status wajib dipilih!' }),
  image: zod.string().min(1, { message: 'Gambar barang wajib ada!' }),
  description: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function InventoryEditView({ itemId }) {
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('sukabumi');

  // Compute default values using useMemo
  const defaultValues = useMemo(() => ({
    name: item?.name || '',
    branch: item?.branch_id || item?.branch || 'sukabumi',
    location: item?.location?.name || item?.location || '',
    quantity: item?.quantity || 1,
    status: item?.status || 'baik',
    image: item?.image_url || item?.image || '',
    description: item?.description || '',
  }), [item]);

  // Initialize form with useMemo to prevent hook order issues
  const methods = useForm({
    resolver: zodResolver(EditInventorySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
    reset,
  } = methods;

  const branchValue = watch('branch');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInventoryItemById(itemId);
        setItem(data);
        setSelectedBranch(data.branch_id || data.branch || 'sukabumi');
      } catch (error) {
        console.error('Error fetching item:', error);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId]);

  // Update form when item data changes
  useEffect(() => {
    if (item) {
      reset(defaultValues);
    }
  }, [item, defaultValues, reset]);

  // Update location options when branch changes
  useEffect(() => {
    setSelectedBranch(branchValue);
    const newLocations = getLocationsByBranch(branchValue);
    // Only update location if current location is not in new branch locations
    if (item && !newLocations.includes(item.location?.name || item.location)) {
      setValue('location', newLocations[0]);
    }
  }, [branchValue, setValue, item]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Fetch branches from database to get the UUID
      const branches = await getBranches();
      
      // Find branch by code
      const branchCode = data.branch;
      const selectedBranchData = branches.find((b) => b.code === branchCode);
      
      if (!selectedBranchData) {
        throw new Error(`Cabang dengan kode ${branchCode} tidak ditemukan di database`);
      }

      // Fetch locations from database to get the UUID
      const locations = await getLocationsFromDB(selectedBranchData.id);
      const selectedLocation = locations.find((l) => l.name === data.location);
      
      if (!selectedLocation) {
        throw new Error(`Lokasi ${data.location} tidak ditemukan di database`);
      }

      // Prepare data for Supabase
      const updateData = {
        name: data.name,
        branch_id: selectedBranchData.id,
        location_id: selectedLocation.id,
        quantity: Number(data.quantity),
        status: data.status,
        image_url: data.image,
        description: data.description || null,
      };

      console.log('Submitting inventory update:', updateData);

      // Update in Supabase
      await updateInventoryItem(itemId, updateData);
      
      setSuccessMessage('Barang berhasil diperbarui!');
      
      setTimeout(() => {
        router.push(paths.dashboard.inventory.detail(itemId));
      }, 1500);
    } catch (error) {
      console.error('Error updating item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal memperbarui barang. Silakan coba lagi.';
      setSuccessMessage(errorMessage);
    }
  });

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Barang tidak ditemukan
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push(paths.dashboard.inventory.list)}
          >
            Kembali ke Daftar Barang
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Edit Barang Inventaris
          </Typography>
          <Button
            variant="outlined"
            onClick={() => router.push(paths.dashboard.inventory.detail(itemId))}
          >
            Kembali
          </Button>
        </Box>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Form methods={methods} onSubmit={onSubmit}>
              <Stack spacing={3}>
                <Field.Text
                  name="name"
                  label="Nama Barang"
                  placeholder="Masukkan nama barang"
                />

                <Field.Select
                  name="branch"
                  label="Cabang"
                  options={INVENTORY_BRANCHES}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <Field.Select
                    name="location"
                    label="Lokasi Barang"
                    options={getLocationsByBranch(selectedBranch).map((loc) => ({
                      value: loc,
                      label: loc,
                    }))}
                  />

                  <Field.Text
                    name="quantity"
                    label="Jumlah Barang"
                    type="number"
                    inputProps={{ min: 1 }}
                  />
                </Box>

                <Field.Select
                  name="status"
                  label="Status Barang"
                  options={INVENTORY_STATUS}
                />

                <Field.Upload
                  name="image"
                  helperText="Gambar barang untuk dokumentasi visual"
                />

                <Field.Text
                  name="description"
                  label="Deskripsi (Opsional)"
                  placeholder="Masukkan deskripsi barang"
                  multiline
                  rows={4}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Simpan Perubahan
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => router.push(paths.dashboard.inventory.detail(itemId))}
                  >
                    Batal
                  </Button>
                </Box>
              </Stack>
            </Form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
