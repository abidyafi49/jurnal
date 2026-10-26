const API_BASE_URL = "http://localhost:5000/api";

async function apiRequest(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });

    const json = await response.json().catch(() => ({
      success: false,
      message: "Respons server tidak valid",
    }));

    return {
      ...json,
      status: response.status,
    };
  } catch (error) {
    console.error("API request gagal:", error);

    return {
      success: false,
      message: "Tidak dapat terhubung ke server",
      status: 0,
    };
  }
}

// AUTH

export function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function getCurrentUser() {
  return apiRequest("/auth/me");
}

export function logoutUser() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

// POSTS

export async function fetchAdminPosts() {
  const result = await apiRequest("/posts/admin");

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      status: result.status,
      data: [],
    };
  }

  return {
    ...result,
    data: result.data ?? [],
  };
}

export async function fetchPublishedPosts() {
  const result = await apiRequest("/posts/newspaper");

  return {
    ...result,
    data: result.success ? (result.data ?? []) : [],
  };
}

export function createPost(postData) {
  return apiRequest("/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
}
