'use client';

import { useState, useEffect } from 'react';
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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Form, Field } from 'src/components/hook-form';

import { INVENTORY_LOCATIONS_BY_BRANCH, INVENTORY_STATUS, INVENTORY_BRANCHES, getLocationsByBranch } from 'src/_mock/_inventory';
import { createInventoryItem, getBranches, getLocationsByBranch as getLocationsFromDB } from 'src/lib/db';

// ----------------------------------------------------------------------

const CreateInventorySchema = zod.object({
  name: zod.string().min(1, { message: 'Nama barang wajib diisi!' }),
  branch: zod.string().min(1, { message: 'Cabang wajib dipilih!' }),
  location: zod.string().min(1, { message: 'Lokasi wajib dipilih!' }),
  quantity: zod.coerce.number().min(1, { message: 'Jumlah minimal 1!' }),
  status: zod.string().min(1, { message: 'Status wajib dipilih!' }),
  image: zod.string().min(1, { message: 'Gambar barang wajib diunggah!' }),
  description: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function InventoryCreateView() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('sukabumi');
  const [branches, setBranches] = useState([]);
  const [locations, setLocations] = useState([]);
  const [branchMap, setBranchMap] = useState({});

  // Fetch branches and locations from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchesData = await getBranches();
        setBranches(branchesData);
        
        // Create a map of branch code to UUID
        const map = {};
        branchesData.forEach(branch => {
          map[branch.code] = branch.id;
        });
        setBranchMap(map);

        // Fetch locations for default branch
        if (branchesData.length > 0) {
          const defaultBranch = branchesData.find(b => b.code === 'sukabumi') || branchesData[0];
          const locationsData = await getLocationsFromDB(defaultBranch.id);
          setLocations(locationsData);
        }
      } catch (error) {
        console.error('Error fetching branches/locations:', error);
      }
    };

    fetchData();
  }, []);

  const defaultValues = {
    name: '',
    branch: 'sukabumi',
    location: '',
    quantity: 1,
    status: 'baik',
    image: '',
    description: '',
  };

  const methods = useForm({
    resolver: zodResolver(CreateInventorySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;

  const branchValue = watch('branch');

  // Update location options when branch changes
  useEffect(() => {
    const updateLocations = async () => {
      try {
        setSelectedBranch(branchValue);
        const branchId = branchMap[branchValue];
        
        if (branchId) {
          const locationsData = await getLocationsFromDB(branchId);
          setLocations(locationsData);
          // Set first location as default
          if (locationsData.length > 0) {
            setValue('location', locationsData[0].name);
          }
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    if (Object.keys(branchMap).length > 0) {
      updateLocations();
    }
  }, [branchValue, branchMap, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Get the actual UUID for branch and location from the database
      const branchId = branchMap[data.branch];
      
      // Find the location ID from the locations array
      const selectedLocation = locations.find(loc => loc.name === data.location);
      const locationId = selectedLocation?.id;

      if (!branchId || !locationId) {
        throw new Error('Branch atau lokasi tidak valid');
      }

      // Prepare data for Supabase
      const itemData = {
        name: data.name,
        branch_id: branchId,
        location_id: locationId,
        quantity: Number(data.quantity),
        status: data.status,
        image_url: data.image,
        description: data.description || null,
      };

      console.log('Submitting item data:', itemData);

      // Save to Supabase
      await createInventoryItem(itemData);
      
      setSuccessMessage('Barang berhasil ditambahkan!');
      
      setTimeout(() => {
        router.push(paths.dashboard.inventory.list);
      }, 1500);
    } catch (error) {
      console.error('Error creating item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal menambahkan barang. Silakan coba lagi.';
      setSuccessMessage(errorMessage);
    }
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
          Tambah Barang Inventaris
        </Typography>

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
                    options={locations.map((loc) => ({
                      value: loc.name,
                      label: loc.name,
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
                    Simpan Barang
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => router.push(paths.dashboard.inventory.list)}
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
