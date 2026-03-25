import { supabase } from './supabase';

const BUCKET_NAME = 'sarpras-images';

export async function uploadImage(file: File, folder: string = 'inventory') {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function deleteImage(imageUrl: string) {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split(`/${BUCKET_NAME}/`);
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}
