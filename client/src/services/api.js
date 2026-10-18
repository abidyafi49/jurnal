const API_BASE_URL = "http://localhost:5000/api";

// Mengambil semua catatan untuk Admin (termasuk draft)
export async function fetchAdminPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/admin`);
    const json = await response.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error('Gagal mengambil data admin posts:', error);
    return [];
  }
}

// Mengambil catatan yang sudah dipublikasikan untuk Newspaper publik
export async function fetchPublishedPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/newspaper`);
    const json = await response.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error('Gagal mengambil data newspaper posts:', error);
    return [];
  }
}

// Membuat catatan / jurnal baru
export async function createPost(postData) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Gagal membuat post baru:', error);
    return { success: false, message: 'Terjadi kesalahan jaringan' };
  }
}