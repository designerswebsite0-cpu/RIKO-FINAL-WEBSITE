import { Timestamp } from "firebase-admin/firestore";
import { deleteMenuImage } from "@/lib/storage";
import { getFirebaseDb } from "@/lib/firebase";
import {
  MenuItem, MenuStatus, PaginatedResult, Reservation, ReservationLog, ReservationStatus,
} from "@/types/domain";

type MenuInput = Omit<MenuItem, "id" | "slug" | "createdAt" | "updatedAt">;
type ReservationInput = Pick<Reservation, "name" | "email" | "phone" | "guests" | "date" | "time" | "specialRequest">;
type MenuFilters = { search?: string; category?: string; status?: string; page?: number; perPage?: number };
type ReservationFilters = { search?: string; status?: string; dateFilter?: string; startDate?: string; endDate?: string; page?: number; perPage?: number };

const menuCollection = "menu_items";
const reservationCollection = "reservations";
const logCollection = "reservation_logs";

const asString = (value: unknown, fallback = "") => typeof value === "string" ? value : value == null ? fallback : String(value);
const asNumber = (value: unknown, fallback = 0) => typeof value === "number" ? value : Number(value) || fallback;
const asBoolean = (value: unknown, fallback = false) => typeof value === "boolean" ? value : value == null ? fallback : value === 1 || value === "1" || value === "true";
const asIso = (value: unknown) => value instanceof Timestamp ? value.toDate().toISOString() : asString(value, new Date(0).toISOString());
const now = () => new Date().toISOString();

function menuFromDocument(id: string, raw: Record<string, unknown>): MenuItem {
  return {
    id: asString(raw.id, id),
    name: asString(raw.name),
    slug: asString(raw.slug),
    description: asString(raw.description),
    price: asNumber(raw.price),
    category: asString(raw.category, "Mains") as MenuItem["category"],
    imageUrl: asString(raw.image_url ?? raw.imageUrl),
    imagePublicId: asString(raw.image_public_id ?? raw.imagePublicId) || undefined,
    status: asString(raw.status, "Published") as MenuStatus,
    available: asBoolean(raw.available, true),
    sortOrder: asNumber(raw.sort_order ?? raw.sortOrder),
    createdAt: asIso(raw.created_at ?? raw.createdAt),
    updatedAt: asIso(raw.updated_at ?? raw.updatedAt ?? raw.created_at ?? raw.createdAt),
  };
}

function reservationFromDocument(id: string, raw: Record<string, unknown>): Reservation {
  return {
    id: asString(raw.id, id),
    name: asString(raw.name),
    email: asString(raw.email),
    phone: asString(raw.phone),
    guests: asNumber(raw.guests, 1),
    date: asString(raw.date),
    time: asString(raw.time),
    specialRequest: asString(raw.special_request ?? raw.specialRequest),
    status: asString(raw.status, "New") as ReservationStatus,
    isRead: asBoolean(raw.is_read ?? raw.isRead),
    createdAt: asIso(raw.created_at ?? raw.createdAt),
    updatedAt: asIso(raw.updated_at ?? raw.updatedAt ?? raw.created_at ?? raw.createdAt),
  };
}

function logFromDocument(id: string, raw: Record<string, unknown>): ReservationLog {
  return {
    id: asString(raw.id, id),
    reservationId: asString(raw.reservation_id ?? raw.reservationId),
    actionType: asString(raw.action_type ?? raw.actionType, "Created") as ReservationLog["actionType"],
    previousStatus: asString(raw.prev_status ?? raw.previousStatus) as ReservationStatus || undefined,
    newStatus: asString(raw.new_status ?? raw.newStatus) as ReservationStatus || undefined,
    createdAt: asIso(raw.timestamp ?? raw.created_at ?? raw.createdAt),
  };
}

function paginate<T>(items: T[], page = 1, perPage = 20): PaginatedResult<T> {
  const safePage = Math.max(1, Number(page) || 1);
  const safePerPage = Math.min(100, Math.max(1, Number(perPage) || 20));
  const totalItems = items.length;
  return {
    items: items.slice((safePage - 1) * safePerPage, safePage * safePerPage),
    totalItems,
    page: safePage,
    perPage: safePerPage,
    totalPages: Math.max(1, Math.ceil(totalItems / safePerPage)),
  };
}

