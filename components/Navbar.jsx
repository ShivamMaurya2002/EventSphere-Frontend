import React, { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  // Logout + navigate home
  function handleLogout(){
    logout()
    setOpen(false)
    navigate('/') // redirect to home
  }

  // Active link styling
  const activeClass = ({ isActive }) => isActive ? 'nav-item active' : 'nav-item'

  return (
    <header className="header">
      <div className="container es-header-inner">
        <div className="brand">
          <Link to="/" className="brand-link">EventSphere</Link>
        </div>

        <button className="hamburger" onClick={()=>setOpen(v=>!v)}>
          <span className="hamburger-bar"/>
          <span className="hamburger-bar"/>
          <span className="hamburger-bar"/>
        </button>

        <nav className={`nav ${open ? 'open' : ''}`}>
          <ul className="nav-list">
            <li><NavLink to="/" className={activeClass}>Home</NavLink></li>
            <li><NavLink to="/events" className={activeClass}>Events</NavLink></li>

            {/* Organizer dashboard only */}
            {user?.role==='organizer' && (
              <li><NavLink to="/dashboard" className={activeClass}>Dashboard</NavLink></li>
            )}

            {/* Authentication links */}
            {!user ? (
              <>
                <li><NavLink to="/login" className={activeClass}>Login</NavLink></li>
                <li><NavLink to="/register" className="btn btn-primary">Register</NavLink></li>
              </>
            ) : (
              <>
                <li className="nav-hello">Hi, <strong>{user.name}</strong></li>
                <li><button className="btn" onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
