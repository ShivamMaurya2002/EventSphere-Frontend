import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '/src/assets/css/EventDetail.css';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  // Default sample events (isDefault: true added)
const defaultEvents = [
  {
    id: 1,
    title: "Music Fest 2025",
    date: "2025-10-20",
    location: "Mumbai",
    category: "Music",
    capacity: 200,
    attendees: 150,
    revenue: 400,
    description: "Groove with top artists and DJs at Mumbai's biggest music night.",
    isDefault: true // Added flag to identify non-registrable default event
  },
  {
    id: 2,
    title: "FutureStack Tech Summit", // Tech Conference Added
    date: "2025-11-05",
    location: "Bengaluru",
    category: "Technology",
    capacity: 500,
    attendees: 380,
    revenue: 1200,
    description: "India's premier conference on AI, ML, and Cloud infrastructure with global speakers.",
    isDefault: true // Added flag
  },
  {
    id: 3,
    title: "The Great Indian Food Carnival", // Food Carnival Added
    date: "2025-12-15",
    location: "Delhi",
    category: "Food",
    capacity: 1000,
    attendees: 920,
    revenue: 850,
    description: "A culinary journey featuring authentic Indian street food and gourmet dishes from various states.",
    isDefault: true // Added flag
  }
];

  useEffect(() => {
    // Fetch events from localStorage
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

    // Merge default and stored events
    const mergedEvents = [...defaultEvents];
    storedEvents.forEach(stored => {
      const index = mergedEvents.findIndex(e => e.id === stored.id);
      if (index > -1) {
        // If a stored event overwrites a default one, it's no longer 'isDefault'
        mergedEvents[index] = { ...stored, isDefault: false }; 
      } else {
        mergedEvents.push(stored);
      }
    });

    // Find event by ID
    const foundEvent = mergedEvents.find(e => e.id === Number(id));
    if (foundEvent) {
      // Calculate seatsLeft if missing
      const seatsLeft =
        foundEvent.seatsLeft !== undefined
          ? foundEvent.seatsLeft
          : foundEvent.capacity - (foundEvent.attendees || 0);

      setEvent({ ...foundEvent, seatsLeft });
    } else {
      setEvent(null);
    }
  }, [id]);

  if (!event) {
    return (
      <div className="event-card not-found">
        <h2 className="event-title">Event Not Found</h2>
        <Link to="/events" className="btn btn-primary">Back to Events</Link>
      </div>
    );
  }

  // Determine if the Register/Sold Out button should be shown
  const showRegisterButton = !event.isDefault;

  return (
    <div className="Event-Detail">
      <div className="event-card event-detail-card">
        <h1>{event.title}</h1>
        <p><b>📅 Date:</b> {event.date}</p>
        <p><b>📍 Location:</b> {event.location}</p>
        <p><b>🏷️ Category:</b> {event.category}</p>
        <p><b>💺 Total Seats:</b> {event.capacity}</p>
        <p><b>👥 Registered:</b> {event.attendees || 0}</p>
        <p><b>🪑 Seats Left:</b> {event.seatsLeft}</p>
        <p><b>💰 Revenue:</b> ₹{event.revenue || 0}</p>
        <p className="p"><b>📝 Description:</b> {event.description}</p>

        {/* Conditional rendering for Register/Sold Out button */}
        {showRegisterButton && (
          (event.seatsLeft > 0) ? (
            <Link to={`/register/${event.id}`} className="register">
              Register Now
            </Link>
          ) : (
            <button disabled className="btn btn-primary">
              Sold Out
            </button>
          )
        )}
 
        <Link to="/events" className="back">
          Back to Events
        </Link>
      </div>
    </div>
  );
}