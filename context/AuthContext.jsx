import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

function createMockJWT(payload){
  const base = btoa(JSON.stringify(payload))
  return `mock.${base}.sig`
}

function parseMockJWT(token){
  if(!token) return null
  try{
    const parts = token.split('.')
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch(e){
    return null
  }
}

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('es_token')
    const u = parseMockJWT(token)
    if(u) setUser(u)
  }, [])

  function login({ email, password }) {
    const role = email.includes('org') ? 'organizer' : 'user'
    const token = createMockJWT({ email, role, name: email.split('@')[0] })
    localStorage.setItem('es_token', token)
    setUser(parseMockJWT(token))
    return { ok: true }
  }

  function register({ name, email, password }) {
    const role = email.includes('org') ? 'organizer' : 'user'
    const token = createMockJWT({ email, role, name })
    localStorage.setItem('es_token', token)
    setUser(parseMockJWT(token))
    return { ok: true }
  }

  function logout() {
    localStorage.removeItem('es_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}
