import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Clubs from './pages/Clubs.jsx'
import EventsPage from './pages/Events.jsx'
import VolunteerPage from './pages/Volunteer.jsx'
import GalleryPage from './pages/Gallery.jsx'
import Navbar from './components/Navbar.jsx'
import ProfilePage from './pages/Profile.jsx'
import CreateClubPage from './pages/CreateClub.jsx'
import NotificationsPage from './pages/Notification.jsx'

const App = () => {
  return (
    <div>
        <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/create-club" element={<CreateClubPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </div>
  )
}

export default App