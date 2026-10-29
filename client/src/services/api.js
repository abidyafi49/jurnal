const API_BASE_URL = "http://localhost:5000/api";

async function apiRequest(path, options = {}) {
  try {
    const isFormDataBody =
      typeof FormData !== "undefined" && options.body instanceof FormData;
    
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body && !isFormDataBody ? { "Content-Type": "application/json" } : {}),
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
  const formData = new FormData();

  formData.append("title", postData.title);
  formData.append("category", postData.category);
  formData.append("content", postData.content);
  formData.append("isPublished", String(postData.isPublished));

  if (postData.coverImage) {
    formData.append("coverImage", postData.coverImage);
  }

  return apiRequest("/posts", {
    method: "POST",
    body: formData,
  });
}


export function getPostById(id) {
  return apiRequest(`/posts/${id}`);
}


export function updatePost(id, postData) {
  const formData = new FormData();

  formData.append("title", postData.title);
  formData.append("category", postData.category);
  formData.append("content", postData.content);
  formData.append("isPublished", String(postData.isPublished));

  if (postData.coverImage) {
    formData.append("coverImage", postData.coverImage);
  }

  return apiRequest(`/posts/${id}`, {
    method: "PATCH",
    body: formData,
  });
}


export function deletePost(id) {
  return apiRequest(`/posts/${id}`, {
    method: "DELETE",
  });
}
