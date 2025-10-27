import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import "/src/assets/css/RegisterForEvent.css";

export default function RegisterForEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  // Gmail-only validation pattern
  const gmailPattern = /^[a-zA-Z0-9._%+-]+@(gmail)\.(com|in|org)$/i;

  // Load event from localStorage
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    const found = storedEvents.find((e) => e.id === Number(id));
    setEvent(found);
  }, [id]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (!event) return alert("Event not found!");
    const ticketsRequested = Number(data.tickets);

    // --- Validate email before proceeding ---
    if (!gmailPattern.test(data.email)) {
      return alert(
        " Invalid Email! Please use a valid Gmail address (only @gmail.com, @gmail.in, or @gmail.org)."
      );
    }

    // --- Validate available seats ---
    if (ticketsRequested > (event.seatsLeft ?? event.capacity)) {
      return alert(" Not enough seats available!");
    }

    // --- Update event ---
    const updatedEvent = {
      ...event,
      attendees: (event.attendees ?? 0) + ticketsRequested,
      seatsLeft: (event.seatsLeft ?? event.capacity) - ticketsRequested,
      revenue: (event.revenue ?? 0) + ticketsRequested * 100,
    };

    // --- Update localStorage ---
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    const updatedEvents = storedEvents.map((e) =>
      e.id === updatedEvent.id ? updatedEvent : e
    );
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    alert(`Successfully registered ${ticketsRequested} ticket(s)!`);
    navigate(`/events/${id}`);
  };

  if (!event)
    return (
      <div className="container" style={{ textAlign: "center" }}>
        <h2>Event Not Found</h2>
        <Link to="/events" className="btn btn-primary">
          Back to Events
        </Link>
      </div>
    );

  return (
    <div className="container register-page">
      <h2>Register for {event.title}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        {/* Name Field */}
        <label>Name:</label>
        <input
          type="text"
          {...register("name", {
            required: "Name is required",
            minLength: { value: 3, message: "Name must be at least 3 characters" },
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Name should contain only letters",
            },
          })}
          placeholder="Your full name"
        />
        {errors.name && <p className="error">{errors.name.message}</p>}

        {/* Gmail-only Email Field */}
        <label>Email:</label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: gmailPattern,
              message:
                "Invalid Gmail! Please enter correct email.",
            },
          })}
          placeholder="example@gmail.com"
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        {/* Ticket Count */}
        <label>Tickets:</label>
        <input
          type="number"
          {...register("tickets", {
            required: "Number of tickets is required",
            min: { value: 1, message: "At least 1 ticket required" },
            max: {
              value: event.seatsLeft ?? event.capacity,
              message: `Only ${event.seatsLeft ?? event.capacity} seats available`,
            },
          })}
          defaultValue={1}
        />
        {errors.tickets && <p className="error">{errors.tickets.message}</p>}

        <p className="login-tip">
          Tip: Use an email containing <b>"@gmail.com, @gmail.in, @gmail.org"</b> to register for Event.
        </p>
        <div className="hero-cta">
          {/* Submit + Back Buttons */}
          <button type="submit" className="btn btn-primary">
            Confirm Registration
          </button>

          <Link to={`/events/${id}`} className="btn btn-primary">
            Back to Details
          </Link>
        </div>
      </form>
    </div>
  );
}
