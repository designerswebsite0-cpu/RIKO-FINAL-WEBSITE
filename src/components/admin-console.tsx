"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { MenuItem, MenuStatus, Reservation, ReservationStatus, Reel } from "@/types/domain";
import logo from "@/assets/riko-logo.png";
import { ApiClient } from "@/lib/api-client";

type View = "reservations" | "menu" | "reels";
type DashboardItem = Reservation | MenuItem | Reel;
type MenuCategoryFilter = "All" | MenuItem["category"];

const reservationStatuses: ReservationStatus[] = ["New", "Confirmed", "Pending", "Completed", "Cancelled"];
const menuStatuses: MenuStatus[] = ["Published", "Draft", "Archived"];
const menuCategories: MenuItem["category"][] = [
  "For One",
  "Salads",
  "Cold Dishes",
  "Hot Dishes",
  "Mains",
  "Desserts",
  "Beverages",
];

function isReservation(item: DashboardItem): item is Reservation {
  return "guests" in item && !("videoUrl" in item);
}

function isMenuItem(item: DashboardItem): item is MenuItem {
  return "price" in item && !("videoUrl" in item);
}

function isReel(item: DashboardItem): item is Reel {
  return "videoUrl" in item;
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function statusTone(status: string) {
  if (status === "Confirmed" || status === "Published") return "border-emerald-400/30 bg-emerald-500/10 text-emerald-200";
  if (status === "New") return "border-sky-400/30 bg-sky-500/10 text-sky-200";
  if (status === "Pending" || status === "Draft") return "border-amber-400/30 bg-amber-500/10 text-amber-200";
  if (status === "Cancelled" || status === "Archived") return "border-red-400/30 bg-red-500/10 text-red-200";
  return "border-sand/20 bg-sand/10 text-sand/70";
}

export function AdminConsole() {
  const [view, setView] = useState<View>("reservations");
  const [data, setData] = useState<DashboardItem[]>([]);
  const [menuCategory, setMenuCategory] = useState<MenuCategoryFilter>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async (currentView: View) => {
    setLoading(true);
    setError("");

    try {
      let json;
      if (currentView === "menu") {
        json = await ApiClient.getAdminMenu();
      } else if (currentView === "reels") {
        json = await ApiClient.getAdminReels();
      } else {
        json = await ApiClient.getAdminReservations();
      }

      if ((json as any).status === 401) {
        router.push("/admin");
        return;
      }

      if (!json.success) throw new Error((json as any).error || "Unable to load dashboard data.");
      setData(Array.isArray(json.items) ? json.items : []);
    } catch (err) {
      setData([]);
      setError(err instanceof Error ? err.message : "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData(view);
  }, [fetchData, view]);

  useEffect(() => {
    if (view !== "reservations") return;
    const source = new EventSource("/api/admin/reservations/stream");

    source.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        if (json.success && Array.isArray(json.items)) {
          setData(json.items);
          setLoading(false);
          setError("");
        } else if (json.error) {
          setError(json.error);
        }
      } catch {
        setError("Unable to read reservation updates.");
      }
    };

    source.onerror = () => {
      source.close();
      void fetchData("reservations");
    };

    return () => source.close();
  }, [fetchData, view]);

  const stats = useMemo(() => {
    const reservations = data.filter(isReservation);
    const menu = data.filter(isMenuItem);
    const reels = data.filter(isReel);
    return {
      total: data.length,
      unread: reservations.filter((item) => !item.isRead).length,
      upcoming: reservations.filter((item) => item.date >= new Date().toISOString().slice(0, 10)).length,
      published: menu.filter((item) => item.status === "Published").length,
    };
  }, [data]);

  const menuItems = useMemo(
    () =>
      data
        .filter(isMenuItem)
        .filter((item) => menuCategory === "All" || item.category === menuCategory)
        .sort((a, b) => {
          const categoryDelta = menuCategories.indexOf(a.category) - menuCategories.indexOf(b.category);
          if (categoryDelta !== 0) return categoryDelta;
          return (a.sortOrder || Number(a.id) || 0) - (b.sortOrder || Number(b.id) || 0);
        }),
    [data, menuCategory],
  );

  const menuByCategory = useMemo(() => {
    const grouped = new Map<MenuItem["category"], MenuItem[]>();
    for (const category of menuCategories) grouped.set(category, []);
    for (const item of menuItems) grouped.get(item.category)?.push(item);
    return Array.from(grouped.entries()).filter(([, items]) => items.length > 0);
  }, [menuItems]);

  const reelsList = useMemo(
    () =>
      data
        .filter(isReel)
        .sort((a, b) => (a.sortOrder || Number(a.id) || 0) - (b.sortOrder || Number(b.id) || 0)),
    [data],
  );

  async function handleLogout() {
    await ApiClient.adminLogout();
    router.push("/admin");
  }

  async function updateReservationStatus(id: string, status: ReservationStatus) {
    setSavingId(id);
    setError("");

    try {
      const json = await ApiClient.updateReservationStatus(id, status);
      if (!json.success) throw new Error(json.error || "Unable to update reservation.");
      setData((items) => items.map((item) => item.id === id ? json.item : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update reservation.");
    } finally {
      setSavingId(null);
    }
  }

  async function updateMenuItem(id: string, input: Partial<MenuItem>) {
    setSavingId(id);
    setError("");

    try {
      const json = await ApiClient.updateMenuItem(id, {
        name: input.name,
        description: input.description,
        price: input.price,
        category: input.category,
        imageUrl: input.imageUrl,
        imagePublicId: input.imagePublicId,
        status: input.status,
        available: input.available,
      });
      if (!json.success) throw new Error(json.error || "Unable to update menu item.");
      setData((items) => items.map((item) => item.id === id ? json.item : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update menu item.");
    } finally {
      setSavingId(null);
    }
  }

  async function createMenuItem(input: Partial<MenuItem>) {
    setSavingId("new");
    setError("");

    try {
      const json = await ApiClient.createMenuItem({
        name: input.name,
        description: input.description,
        price: input.price,
        category: input.category,
        imageUrl: input.imageUrl,
        imagePublicId: input.imagePublicId,
        status: input.status ?? "Published",
        available: input.available ?? true,
      });
      if (!json.success) throw new Error(json.error || "Unable to create menu item.");
      setData((items) => [...items, json.item]);
      setExpandedId(json.item.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create menu item.");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteMenuItem(id: string) {
    const confirmed = window.confirm("Delete this menu item from Firebase? This removes it from the public menu too.");
    if (!confirmed) return;

    setSavingId(id);
    setError("");

    try {
      const json = await ApiClient.deleteMenuItem(id);
      if (!json.success) throw new Error(json.error || "Unable to delete menu item.");
      setData((items) => items.filter((item) => item.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete menu item.");
    } finally {
      setSavingId(null);
    }
  }

  // --------------------------------------------------------
  // REELS CMS HANDLERS
  // --------------------------------------------------------

  async function handleCreateReel(input: Partial<Reel>) {
    setSavingId("new_reel");
    setError("");

    try {
      const json = await ApiClient.createReel(input);
      if (!json.success) throw new Error(json.error || "Unable to create video reel.");
      setData((items) => [...items, json.item]);
      setExpandedId(json.item.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create video reel.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleUpdateReel(id: string, input: Partial<Reel>) {
    setSavingId(id);
    setError("");

    try {
      const json = await ApiClient.updateReel(id, input);
      if (!json.success) throw new Error(json.error || "Unable to update video reel.");
      setData((items) => items.map((item) => item.id === id ? json.item : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update video reel.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDeleteReel(id: string) {
    const confirmed = window.confirm("Delete this video reel from CMS and Cloudinary?");
    if (!confirmed) return;

    setSavingId(id);
    setError("");

    try {
      const json = await ApiClient.deleteReel(id);
      if (!json.success) throw new Error(json.error || "Unable to delete video reel.");
      setData((items) => items.filter((item) => item.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete video reel.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-background text-sand">
      {/* Background Soft Glow & Dark Aesthetics */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,oklch(0.70_0.11_40_/_0.12),transparent_34%),radial-gradient(circle_at_bottom_right,oklch(0.25_0.12_22_/_0.2),transparent_38%)] bg-[#0C0102]" />
      <div className="grain fixed inset-0 -z-10 opacity-60 pointer-events-none" />

      <header className="border-b border-border/80 bg-[#120204]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#DF9F7E]/25 bg-card/85 p-2 shadow-lg">
              <Image src={logo} alt="RIKO" className="h-full w-full object-contain" priority />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.45em] text-[#DF9F7E]">Operations</p>
              <h1 className="font-display text-3xl text-sand">RIKO Admin</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {(["reservations", "menu", "reels"] as View[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setView(tab);
                  setExpandedId(null);
                }}
                className={`px-5 py-3 text-[10px] uppercase tracking-[0.32em] transition-all cursor-pointer ${
                  view === tab
                    ? "bg-[#DF9F7E] text-[#120204] font-bold shadow-md"
                    : "border border-border/50 bg-[#1C0408]/40 text-sand/65 hover:border-[#DF9F7E]/50 hover:text-sand"
                }`}
              >
                {tab}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="px-5 py-3 text-[10px] uppercase tracking-[0.32em] text-sand/45 transition-colors hover:text-[#DF9F7E] cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-5 py-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Current view" value={view} />
          <Metric label="Records" value={stats.total} />
          <Metric
            label={view === "reservations" ? "Unread" : view === "menu" ? "Published" : "Video Reels"}
            value={view === "reservations" ? stats.unread : view === "menu" ? stats.published : reelsList.length}
          />
          <Metric label={view === "reservations" ? "Upcoming" : "Collection"} value={view === "reservations" ? stats.upcoming : view === "menu" ? "Menu" : "Social"} />
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#DF9F7E]">Service desk</p>
            <h2 className="mt-3 font-display text-5xl capitalize text-sand md:text-6xl">
              {view === "reservations" ? "Reservations" : view === "menu" ? "Menu CMS" : "Reels CMS"}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-sand/55">
            {view === "reservations"
              ? "Review new table requests, track guest details, and move each booking through the host workflow."
              : view === "menu"
              ? "Edit menu items by category. Saving writes to Firebase, and the public menu reads the same collection."
              : "Manage the 6 social media video reels displayed on the website. Videos and thumbnail images are stored on Cloudinary."}
          </p>
        </div>

        {view === "menu" && (
          <div className="mt-8 space-y-4">
            <div className="flex flex-col gap-3 border border-border bg-[#1C0408]/30 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#DF9F7E]">Category filter</p>
                <p className="mt-1 text-sm text-sand/45">
                  Showing {menuItems.length} of {data.filter(isMenuItem).length} menu items
                </p>
              </div>
              <select
                value={menuCategory}
                onChange={(event) => setMenuCategory(event.target.value as MenuCategoryFilter)}
                className="min-w-64 border border-border bg-background px-4 py-3 text-sm text-sand outline-none transition-colors focus:border-[#DF9F7E] cursor-pointer"
              >
                <option value="All">All categories</option>
                {menuCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <CreateMenuItemForm saving={savingId === "new"} onCreate={createMenuItem} />
          </div>
        )}

        {view === "reels" && (
          <div className="mt-8 space-y-4">
            <CreateReelForm saving={savingId === "new_reel"} onCreate={handleCreateReel} />
          </div>
        )}

        {error && (
          <div className="mt-6 border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-4">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-32 animate-pulse border border-border bg-[#1C0408]/30" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="border border-border bg-[#1C0408]/20 px-8 py-20 text-center">
              <p className="font-serif text-3xl italic text-[#DF9F7E]">Quiet service.</p>
              <p className="mt-3 text-sm text-sand/55">No records found for this view.</p>
            </div>
          ) : view === "reservations" ? (
            <div className="grid gap-4">
              {data.filter(isReservation).map((item) => (
                <ReservationCard
                  key={item.id}
                  item={item}
                  expanded={expandedId === item.id}
                  saving={savingId === item.id}
                  onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  onStatus={(status) => updateReservationStatus(item.id, status)}
                />
              ))}
            </div>
          ) : view === "menu" ? (
            <div className="space-y-8">
              {menuByCategory.map(([category, items]) => (
                <section key={category} className="border border-border bg-[#1C0408]/20">
                  <div className="flex flex-col gap-2 border-b border-border px-5 py-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-[#DF9F7E]">Menu category</p>
                      <h3 className="mt-2 font-display text-3xl text-sand">{category}</h3>
                    </div>
                    <p className="text-xs uppercase tracking-[0.25em] text-sand/40">
                      {items.length} item{items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="divide-y divide-border/70">
                    {items.map((item) => (
                       <MenuItemEditor
                         key={item.id}
                         item={item}
                         expanded={expandedId === item.id}
                         saving={savingId === item.id}
                         onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                         onSave={(input) => updateMenuItem(item.id, input)}
                         onDelete={() => deleteMenuItem(item.id)}
                       />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="border border-border bg-[#1C0408]/20 divide-y divide-border/70">
              {reelsList.map((item) => (
                <ReelEditor
                  key={item.id}
                  item={item}
                  expanded={expandedId === item.id}
                  saving={savingId === item.id}
                  onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  onSave={(input) => handleUpdateReel(item.id, input)}
                  onDelete={() => handleDeleteReel(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-border bg-[#1C0408]/30 p-5 backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.35em] text-sand/45">{label}</p>
      <p className="mt-4 font-display text-3xl capitalize text-sand">{value}</p>
    </div>
  );
}

function FileUploadField({
  label,
  accept,
  onUploaded,
}: {
  label: string;
  accept: string;
  onUploaded: (url: string, publicId: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "File upload failed.");
      }

      onUploaded(json.url, json.publicId);
    } catch (err: any) {
      setError(err.message || "File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="block mt-2">
      <span className="text-[10px] uppercase tracking-[0.32em] text-sand/40">{label}</span>
      <div className="mt-2 flex items-center gap-3">
        <label className="flex items-center justify-center cursor-pointer border border-[#DF9F7E]/40 hover:border-[#DF9F7E] bg-[#1C0408]/50 hover:bg-[#1C0408]/80 text-sand text-[10px] uppercase tracking-widest px-4 py-3 transition-colors">
          <span>{uploading ? "Uploading..." : "Choose File"}</span>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {uploading && <span className="text-xs text-[#DF9F7E] animate-pulse">Uploading to Cloudinary...</span>}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    </div>
  );
}

function MenuItemEditor({
  item,
  expanded,
  saving,
  onToggle,
  onSave,
  onDelete,
}: {
  item: MenuItem;
  expanded: boolean;
  saving: boolean;
  onToggle: () => void;
  onSave: (input: Partial<MenuItem>) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState({
    name: item.name,
    description: item.description,
    price: String(item.price),
    category: item.category,
    imageUrl: item.imageUrl,
    imagePublicId: item.imagePublicId || "",
    status: item.status,
    available: item.available,
  });

  useEffect(() => {
    setDraft({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      imageUrl: item.imageUrl,
      imagePublicId: item.imagePublicId || "",
      status: item.status,
      available: item.available,
    });
  }, [item]);

  return (
    <article className="px-5 py-4">
      <button onClick={onToggle} className="grid w-full gap-4 text-left md:grid-cols-[72px_1.5fr_0.8fr_0.5fr_0.7fr_auto] md:items-center cursor-pointer">
        <div className="h-16 w-16 overflow-hidden rounded-lg border border-border bg-background">
          <img
            src={item.imageUrl || "/menu-assets/bomba_de_choclo.png"}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium text-sand">{item.name}</p>
          <p className="mt-1 line-clamp-1 text-xs text-sand/45">{item.description}</p>
        </div>
        <span className="text-sm text-sand/60">{item.category}</span>
        <span className="font-medium text-[#DF9F7E]">₹{item.price}</span>
        <span className={`w-fit border px-3 py-1 text-[10px] uppercase tracking-[0.22em] ${statusTone(item.status)}`}>
          {item.status}
        </span>
        <span className="border border-border px-4 py-2 text-center text-[10px] uppercase tracking-[0.25em] text-sand/55 transition-all hover:border-[#DF9F7E]/60 hover:text-[#DF9F7E]">
          {expanded ? "Close" : "Edit"}
        </span>
      </button>

      {expanded && (
        <div className="mt-5 grid gap-4 border-t border-border pt-5 lg:grid-cols-2">
          <Field label="Dish name" value={draft.name} onChange={(value) => setDraft((state) => ({ ...state, name: value }))} />
          <Field label="Price" type="number" value={draft.price} onChange={(value) => setDraft((state) => ({ ...state, price: value }))} />
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.32em] text-sand/40">Category</span>
            <select
              value={draft.category}
              onChange={(event) => setDraft((state) => ({ ...state, category: event.target.value as MenuItem["category"] }))}
              className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-sand outline-none focus:border-[#DF9F7E] cursor-pointer"
            >
              {menuCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.32em] text-sand/40">Status</span>
            <select
              value={draft.status}
              onChange={(event) => setDraft((state) => ({ ...state, status: event.target.value as MenuStatus }))}
              className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-sand outline-none focus:border-[#DF9F7E] cursor-pointer"
            >
              {menuStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <Field
            label="Image URL or local path"
            value={draft.imageUrl}
            onChange={(value) => setDraft((state) => ({ ...state, imageUrl: value }))}
          />
          <Field
            label="Image public ID (optional)"
            value={draft.imagePublicId}
            onChange={(value) => setDraft((state) => ({ ...state, imagePublicId: value }))}
          />
          <FileUploadField
            label="Upload Image file directly to Cloudinary"
            accept="image/*"
            onUploaded={(url, publicId) => {
              setDraft((state) => ({ ...state, imageUrl: url, imagePublicId: publicId }));
            }}
          />
          <div className="overflow-hidden border border-border bg-background lg:col-span-2">
            <img
              src={draft.imageUrl || "/menu-assets/bomba_de_choclo.png"}
              alt={`${draft.name} preview`}
              className="h-56 w-full object-cover"
            />
          </div>
          <label className="block lg:col-span-2">
            <span className="text-[10px] uppercase tracking-[0.32em] text-sand/40">Description</span>
            <textarea
              rows={3}
              value={draft.description}
              onChange={(event) => setDraft((state) => ({ ...state, description: event.target.value }))}
              className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm leading-6 text-sand outline-none focus:border-[#DF9F7E]"
            />
          </label>
          <div className="flex flex-col gap-3 lg:col-span-2 md:flex-row md:items-center md:justify-between">
            <label className="flex items-center gap-3 text-sm text-sand/70">
              <input
                type="checkbox"
                checked={draft.available}
                onChange={(event) => setDraft((state) => ({ ...state, available: event.target.checked }))}
              />
              Available on public menu
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                disabled={saving}
                onClick={() => onSave({
                  name: draft.name,
                  description: draft.description,
                  price: Number(draft.price),
                  category: draft.category,
                  imageUrl: draft.imageUrl.trim(),
                  imagePublicId: draft.imagePublicId.trim() || undefined,
                  status: draft.status,
                  available: draft.available,
                })}
                className="bg-[#DF9F7E] px-6 py-3 text-[10px] uppercase tracking-[0.32em] text-[#120204] font-semibold transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Saving..." : "Save to Firebase"}
              </button>
              <button
                disabled={saving}
                onClick={onDelete}
                className="border border-red-400/30 px-6 py-3 text-[10px] uppercase tracking-[0.32em] text-red-200 transition-all hover:border-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Delete dish
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function CreateMenuItemForm({
  saving,
  onCreate,
}: {
  saving: boolean;
  onCreate: (input: Partial<MenuItem>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    description: "",
    price: "",
    category: "For One" as MenuItem["category"],
    imageUrl: "/menu-assets/bomba_de_choclo.png",
    imagePublicId: "",
    status: "Published" as MenuStatus,
    available: true,
  });

  function submit() {
    onCreate({
      name: draft.name.trim(),
      description: draft.description.trim(),
      price: Number(draft.price),
      category: draft.category,
      imageUrl: draft.imageUrl.trim(),
      imagePublicId: draft.imagePublicId.trim() || undefined,
      status: draft.status,
      available: draft.available,
    });
    setDraft({ name: "", description: "", price: "", category: "For One", imageUrl: "/menu-assets/bomba_de_choclo.png", imagePublicId: "", status: "Published", available: true });
    setOpen(false);
  }

  return (
    <div className="border border-border bg-card/35 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#DF9F7E]">Add dish</p>
          <p className="mt-1 text-sm text-sand/45">Create a new menu item directly in Firebase.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="border border-[#DF9F7E]/35 px-5 py-3 text-[10px] uppercase tracking-[0.32em] text-sand/70 transition-all hover:border-[#DF9F7E] hover:text-[#DF9F7E] cursor-pointer"
        >
          {open ? "Close form" : "Add new dish"}
        </button>
      </div>

      {open && (
        <div className="mt-5 grid gap-4 border-t border-border pt-5 lg:grid-cols-2">
          <Field label="Dish name" value={draft.name} onChange={(value) => setDraft((state) => ({ ...state, name: value }))} />
          <Field label="Price" type="number" value={draft.price} onChange={(value) => setDraft((state) => ({ ...state, price: value }))} />
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.32em] text-sand/40">Category</span>
            <select
              value={draft.category}
              onChange={(event) => setDraft((state) => ({ ...state, category: event.target.value as MenuItem["category"] }))}
              className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-sand outline-none focus:border-[#DF9F7E] cursor-pointer"
            >
              {menuCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.32em] text-sand/40">Status</span>
            <select
              value={draft.status}
              onChange={(event) => setDraft((state) => ({ ...state, status: event.target.value as MenuStatus }))}
              className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-sand outline-none focus:border-[#DF9F7E] cursor-pointer"
            >
              {menuStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <Field label="Image URL or local path" value={draft.imageUrl} onChange={(value) => setDraft((state) => ({ ...state, imageUrl: value }))} />
          <Field label="Image public ID (optional)" value={draft.imagePublicId} onChange={(value) => setDraft((state) => ({ ...state, imagePublicId: value }))} />
          <FileUploadField
            label="Upload Image file directly to Cloudinary"
            accept="image/*"
            onUploaded={(url, publicId) => {
              setDraft((state) => ({ ...state, imageUrl: url, imagePublicId: publicId }));
            }}
          />
          <label className="block lg:col-span-2">
            <span className="text-[10px] uppercase tracking-[0.32em] text-sand/40">Description</span>
            <textarea
              rows={3}
              value={draft.description}
              onChange={(event) => setDraft((state) => ({ ...state, description: event.target.value }))}
              className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm leading-6 text-sand outline-none focus:border-[#DF9F7E]"
            />
          </label>
          <div className="flex flex-col gap-3 lg:col-span-2 md:flex-row md:items-center md:justify-between">
            <label className="flex items-center gap-3 text-sm text-sand/70">
              <input
                type="checkbox"
                checked={draft.available}
                onChange={(event) => setDraft((state) => ({ ...state, available: event.target.checked }))}
              />
              Available on public menu
            </label>
            <button
              type="button"
              disabled={saving || !draft.name.trim() || !draft.description.trim() || !draft.price || !draft.imageUrl.trim()}
              onClick={submit}
              className="bg-[#DF9F7E] px-6 py-3 text-[10px] uppercase tracking-[0.32em] text-[#120204] font-semibold transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Creating..." : "Create in Firebase"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReelEditor({
  item,
  expanded,
  saving,
  onToggle,
  onSave,
  onDelete,
}: {
  item: Reel;
  expanded: boolean;
  saving: boolean;
  onToggle: () => void;
  onSave: (input: Partial<Reel>) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState({
    title: item.title,
    tag: item.tag,
    videoUrl: item.videoUrl,
    imageUrl: item.imageUrl,
    videoPublicId: item.videoPublicId || "",
    imagePublicId: item.imagePublicId || "",
    sortOrder: String(item.sortOrder || ""),
  });

  useEffect(() => {
    setDraft({
      title: item.title,
      tag: item.tag,
      videoUrl: item.videoUrl,
      imageUrl: item.imageUrl,
      videoPublicId: item.videoPublicId || "",
      imagePublicId: item.imagePublicId || "",
      sortOrder: String(item.sortOrder || ""),
    });
  }, [item]);

  return (
    <article className="px-5 py-4">
      <button onClick={onToggle} className="grid w-full gap-4 text-left md:grid-cols-[72px_1.5fr_1fr_1fr_auto] md:items-center cursor-pointer">
        <div className="h-16 w-16 overflow-hidden rounded-lg border border-border bg-background">
          <img
            src={item.imageUrl || "/menu-assets/bomba_de_choclo.png"}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium text-sand">{item.title}</p>
          <p className="mt-1 text-xs text-[#DF9F7E] font-medium">{item.tag}</p>
        </div>
        <span className="text-xs text-sand/65 truncate">{item.videoUrl}</span>
        <span className="text-xs text-sand/40">Order: {item.sortOrder || "Auto"}</span>
        <span className="border border-border px-4 py-2 text-center text-[10px] uppercase tracking-[0.25em] text-sand/55 transition-all hover:border-[#DF9F7E]/60 hover:text-[#DF9F7E]">
          {expanded ? "Close" : "Edit"}
        </span>
      </button>

      {expanded && (
        <div className="mt-5 grid gap-4 border-t border-border pt-5 lg:grid-cols-2">
          <Field label="Reel Title" value={draft.title} onChange={(value) => setDraft((state) => ({ ...state, title: value }))} />
          <Field label="Tag (e.g. #RikoMaroon)" value={draft.tag} onChange={(value) => setDraft((state) => ({ ...state, tag: value }))} />
          <Field label="Video URL" value={draft.videoUrl} onChange={(value) => setDraft((state) => ({ ...state, videoUrl: value }))} />
          <Field label="Sort Order (optional)" type="number" value={draft.sortOrder} onChange={(value) => setDraft((state) => ({ ...state, sortOrder: value }))} />
          <Field label="Thumbnail Image URL" value={draft.imageUrl} onChange={(value) => setDraft((state) => ({ ...state, imageUrl: value }))} />
          <Field label="Video Public ID (optional)" value={draft.videoPublicId} onChange={(value) => setDraft((state) => ({ ...state, videoPublicId: value }))} />
          <FileUploadField
            label="Upload MP4 Video to Cloudinary"
            accept="video/*"
            onUploaded={(url, publicId) => {
              setDraft((state) => ({ ...state, videoUrl: url, videoPublicId: publicId }));
            }}
          />
          <FileUploadField
            label="Upload Thumbnail Image to Cloudinary"
            accept="image/*"
            onUploaded={(url, publicId) => {
              setDraft((state) => ({ ...state, imageUrl: url, imagePublicId: publicId }));
            }}
          />
          <div className="flex flex-col gap-3 lg:col-span-2 md:flex-row md:items-center md:justify-end">
            <div className="flex flex-wrap gap-3">
              <button
                disabled={saving}
                onClick={() => onSave({
                  title: draft.title,
                  tag: draft.tag,
                  videoUrl: draft.videoUrl.trim(),
                  imageUrl: draft.imageUrl.trim(),
                  videoPublicId: draft.videoPublicId.trim() || undefined,
                  imagePublicId: draft.imagePublicId.trim() || undefined,
                  sortOrder: draft.sortOrder ? Number(draft.sortOrder) : undefined,
                })}
                className="bg-[#DF9F7E] px-6 py-3 text-[10px] uppercase tracking-[0.32em] text-[#120204] font-semibold transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Saving..." : "Save to Firebase"}
              </button>
              <button
                disabled={saving}
                onClick={onDelete}
                className="border border-red-400/30 px-6 py-3 text-[10px] uppercase tracking-[0.32em] text-red-200 transition-all hover:border-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Delete reel
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function CreateReelForm({
  saving,
  onCreate,
}: {
  saving: boolean;
  onCreate: (input: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    tag: "",
    videoUrl: "",
    imageUrl: "",
    videoPublicId: "",
    imagePublicId: "",
    sortOrder: "",
  });

  function submit() {
    onCreate({
      title: draft.title.trim(),
      tag: draft.tag.trim(),
      videoUrl: draft.videoUrl.trim(),
      imageUrl: draft.imageUrl.trim(),
      videoPublicId: draft.videoPublicId.trim() || undefined,
      imagePublicId: draft.imagePublicId.trim() || undefined,
      sortOrder: draft.sortOrder ? Number(draft.sortOrder) : undefined,
    });
    setDraft({ title: "", tag: "", videoUrl: "", imageUrl: "", videoPublicId: "", imagePublicId: "", sortOrder: "" });
    setOpen(false);
  }

  return (
    <div className="border border-border bg-card/35 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#DF9F7E]">Add Video Reel</p>
          <p className="mt-1 text-sm text-sand/45">Create a new social media video reel in CMS.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="border border-[#DF9F7E]/35 px-5 py-3 text-[10px] uppercase tracking-[0.32em] text-sand/70 transition-all hover:border-[#DF9F7E] hover:text-[#DF9F7E] cursor-pointer"
        >
          {open ? "Close form" : "Add new video"}
        </button>
      </div>

      {open && (
        <div className="mt-5 grid gap-4 border-t border-border pt-5 lg:grid-cols-2">
          <Field label="Reel Title" value={draft.title} onChange={(value) => setDraft((state) => ({ ...state, title: value }))} />
          <Field label="Tag (e.g. #RikoMaroon)" value={draft.tag} onChange={(value) => setDraft((state) => ({ ...state, tag: value }))} />
          <Field label="Video URL" value={draft.videoUrl} onChange={(value) => setDraft((state) => ({ ...state, videoUrl: value }))} />
          <Field label="Sort Order (optional)" type="number" value={draft.sortOrder} onChange={(value) => setDraft((state) => ({ ...state, sortOrder: value }))} />
          <Field label="Thumbnail Image URL" value={draft.imageUrl} onChange={(value) => setDraft((state) => ({ ...state, imageUrl: value }))} />
          <Field label="Video Public ID (optional)" value={draft.videoPublicId} onChange={(value) => setDraft((state) => ({ ...state, videoPublicId: value }))} />
          <FileUploadField
            label="Upload MP4 Video to Cloudinary"
            accept="video/*"
            onUploaded={(url, publicId) => {
              setDraft((state) => ({ ...state, videoUrl: url, videoPublicId: publicId }));
            }}
          />
          <FileUploadField
            label="Upload Thumbnail Image to Cloudinary"
            accept="image/*"
            onUploaded={(url, publicId) => {
              setDraft((state) => ({ ...state, imageUrl: url, imagePublicId: publicId }));
            }}
          />
          <div className="flex flex-col gap-3 lg:col-span-2 md:flex-row md:items-center md:justify-end">
            <button
              type="button"
              disabled={saving || !draft.title.trim() || !draft.tag.trim() || !draft.videoUrl.trim() || !draft.imageUrl.trim()}
              onClick={submit}
              className="bg-[#DF9F7E] px-6 py-3 text-[10px] uppercase tracking-[0.32em] text-[#120204] font-semibold transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Creating..." : "Create in Firebase"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReservationCard({
  item,
  expanded,
  saving,
  onToggle,
  onStatus,
}: {
  item: Reservation;
  expanded: boolean;
  saving: boolean;
  onToggle: () => void;
  onStatus: (status: ReservationStatus) => void;
}) {
  return (
    <article className="border border-border bg-[#1C0408]/30 backdrop-blur-md transition-colors hover:border-[#DF9F7E]/35">
      <button onClick={onToggle} className="w-full px-5 py-5 text-left cursor-pointer">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr_1fr_0.8fr_auto] lg:items-center">
          <div className="flex items-start gap-3">
            {!item.isRead && <span className="mt-2 h-2 w-2 rounded-full bg-[#DF9F7E]" />}
            <div>
              <p className="font-display text-3xl text-sand">{item.name}</p>
              <p className="mt-1 text-sm text-sand/50">{item.email || "No email saved"}</p>
            </div>
          </div>
          <Detail label="Phone" value={item.phone} />
          <Detail label="Date & time" value={`${item.date} · ${item.time}`} />
          <Detail label="Guests" value={`${item.guests} ${item.guests === 1 ? "guest" : "guests"}`} />
          <div className="flex items-center gap-3">
            <span className={`border px-3 py-1 text-[10px] uppercase tracking-[0.22em] ${statusTone(item.status)}`}>
              {item.status}
            </span>
            <span className="text-sand/40">{expanded ? "↑" : "↓"}</span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-5 py-5">
          <div className="grid gap-6 lg:grid-cols-3">
            <Detail label="Special requests" value={item.specialRequest || "None"} />
            <Detail label="Submitted" value={formatDateTime(item.createdAt)} />
            <Detail label="Last updated" value={formatDateTime(item.updatedAt)} />
          </div>
          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 md:flex-row md:items-center md:justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-sand/35">Reservation ID {item.id}</p>
            <div className="flex flex-wrap gap-2">
              {reservationStatuses.map((status) => (
                <button
                  key={status}
                  disabled={saving || item.status === status}
                  onClick={() => onStatus(status)}
                  className={`border px-3 py-2 text-[10px] uppercase tracking-[0.22em] transition-all disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer ${
                    item.status === status
                      ? "border-[#DF9F7E] bg-[#DF9F7E] text-[#120204] font-bold"
                      : "border-border text-sand/55 hover:border-[#DF9F7E]/60 hover:text-sand"
                  }`}
                >
                  {saving && item.status !== status ? "Saving" : status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.32em] text-sand/40">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-sand outline-none focus:border-[#DF9F7E]"
      />
    </label>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.32em] text-sand/40">{label}</p>
      <p className="mt-2 text-sm leading-6 text-sand/75">{value}</p>
    </div>
  );
}
