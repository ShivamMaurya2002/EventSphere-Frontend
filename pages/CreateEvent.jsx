import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/assets/css/CreateEvent.css";

export default function CreateEvent() {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !date || !location || !category || !capacity) {
      alert("Please fill all required fields.");
      return;
    }

    const existingEvents = JSON.parse(localStorage.getItem("events")) || [];

    const newEvent = {
      id: Date.now(), // unique ID
      title,
      date,
      location,
      category,
      capacity: Number(capacity),
      seatsLeft: Number(capacity), // initially all seats available
      attendees: 0,
      revenue: 0,
      description,
    };

    const updatedEvents = [...existingEvents, newEvent];
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    alert(` Event Created Successfully!\n${title} on ${date}`);
    navigate("/events");
  };

  return (
    <div className="create-event-container">
      <h2>Create New Event</h2>

      <form onSubmit={handleSubmit} className="create-event-form">
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
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
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter event location"
          required
        />

        <label>Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Event category (e.g., Music, Tech)"
          required
        />

        <label>Capacity:</label>
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="Total seats available"
          required
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a short event description..."
          rows="3"
        ></textarea>

        <button type="submit" className="create-btn">
          Create Event
        </button>
      </form>
    </div>
  );
}
