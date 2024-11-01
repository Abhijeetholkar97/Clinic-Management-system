// src/components/Summary.js
import React from 'react';
import './Summary.css';

function Summary({ appointments }) {
    return (
        <div className="summary-container">
            <h2>Upcoming Appointments</h2>
            <ul className="appointment-list">
                {appointments.map((app) => (
                    <li key={app.id} className="appointment-item">
                        <div className="appointment-title">{app.title}</div>
                        <div className="appointment-name">Patient: {app.name}</div>
                        <div className="appointment-time">
                            {new Date(app.start).toLocaleString()}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Summary;
