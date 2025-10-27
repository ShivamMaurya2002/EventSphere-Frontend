import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "/src/assets/css/EventListing.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Default events
  const defaultEvents = [];

  useEffect(() => {
    // Load events from localStorage
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];

    // Merge default events with stored events
    const allEvents = [...defaultEvents, ...storedEvents];
    setEvents(allEvents);
    setFilteredEvents(allEvents);

    // Load logged-in user
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  // Safely check .org email
  const canCreateEvent =
    currentUser &&
    typeof currentUser.email === "string" &&
    currentUser.email.toLowerCase().endsWith(".org");

  // Filter events whenever search/filter changes
  useEffect(() => {
    let temp = [...events];

    // Filter by search text (title)
    if (searchText.trim() !== "") {
      temp = temp.filter((ev) =>
        ev.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter) {
      temp = temp.filter((ev) => ev.category === categoryFilter);
    }

    // Filter by location
    if (locationFilter.trim() !== "") {
      temp = temp.filter((ev) =>
        ev.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filter by date
    if (dateFilter) {
      temp = temp.filter((ev) => ev.date === dateFilter);
    }

    setFilteredEvents(temp);
  }, [searchText, categoryFilter, locationFilter, dateFilter, events]);

  // Loading state
  if (currentUser === undefined) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;
  }

  return (
    <div className="events-page container">
      <h2 className="Heading-2">Upcoming Events</h2>

      {/* Filters Section */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Tech">Tech</option>
          <option value="Food">Food</option>
          <option value="Podcast">Podcast</option>
          <option value="Conference">Press Conference</option>
        </select>

        <input
          type="text"
          placeholder="Search by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>No events found.</h2>
        </div>
      ) : (
        <div className="card-grid">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="card event-card">
              <div className="card-body">
                <h3>{ev.title}</h3>
                <p>📅 <b>Date:</b> {ev.date}</p>
                <p>📍 <b>Location:</b> {ev.location}</p>
                <p>🏷️ <b>Category:</b> {ev.category}</p>
                <p className="p">📝 <b>Description:</b> {ev.description}</p>

                <Link to={`/events/${ev.id}`} className="btn btn-primary">
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visible only for .org users */}
      {canCreateEvent && (
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <Link to="/CreateEvent" className="btn btn-primary">
            Create New Event
          </Link>
        </div>
      )}
    </div>
  );
}
