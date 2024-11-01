import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Calendar from './Calendar';
import Summary from './Summary';
import './styles.css';

const App = () => {
    const [appointments, setAppointments] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('https://backend-a065.onrender.com/appointments');
                setAppointments(
                    response.data.map((appointment) => ({
                        ...appointment,
                        id: appointment._id,
                    }))
                );
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <Router>
            <div className="App">
                <button className="menu-btn" onClick={toggleSidebar}>☰ Menu</button>
                
                {sidebarOpen && (
                    <div className="sidebar">
                        <button onClick={toggleSidebar} className="close-btn">X</button>
                        <Link to="/calendar" onClick={toggleSidebar}>Calendar</Link>
                        <Link to="/summary" onClick={toggleSidebar}>Summary</Link>
                    </div>
                )}
                
                <div className="content">
                    <Routes>
                        <Route
                            path="/calendar"
                            element={<Calendar appointments={appointments} setAppointments={setAppointments} />}
                        />
                        <Route path="/summary" element={<Summary appointments={appointments} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
