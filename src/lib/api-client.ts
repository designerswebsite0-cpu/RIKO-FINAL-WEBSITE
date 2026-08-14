import type { MenuItem, ReservationStatus } from "@/types/domain";

/**
 * Frontend API Client
 *
 * This client abstracts all fetch calls to the backend. It reads from
 * NEXT_PUBLIC_API_BASE_URL. If not set, it defaults to the local Next.js `/api` folder.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export class ApiClient {
  /**
   * Helper method for consistent fetch options and error handling.
   */
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    // Add default headers while preserving provided ones
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    // Some routes might not return JSON (e.g. 204 No Content), but our API generally always returns JSON.
    const data = await response.json();
    return { status: response.status, ...data } as T & { status: number };
  }

  // --------------------------------------------------------
  // PUBLIC ROUTES
  // --------------------------------------------------------

  /**
   * Fetch the public menu items.
   */
  static async getMenu(): Promise<{ success: boolean; items: MenuItem[] }> {
    return this.request<{ success: boolean; items: MenuItem[] }>("/api/v1/menu", { cache: "no-store" });
  }

  /**
   * Submit a new reservation.
   */
  static async createReservation(data: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    specialRequest?: string;
  }): Promise<{ success: boolean; error?: string }> {
    return this.request<{ success: boolean; error?: string }>("/api/v1/reservations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // --------------------------------------------------------
  // AUTH ROUTES
  // --------------------------------------------------------

  static async adminLogin(password: string): Promise<{ success: boolean; error?: string }> {
    return this.request<{ success: boolean; error?: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  }

  static async adminLogout(): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>("/api/auth/logout", {
      method: "POST",
    });
  }

  // --------------------------------------------------------
  // ADMIN ROUTES (Requires Auth Cookie/Token)
  // --------------------------------------------------------

  static async getAdminReservations(): Promise<any> {
    return this.request<any>("/api/admin/reservations", { cache: "no-store" });
  }

  static async updateReservationStatus(id: string, status: ReservationStatus): Promise<any> {
    return this.request<any>(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  static async getAdminMenu(): Promise<{ success: boolean; items: MenuItem[] }> {
    return this.request<{ success: boolean; items: MenuItem[] }>("/api/admin/menu", { cache: "no-store" });
  }

  static async createMenuItem(data: Partial<MenuItem>): Promise<any> {
    return this.request<any>("/api/admin/menu", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateMenuItem(id: string, data: Partial<MenuItem>): Promise<any> {
    return this.request<any>(`/api/admin/menu/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async deleteMenuItem(id: string): Promise<any> {
    return this.request<any>(`/api/admin/menu/${id}`, {
      method: "DELETE",
    });
  }

  // --------------------------------------------------------
  // REELS ROUTES
  // --------------------------------------------------------

  static async getReels(): Promise<{ success: boolean; items: any[] }> {
    return this.request<{ success: boolean; items: any[] }>("/api/v1/reels", { cache: "no-store" });
  }

  static async getAdminReels(): Promise<any> {
    return this.request<any>("/api/admin/reels", { cache: "no-store" });
  }

  static async createReel(data: any): Promise<any> {
    return this.request<any>("/api/admin/reels", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateReel(id: string, data: any): Promise<any> {
    return this.request<any>(`/api/admin/reels/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async deleteReel(id: string): Promise<any> {
    return this.request<any>(`/api/admin/reels/${id}`, {
      method: "DELETE",
    });
  }
}