function slugify(value: string) {
  return value.toLowerCase().trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

async function nextId(collection: string) {
  const db = getFirebaseDb();
  const counter = db.collection("_counters").doc(collection);
  const existing = await db.collection(collection).get();
  const existingMax = existing.docs.reduce((max, doc) => Math.max(max, asNumber(doc.data().id ?? doc.id)), 0);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(counter);
    const current = Math.max(asNumber(snapshot.data()?.current_id), existingMax);
    const id = current + 1;
    transaction.set(counter, { current_id: id }, { merge: true });
    return String(id);
  });
}

async function addReservationLog(reservationId: string, actionType: ReservationLog["actionType"], previousStatus?: ReservationStatus, newStatus?: ReservationStatus) {
  const db = getFirebaseDb();
  const id = await nextId(logCollection);
  await db.collection(logCollection).doc(id).set({
    id: Number(id), reservation_id: Number(reservationId), action_type: actionType,
    prev_status: previousStatus ?? null, new_status: newStatus ?? null, timestamp: now(),
  });
}

export async function listMenu(filters: MenuFilters = {}) {
  const snapshot = await getFirebaseDb().collection(menuCollection).get();
  const needle = filters.search?.toLowerCase().trim();
  const items = snapshot.docs.map((doc) => menuFromDocument(doc.id, doc.data()))
    .filter((item) => !needle || [item.name, item.description, item.category, item.status].some((value) => value.toLowerCase().includes(needle)))
    .filter((item) => !filters.category || item.category === filters.category)
    .filter((item) => !filters.status || item.status === filters.status)
    .sort((a, b) => (a.sortOrder || Number(a.id) || 0) - (b.sortOrder || Number(b.id) || 0));
  return paginate(items, filters.page, filters.perPage);
}

export async function listPublicMenu() {
  const all = await listMenu({ perPage: 100 });
  return all.items.filter((item) => item.status === "Published" && item.available)
    .sort((a, b) => (a.sortOrder || Number(a.id) || 0) - (b.sortOrder || Number(b.id) || 0));
}

export async function getMenuItem(id: string) {
  const snapshot = await getFirebaseDb().collection(menuCollection).doc(id).get();
  return snapshot.exists ? menuFromDocument(snapshot.id, snapshot.data() ?? {}) : null;
}

async function uniqueSlug(name: string, currentId?: string) {
  const all = await listMenu({ perPage: 100 });
  const base = slugify(name) || "menu-item";
  let candidate = base;
  let suffix = 1;
  while (all.items.some((item) => item.id !== currentId && item.slug === candidate)) candidate = `${base}-${suffix++}`;
  return candidate;
}

export async function createMenuItem(input: MenuInput) {
  const db = getFirebaseDb();
  const id = await nextId(menuCollection);
  const stamp = now();
  const item = { id: Number(id), name: input.name, slug: await uniqueSlug(input.name), description: input.description, price: input.price, category: input.category, image_url: input.imageUrl, image_public_id: input.imagePublicId ?? null, status: input.status, available: input.available, sort_order: input.sortOrder ?? Number(id), created_at: stamp, updated_at: stamp };
  await db.collection(menuCollection).doc(id).set(item);
  return menuFromDocument(id, item);
}

export async function updateMenuItem(id: string, input: Partial<MenuInput>) {
  const current = await getMenuItem(id);
  if (!current) return null;
  const updates: Record<string, unknown> = { updated_at: now() };
  if (input.name !== undefined) { updates.name = input.name; updates.slug = await uniqueSlug(input.name, id); }
  if (input.description !== undefined) updates.description = input.description;
  if (input.price !== undefined) updates.price = input.price;
  if (input.category !== undefined) updates.category = input.category;
  if (input.imageUrl !== undefined) updates.image_url = input.imageUrl;
  if (input.imagePublicId !== undefined) updates.image_public_id = input.imagePublicId || null;
  if (input.status !== undefined) updates.status = input.status;
  if (input.available !== undefined) updates.available = input.available;
  await getFirebaseDb().collection(menuCollection).doc(id).update(updates);
  if (input.imagePublicId && input.imagePublicId !== current.imagePublicId) await deleteMenuImage(current.imagePublicId);
  return getMenuItem(id);
}

export async function deleteMenuItem(id: string) {
  const current = await getMenuItem(id);
  if (!current) return false;
  await getFirebaseDb().collection(menuCollection).doc(id).delete();
  await deleteMenuImage(current.imagePublicId);
  return true;
}

