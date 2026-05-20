import type { SaveDocumentPayload } from '../types/document';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types/user';
import { API_BASE_URL, CACHE_PREFIX, CACHE_EXPIRY_MS, TOKEN_KEY } from '../config';

/**
 * Service API — Abstraksi fetch dengan auth token.
 * Semua method return typed data.
 */
class ApiService {

  private setCache(key: string, data: any) {
    const cacheData = { timestamp: Date.now(), data };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheData));
  }

  private getCache<T>(key: string): T | null {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return null;
    try {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_EXPIRY_MS) {
        localStorage.removeItem(`${CACHE_PREFIX}${key}`);
        return null;
      }
      return data as T;
    } catch {
      return null;
    }
  }

  public clearCache() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }

  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }



  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const method = options.method || 'GET';
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

      // Guard against non-JSON responses (e.g. HTML error pages from 413, 502, etc.)
      const contentType = response.headers.get('content-type') || '';
      let data: any;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        // Surface a meaningful error instead of a cryptic SyntaxError
        throw new Error(
          response.status === 413
            ? 'Ukuran data terlalu besar. Coba kurangi ukuran gambar yang diunggah.'
            : `Server error ${response.status}: ${text.slice(0, 200)}`
        );
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Terjadi kesalahan');
      }

      return data as T;
    } catch (error: any) {
      throw error;
    }
  }

  // === Auth ===
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    this.clearCache();
    return this.request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
  }

  register(data: RegisterData): Promise<AuthResponse> {
    this.clearCache();
    return this.request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  }

  forgotPassword(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/forgot-password', { 
      method: 'POST', 
      body: JSON.stringify({ email }) 
    });
  }

  resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/reset-password', { 
      method: 'POST', 
      body: JSON.stringify({ token, newPassword }) 
    });
  }

  verifyResetToken(token: string): Promise<{ valid: boolean; email: string }> {
    return this.request<{ valid: boolean; email: string }>(`/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
  }

  async getMe(): Promise<import('../types/user').User> {
    const cached = this.getCache<import('../types/user').User>('user');
    if (cached) return cached;

    const data = await this.request<import('../types/user').User>('/auth/me');
    this.setCache('user', data);
    return data;
  }

  async updateUser(data: { 
    name?: string; 
    headline?: string; 
    bio?: string; 
    location?: string; 
    profileImageUrl?: string;
    socialLinks?: { platform: string, url: string }[];
    phones?: { number: string, label: string }[];
  }): Promise<import('../types/user').User> {
    const res = await this.request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) });
    this.setCache('user', res); // Update cache with fresh data
    return res;
  }

  // === Documents ===
  async getDocuments(): Promise<import('../types/enums').RecentDocument[]> {
    const cached = this.getCache<import('../types/enums').RecentDocument[]>('documents');
    if (cached) return cached;

    const data = await this.request<import('../types/enums').RecentDocument[]>('/documents');
    this.setCache('documents', data);
    return data;
  }

  async getDocument(id: string): Promise<any> {
    return this.request(`/documents/${id}`);
  }

  async saveDocument(doc: SaveDocumentPayload): Promise<any> {
    const res = await this.request('/documents', { method: 'POST', body: JSON.stringify(doc) });
    localStorage.removeItem(`${CACHE_PREFIX}documents`);
    return res;
  }

  async updateDocument(id: string, data: Partial<SaveDocumentPayload>): Promise<any> {
    const res = await this.request(`/documents/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    localStorage.removeItem(`${CACHE_PREFIX}documents`);
    return res;
  }

  async deleteDocument(id: string): Promise<any> {
    const res = await this.request(`/documents/${id}`, { method: 'DELETE' });
    localStorage.removeItem(`${CACHE_PREFIX}documents`);
    return res;
  }

  // === Chat ===
  saveChatMessage(msg: { content: string; role: string }): Promise<any> {
    return this.request('/chat', { method: 'POST', body: JSON.stringify(msg) });
  }

  getChatHistory(): Promise<any[]> {
    return this.request('/chat');
  }

  generateAiChat(prompt: string, documentId?: string): Promise<{ id: string, content: string, role: string }> {
    return this.request('/chat/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, documentId })
    });
  }
}

/** Singleton API instance */
export const api = new ApiService();
