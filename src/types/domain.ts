export const MENU_CATEGORIES = [
  "For One", "Salads", "Cold Dishes", "Hot Dishes", "Mains", "Desserts", "Beverages",
] as const;
export const MENU_STATUSES = ["Published", "Draft", "Archived"] as const;
export const RESERVATION_STATUSES = ["New", "Confirmed", "Pending", "Completed", "Cancelled"] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];
export type MenuStatus = (typeof MENU_STATUSES)[number];
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  imagePublicId?: string;
  status: MenuStatus;
  available: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  specialRequest: string;
  status: ReservationStatus;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationLog {
  id: string;
  reservationId: string;
  actionType: "Created" | "Status updated";
  previousStatus?: ReservationStatus;
  newStatus?: ReservationStatus;
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  perPage: number;
  totalPages: number;
}
