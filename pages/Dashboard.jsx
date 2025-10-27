import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "/src/assets/css/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  // Default fallback event
  const defaultEvents = [
    {
      id: 1,
      title: "Music Fest 2025",
      date: "2025-10-20",
      location: "Bangalore",
      category: "Music",
      capacity: 200,
      attendees: 150,
      seatsLeft: 50,
      revenue: 15000,
      description: "An electrifying music event featuring top artists!",
    },
  ];

  const [myEvents, setMyEvents] = useState([]);

  // ✅ Load data dynamically whenever localStorage changes
  useEffect(() => {
    const loadEvents = () => {
      const stored = JSON.parse(localStorage.getItem("events")) || [];
      if (stored.length === 0) {
        localStorage.setItem("events", JSON.stringify(defaultEvents));
        setMyEvents(defaultEvents);
      } else {
        setMyEvents(stored);
      }
    };

    loadEvents();

    // 🔄 Listen for changes (works if event created in same tab or another tab)
    window.addEventListener("storage", loadEvents);

    // ✅ Clean-up listener on unmount
    return () => window.removeEventListener("storage", loadEvents);
  }, []);

  // ✅ Delete event
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = myEvents.filter((event) => event.id !== id);
      setMyEvents(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));
    }
  };

  // ✅ Navigate actions
  const handleCreateEvent = () => navigate("/CreateEvent");
  const handleEdit = (id) => navigate(`/dashboard/edit/${id}`);

  // === Derived Stats ===
  const totalRevenue = myEvents.reduce(
    (sum, e) => sum + Number(e.revenue || 0),
    0
  );
  const totalAttendees = myEvents.reduce(
    (sum, e) => sum + Number(e.attendees || 0),
    0
  );

  // === Chart Data ===
  const registrationsData = myEvents.map((e) => ({
    name: e.title,
    registrations: e.attendees,
  }));

  const revenueData = myEvents.map((e) => ({
    name: e.category,
    value: e.revenue,
  }));

  const attendanceTrendData = myEvents.map((e) => ({
    name: e.title,
    attendees: e.attendees,
    capacity: e.capacity,
  }));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00C49F"];

  // === Determine Event Status ===
  const getStatus = (event) => {
    const fillPercent = (event.attendees / event.capacity) * 100;
    if (fillPercent >= 100) return "full";
    if (fillPercent >= 80) return "almost-full";
    return "open";
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h2>Organizer Dashboard</h2>
        <p>Manage your events, track performance, and view analytics.</p>
      </header>

      {/* Stats Cards */}
      <div className="stats-boxes">
        <div className="stat-card">
          <h3>Total Events</h3>
          <p className="stat-value">{myEvents.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Attendees</h3>
          <p className="stat-value">{totalAttendees}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue (₹)</h3>
          <p className="stat-value">{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Event Table */}
      <div className="event-section">
        <div className="event-header">
          <h3>My Events</h3>
          <button onClick={handleCreateEvent} className="create-btn">
            + Create Event
          </button>
        </div>

        <table className="event-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Attendees</th>
              <th>Status</th>
              <th>Revenue (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myEvents.length > 0 ? (
              myEvents.map((event) => {
                const status = getStatus(event);
                return (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>{event.location}</td>
                    <td>{event.attendees}</td>
                    <td>
                      <span className={`status ${status}`}>
                        {status === "full"
                          ? "Full"
                          : status === "almost-full"
                          ? "Almost Full"
                          : "Open"}
                      </span>
                    </td>
                    <td>{Number(event.revenue || 0).toLocaleString()}</td>
                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(event.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No events found...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        <h3>📊 Event Analytics</h3>

        <div className="charts-grid">
          {/* Bar Chart - Registrations per Event */}
          <div className="chart-card">
            <h4>Registrations per Event</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={registrationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="registrations" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Revenue by Category */}
          <div className="chart-card">
            <h4>Revenue by Category</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={revenueData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {revenueData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart - Attendance Trends */}
          <div className="chart-card">
            <h4>Attendance Trends</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendees" stroke="#82ca9d" />
                <Line type="monotone" dataKey="capacity" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