export async function bulkMenuAction(ids: string[], action: "publish" | "draft" | "delete") {
  const db = getFirebaseDb();
  const batch = db.batch();
  const existing = await Promise.all(ids.map((id) => getMenuItem(id)));
  existing.forEach((item) => {
    if (!item) return;
    const ref = db.collection(menuCollection).doc(item.id);
    if (action === "delete") batch.delete(ref); else batch.update(ref, { status: action === "publish" ? "Published" : "Draft", updated_at: now() });
  });
  await batch.commit();
  if (action === "delete") await Promise.all(existing.map((item) => deleteMenuImage(item?.imagePublicId)));
}

export async function createReservation(input: ReservationInput) {
  const db = getFirebaseDb();
  const duplicate = await db.collection(reservationCollection).where("phone", "==", input.phone).get();
  if (duplicate.docs.some((doc) => { const row = reservationFromDocument(doc.id, doc.data()); return row.date === input.date && row.time === input.time && row.status !== "Cancelled"; })) throw new Error("A reservation already exists for this phone number, date, and time.");
  const id = await nextId(reservationCollection);
  const stamp = now();
  const row = { id: Number(id), name: input.name, email: input.email, phone: input.phone, guests: input.guests, date: input.date, time: input.time, special_request: input.specialRequest, status: "New", is_read: 0, created_at: stamp, updated_at: stamp };
  await db.collection(reservationCollection).doc(id).set(row);
  await addReservationLog(id, "Created", undefined, "New");
  return reservationFromDocument(id, row);
}

export async function listReservations(filters: ReservationFilters = {}) {
  const snapshot = await getFirebaseDb().collection(reservationCollection).get();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  const needle = filters.search?.toLowerCase().trim();
  const items = snapshot.docs.map((doc) => reservationFromDocument(doc.id, doc.data()))
    .filter((item) => !needle || [item.name, item.email, item.phone, item.specialRequest].some((value) => value.toLowerCase().includes(needle)))
    .filter((item) => !filters.status || item.status === filters.status)
    .filter((item) => filters.dateFilter === "today" ? item.date === today : filters.dateFilter === "tomorrow" ? item.date === tomorrow : filters.dateFilter === "upcoming" ? item.date >= today : true)
    .filter((item) => !filters.startDate || item.date >= filters.startDate)
    .filter((item) => !filters.endDate || item.date <= filters.endDate)
    .sort((a, b) => b.id.localeCompare(a.id, undefined, { numeric: true }));
  return paginate(items, filters.page, filters.perPage);
}

export async function getReservation(id: string, markRead = false) {
  const ref = getFirebaseDb().collection(reservationCollection).doc(id);
  const snapshot = await ref.get();
  if (!snapshot.exists) return null;
  const reservation = reservationFromDocument(snapshot.id, snapshot.data() ?? {});
  if (markRead && !reservation.isRead) { await ref.update({ is_read: 1, updated_at: now() }); reservation.isRead = true; }
  return reservation;
}

export async function updateReservation(id: string, input: { status?: ReservationStatus; isRead?: boolean }) {
  const current = await getReservation(id);
  if (!current) return null;
  const updates: Record<string, unknown> = { updated_at: now() };
  if (input.status !== undefined) updates.status = input.status;
  if (input.isRead !== undefined) updates.is_read = input.isRead ? 1 : 0;
  await getFirebaseDb().collection(reservationCollection).doc(id).update(updates);
  if (input.status && input.status !== current.status) await addReservationLog(id, "Status updated", current.status, input.status);
  return getReservation(id);
}

export async function deleteReservation(id: string) {
  const current = await getReservation(id);
  if (!current) return false;
  await getFirebaseDb().collection(reservationCollection).doc(id).delete();
  return true;
}

export async function reservationCounters() {
  const page = await listReservations({ perPage: 100 });
  return page.items.reduce<Record<ReservationStatus, number>>((counts, item) => { counts[item.status] += 1; return counts; }, { New: 0, Confirmed: 0, Pending: 0, Completed: 0, Cancelled: 0 });
}

export async function reservationLogs(reservationId: string) {
  const snapshot = await getFirebaseDb().collection(logCollection).get();
  return snapshot.docs.map((doc) => logFromDocument(doc.id, doc.data())).filter((log) => log.reservationId === reservationId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function recentReservationLogs() {
  const snapshot = await getFirebaseDb().collection(logCollection).get();
  return snapshot.docs.map((doc) => logFromDocument(doc.id, doc.data())).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10);
}

export async function databaseHealth() {
  const db = getFirebaseDb();
  await db.collection(menuCollection).limit(1).get();
  return { database: "firebase-firestore", collections: [menuCollection, reservationCollection, logCollection] };
}
