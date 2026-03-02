import React, { useEffect, useState } from "react";
import { useAdminServices } from "@/hooks/useAdminServices";
import type { ServiceInput } from "@/types/admin.types";

function AdminPage() {
  const {
    services,
    bookings,
    loading,
    error,
    addService,
    removeService,
    fetchServiceBookings,
    fetchAdminServices,
  } = useAdminServices();
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<ServiceInput>({
    title: "gvdsfgdf",
    category: "Venue",
    pricePerDay: 300,
    location: "dfdf dgfgdfg",
  });

  useEffect(() => {
    fetchAdminServices(page, 5);
  }, [page]);

  const handleCreate = async () => {
    try {
      await addService(form);
      alert("Service created");
    } catch {
      // error already handled in hook
    }
  };
  // const handleCreate = async () => {
  //   try {
  //     await addService(form);
  //     await fetchAdminServices(page, 5);
  //     alert("Service created");
  //   } catch {}
  // };
  const handleFetchBookings = async () => {
    // replace with real serviceId
    await fetchServiceBookings("SERVICE_ID_HERE");
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Control Panel</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Create Service</h2>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, title: e.target.value }))
        }
      />

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, category: e.target.value }))
        }
      />

      <input
        type="number"
        placeholder="Price Per Day"
        value={form.pricePerDay}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            pricePerDay: Number(e.target.value),
          }))
        }
      />

      <input
        placeholder="Location"
        value={form.location}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, location: e.target.value }))
        }
      />

      <button onClick={handleCreate}>Create Service</button>

      <hr />
      <hr />

      <h2>My Services</h2>

      <ul>
        {services.map((s) => (
          <li key={s.id} style={{ marginBottom: 10 }}>
            <strong>{s.title}</strong> | ₹{s.pricePerDay} | {s.location}
            <button
              style={{ marginLeft: 10 }}
              onClick={() => fetchServiceBookings(s.id)}
            >
              View Bookings
            </button>
            <button
              style={{ marginLeft: 10, color: "red" }}
              onClick={async () => {
                await removeService(s.id);
                await fetchAdminServices(page, 5);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 10 }}>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>Page {page}</span>

        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
      <h2>Service Bookings</h2>

      <button onClick={handleFetchBookings}>Fetch Bookings (Demo)</button>

      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            {b.userId} | {b.startDate} → {b.endDate} | ₹{b.totalPrice} |{" "}
            {b.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;
