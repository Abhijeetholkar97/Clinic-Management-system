import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Calendar from './components/Calendar';
import Summary from './components/Summary';
import './styles.css';

const App = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
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
                setError('Failed to load appointments. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <Router>
            <div className="App">
                <div className="sidebar">
                    <h2>Zendenta Clinic</h2>
                    <Link to="/calendar">Calendar</Link>
                    <Link to="/summary">Summary</Link>
                </div>

                <div className="content">
                    {loading && <p>Loading appointments...</p>}
                    {error && <p className="error-message">{error}</p>}
                    <Routes>
                        <Route path="/" element={<Navigate to="/calendar" />} />
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
