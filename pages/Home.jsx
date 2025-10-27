import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "/src/assets/css/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // Load current logged-in user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  // Check if the logged-in user has .org email
  const canCreateEvent =
    currentUser &&
    typeof currentUser.email === "string" &&
    currentUser.email.toLowerCase().endsWith(".org");

  const events = [
    {
      id: 1,
      title: "Music Fest 2025",
      date: "Oct 20, 2025",
      location: "Mumbai",
      image: "/MusicFest.avif",
      attendees: 150,
      revenue: 400,
      description: "Groove with top artists and DJs at Mumbai's biggest music night.",
    },
    {
      id: 2,
      title: "Tech Conference",
      date: "Nov 5, 2025",
      location: "Bangalore",
      image: "/TechConference.jpg",
      attendees: 50,
      revenue: 3000,
      description: "Explore the latest trends in AI and innovation with industry leaders.",
    },
    {
      id: 3,
      title: "Food Carnival",
      date: "Nov 12, 2025",
      location: "Delhi",
      image: "/FoodCarnival.jpg",
      attendees: 150,
      revenue: 45000,
      description: "Taste global cuisines and enjoy live cooking shows and food stalls.",
    },
  ];

  const features = [
    { title: "Easy Event Creation", desc: "Create event pages, manage tickets, and schedules in just a few clicks.", icon: "🎫" },
    { title: "Powerful Analytics", desc: "Track attendance, revenue, and engagement with built-in reports.", icon: "📊" },
    { title: "Attendee Experience", desc: "Send reminders, provide maps, and enable one-click check-ins for attendees.", icon: "⚡" },
    { title: "Seamless Ticketing", desc: "Sell and manage tickets effortlessly with secure payment options.", icon: "🎟️" },
    { title: "Custom Branding", desc: "Fully brand your event pages with logos, colors, and custom layouts.", icon: "🎨" },
    { title: "Real-Time Updates", desc: "Keep attendees informed with instant notifications and live updates.", icon: "📢" }
  ];

  const testimonials = [
    { name: "Riya Sharma", text: "EventSphere made managing our conference effortless — everything worked perfectly.", role: "Event Organizer" },
    { name: "Amit Patel", text: "I found amazing local events thanks to EventSphere — brilliant UX!", role: "Attendee" },
    { name: "Neha Gupta", text: "Ticketing and check-in were smooth; highly recommend for small and mid-size events.", role: "Organizer" },
  ];

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner container">
          <div className="hero-content">
            <h1 className="hero-heading">Create. Discover. Experience.</h1>
            <p className="hero-lead">
              Build beautiful event pages, sell tickets, and grow attendance. EventSphere is an all-in-one
              platform for organizers and attendees — elegant, fast and reliable.
            </p>

            <div className="hero-cta">
              <Link to="/events" className="btn btn-primary">Browse Events</Link>

              {/* Visible only for .org users */}
              {canCreateEvent && (

                <Link to="/CreateEvent" className="btn btn-primary">
                  Create Event
                </Link>

              )}
            </div>

            <ul className="hero-stats">
              <li><strong>500+</strong><span>Events hosted</span></li>
              <li><strong>5k+</strong><span>Tickets sold</span></li>
              <li><strong>80%</strong><span>Event uptime</span></li>
            </ul>
          </div>

          <div className="hero-art">
            <div className="hero-image-card card1">
              <img src="/MusicConcert.jpg" alt="Music Event" />
            </div>
            <div className="hero-image-card card2">
              <img src="/TechMeetup.jpeg" alt="Tech meetup Event" />
            </div>

            <div className="hero-icons">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="floating-badge">Featured · Trending</div>
          </div>
        </div>
      </section>

      <hr />

      {/* FEATURES */}
      <section className="features container">
        <h2 className="feature-title">Why organizers and attendees love EventSphere</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <article key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <hr />

      {/* UPCOMING EVENTS */}
      <section className="events-section container">
        <h2 className="event-title">Upcoming Events</h2>
        <div className="card-grid">
          {events.map(ev => (
            <article key={ev.id} className="card event-card">
              <div className="event-media">
                <div className="event-thumb">
                  <img src={ev.image} alt={ev.title} className="event-img" />
                </div>
              </div>

              <div className="card-body">
                <h3 className="card-title"> {ev.title}</h3>
                <p><b>📅 Date:</b> {ev.date}</p>
                <p><b>📍 Location:</b> {ev.location}</p>
                <p>👥 <b>Attendees:</b> {ev.attendees}</p>
                <p>💰 <b>Revenue:</b> ₹{ev.revenue}</p>
                <p className="p"><b>📝 Description:</b> {ev.description}</p>
                <div className="card-actions">
                  <Link to={`/events/${ev.id}`} className="btn btn-primary small">Details</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <hr />

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <h2 className="Testimonials-title">What people say</h2>
        <div className="test-slider">
          <div className="test-track">
            {testimonials.concat(testimonials).map((t, i) => (
              <div key={i} className="testimonial-card">
                <p className="quote">"{t.text}"</p>
                <p className="cite">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr />

      {/* CTA STRIP */}
      <section className="cta-strip">
        <div className="container cta-inner">
          <div>
            <h3>Ready to host your next event?</h3>
            <p className="muted">Create an event page, manage sales, and connect with attendees.</p>
          </div>
          <div className="cta-actions">
            <Link to="/events" className="btn btn-primary">Browse Events</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
