import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import './Calendar.css';

function Calendar(props) {
    const [events, setEvents] = useState([]);

    useEffect(()=>{
        setEvents(props.appointments)
    },[props.appointments])
    

    const handleEventClick = async (info) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            const id = info.event.id;
            const updatedEvents = events.filter(event => event.id !== id);
            setEvents(updatedEvents);
            
            try {
                await axios.delete(`https://backend-a065.onrender.com/appointments/${id}`);
            } catch (error) {
                console.error('Error deleting event:', error);
                setEvents(events);
            }
        }
    };

    const handleDateClick = async (arg) => {
        const title = prompt('Enter Appointment Title');
        const name = prompt('Enter Patient Name');
        
        if (title && name) {
            const start = new Date(arg.dateStr);
            const end = new Date(start.getTime() + 60 * 60 * 1000); // Adds 1 hour

            const newEvent = {
                title,
                name,
                start: start.toISOString(),
                end: end.toISOString(),
            };

            setEvents((prevEvents) => [...prevEvents, newEvent]);
            console.log("locally created",events);
            try {
                const response = await axios.post('https://backend-a065.onrender.com/appointments', newEvent);
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.start === newEvent.start ? { ...event, id: response.data._id } : event
                    )
                );
            } catch (error) {
                console.error('Error adding event:', error);
                setEvents((prevEvents) => prevEvents.filter(event => event.start !== newEvent.start));
            }
        }
    };

    const handleEventDrop = async (info) => {
        const { id, start, end } = info.event;
    
        if (!start || !end) {
            console.error("Start or end time is missing.");
            return;
        }
    
        const updatedEvents = events.map((event) =>
            event.id === id ? { ...event, start: start.toISOString(), end: end.toISOString() } : event
        );
    
        setEvents(updatedEvents);
        props.setAppointments(updatedEvents); // Update parent component if needed
    
        try {
            // Update the event in the database
            await axios.put(`https://backend-a065.onrender.com/appointments/${id}`, {
                start: start.toISOString(),
                end: end.toISOString(),
            });
        } catch (error) {
            console.error("Error updating event:", error);
    
            // Revert the state if the database update fails
            setEvents((prevEvents) => 
                prevEvents.map((event) => 
                    event.id === id ? { ...event, start: event.start, end: event.end } : event
                )
            );
        }
    };

   
    return (
        
        <div className="calendar-container">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={events}
                editable={true}
                droppable={true}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                eventDrop={handleEventDrop}
            />
        </div>
    );
}

export default Calendar;
