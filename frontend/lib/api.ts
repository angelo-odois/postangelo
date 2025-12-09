const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchAPI<{ accessToken: string; refreshToken: string; user: unknown }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  refresh: (refreshToken: string, userId: string) =>
    fetchAPI<{ accessToken: string; refreshToken: string }>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken, userId }),
    }),

  getMe: (token: string) =>
    fetchAPI("/api/auth/me", { token }),

  // Pages
  getPages: (status?: string) =>
    fetchAPI<unknown[]>(`/api/pages${status ? `?status=${status}` : ""}`),

  getPage: (slug: string) =>
    fetchAPI(`/api/pages/${slug}`),

  getPageById: (id: string, token: string) =>
    fetchAPI(`/api/pages/by-id/${id}`, { token }),

  createPage: (data: unknown, token: string) =>
    fetchAPI("/api/pages", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  updatePage: (id: string, data: unknown, token: string) =>
    fetchAPI(`/api/pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),

  deletePage: (id: string, token: string) =>
    fetchAPI(`/api/pages/${id}`, {
      method: "DELETE",
      token,
    }),

  // Block Templates
  getBlockTemplates: () =>
    fetchAPI<unknown[]>("/api/admin/block-templates"),

  // Uploads
  uploadFile: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/api/admin/uploads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  },

  getAssets: (token: string, page = 1, limit = 20) =>
    fetchAPI(`/api/admin/uploads?page=${page}&limit=${limit}`, { token }),

  // Profile
  getMyProfile: (token: string) =>
    fetchAPI("/api/profile/me", { token }),

  saveProfile: (data: unknown, token: string) =>
    fetchAPI("/api/profile", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  // Experiences
  getExperiences: (token: string) =>
    fetchAPI<unknown[]>("/api/experiences", { token }),

  createExperience: (data: unknown, token: string) =>
    fetchAPI("/api/experiences", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  updateExperience: (id: string, data: unknown, token: string) =>
    fetchAPI(`/api/experiences/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),

  deleteExperience: (id: string, token: string) =>
    fetchAPI(`/api/experiences/${id}`, {
      method: "DELETE",
      token,
    }),

  reorderExperiences: (items: { id: string; order: number }[], token: string) =>
    fetchAPI("/api/experiences/reorder", {
      method: "PUT",
      body: JSON.stringify({ items }),
      token,
    }),

  // Education
  getEducation: (token: string) =>
    fetchAPI<unknown[]>("/api/education", { token }),

  createEducation: (data: unknown, token: string) =>
    fetchAPI("/api/education", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  updateEducation: (id: string, data: unknown, token: string) =>
    fetchAPI(`/api/education/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),

  deleteEducation: (id: string, token: string) =>
    fetchAPI(`/api/education/${id}`, {
      method: "DELETE",
      token,
    }),

  reorderEducation: (items: { id: string; order: number }[], token: string) =>
    fetchAPI("/api/education/reorder", {
      method: "PUT",
      body: JSON.stringify({ items }),
      token,
    }),

  // Skills
  getSkills: (token: string) =>
    fetchAPI<unknown[]>("/api/skills", { token }),

  createSkill: (data: unknown, token: string) =>
    fetchAPI("/api/skills", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  updateSkill: (id: string, data: unknown, token: string) =>
    fetchAPI(`/api/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),

  deleteSkill: (id: string, token: string) =>
    fetchAPI(`/api/skills/${id}`, {
      method: "DELETE",
      token,
    }),

  reorderSkills: (items: { id: string; order: number }[], token: string) =>
    fetchAPI("/api/skills/reorder", {
      method: "PUT",
      body: JSON.stringify({ items }),
      token,
    }),

  // Projects
  getProjects: (token: string) =>
    fetchAPI<unknown[]>("/api/projects", { token }),

  createProject: (data: unknown, token: string) =>
    fetchAPI("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  updateProject: (id: string, data: unknown, token: string) =>
    fetchAPI(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),

  deleteProject: (id: string, token: string) =>
    fetchAPI(`/api/projects/${id}`, {
      method: "DELETE",
      token,
    }),

  reorderProjects: (items: { id: string; order: number }[], token: string) =>
    fetchAPI("/api/projects/reorder", {
      method: "PUT",
      body: JSON.stringify({ items }),
      token,
    }),

  // Portfolio
  getPortfolio: (username: string) =>
    fetchAPI(`/api/portfolio/${username}`),

  updateUsername: (username: string, token: string) =>
    fetchAPI("/api/portfolio/username", {
      method: "PUT",
      body: JSON.stringify({ username }),
      token,
    }),

  checkUsername: (username: string, token: string) =>
    fetchAPI<{ available: boolean; reason?: string }>(`/api/portfolio/check-username/${username}`, { token }),

  // Page Templates
  getPageTemplates: () =>
    fetchAPI<PageTemplate[]>("/api/page-templates"),

  getPageTemplate: (slug: string) =>
    fetchAPI<PageTemplate>(`/api/page-templates/${slug}`),

  createPageFromTemplate: async (templateSlug: string, title: string, slug: string, token: string) => {
    // Get the template
    const template = await fetchAPI<PageTemplate>(`/api/page-templates/${templateSlug}`);

    // Create a new page with the template's content
    return fetchAPI("/api/pages", {
      method: "POST",
      body: JSON.stringify({
        title,
        slug,
        contentJSON: template.contentJSON,
        status: "draft",
      }),
      token,
    });
  },
};

// Types for Page Templates
export interface PageTemplate {
  id: string;
  name: string;
  description?: string;
  slug: string;
  thumbnailUrl?: string;
  category: "cv" | "landing" | "links" | "other";
  contentJSON: {
    blocks: unknown[];
    meta?: Record<string, unknown>;
  };
  defaultTitle?: string;
  isPremium: boolean;
  order: number;
  isActive: boolean;
}
