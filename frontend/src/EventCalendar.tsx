import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type EventType = {
  id: number;
  date: string;
  eventName: string;
};

const EventCalendar = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [eventText, setEventText] = useState("");
  const [events, setEvents] = useState<EventType[]>([]);

  const handleSave = () => {
    if (!date || eventText.trim() === "") return;

    const newEvent: EventType = {
      id: Date.now(),
      date: date.toDateString(),
      eventName: eventText,
    };

    setEvents([...events, newEvent]);
    setEventText("");
  };

  const eventsForDate = date
    ? events.filter((e) => e.date === date.toDateString())
    : [];

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">

      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Event Calendar
      </h2>

      <div className="mb-4">
        <Calendar
          onChange={(value) => setDate(value as Date)}
          value={date as any}
        />
      </div>

      <p className="mb-4 text-gray-700">
        Selected Date:{" "}
        {date ? date.toDateString() : "No date selected"}
      </p>

      {/* Input + Button */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Add Event"
          value={eventText}
          onChange={(e) => setEventText(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save
        </button>
      </div>

      {/* Events */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Events:</h3>

        {eventsForDate.length > 0 ? (
          eventsForDate.map((event) => (
            <div
              key={event.id}
              className="bg-blue-100 p-2 rounded mb-2"
            >
              {event.eventName}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No Events</p>
        )}
      </div>

    </div>
  );
};

export default EventCalendar;