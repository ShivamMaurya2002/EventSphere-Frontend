import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "/src/assets/css/EditEvent.css";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [attendees, setAttendees] = useState("");
  const [seatsLeft, setSeatsLeft] = useState("");
  const [revenue, setRevenue] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    const eventToEdit = storedEvents.find((e) => e.id === Number(id));

    if (eventToEdit) {
      setTitle(eventToEdit.title || "");
      setDate(eventToEdit.date || "");
      setLocation(eventToEdit.location || "");
      setCapacity(eventToEdit.capacity || "");
      setAttendees(eventToEdit.attendees ?? 0);
      setSeatsLeft(eventToEdit.seatsLeft ?? eventToEdit.capacity ?? 0);
      setRevenue(eventToEdit.revenue ?? 0);
      setDescription(eventToEdit.description || "");
    } else {
      navigate("/events");
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: seatsLeft cannot exceed total capacity or go negative
    if (Number(seatsLeft) > Number(capacity)) {
      alert(" Seats left cannot exceed total capacity.");
      return;
    }
    if (Number(seatsLeft) < 0) {
      alert(" Seats left cannot be negative.");
      return;
    }

    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];

    const updatedEvents = storedEvents.map((e) => {
      if (e.id === Number(id)) {
        return {
          ...e,
          title,
          date,
          location,
          capacity: Number(capacity),
          attendees: Number(attendees), // stays same (read-only)
          seatsLeft: Number(seatsLeft),
          revenue: Number(revenue),
          description,
        };
      }
      return e;
    });

    localStorage.setItem("events", JSON.stringify(updatedEvents));

    alert(" Event updated successfully!");
    navigate(`/events/${id}`);
  };

  return (
    <div className="edit-event-container">
      <h2>Edit Event</h2>
      <form className="edit-event-form" onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          placeholder="Enter event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Location:</label>
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <label>Total Capacity:</label>
        <input
          type="number"
          placeholder="Total seats available"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />

        <label>Seats Left:</label>
        <input
          type="number"
          placeholder="Remaining seats"
          value={seatsLeft}
          onChange={(e) => setSeatsLeft(e.target.value)}
          required
        />

        <label>Attendees (Auto):</label>
        <input
          type="number"
          value={attendees}
          readOnly
          style={{ backgroundColor: "#f3f3f3", cursor: "not-allowed" }}
        />

        <label>Revenue (₹):</label>
        <input
          type="number"
          placeholder="Total revenue"
          value={revenue}
          onChange={(e) => setRevenue(e.target.value)}
          required
        />

        <label>Description:</label>
        <textarea
          placeholder="Event description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          required
        />

        <button type="submit">Update Event</button>
      </form>
    </div>
  );
}
