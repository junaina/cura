import React from "react";

const TimeSlotTable = ({ slots, handleSlotChange }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const times = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  return (
    <div className="time-slot-table">
      <h2>Check All Available Slots for Consultation</h2>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time}>
              <td>{time}</td>
              {days.map((day) => (
                <td key={day}>
                  <input
                    type="checkbox"
                    name={`${day}-${time}`}
                    checked={slots[`${day}-${time}`] || false}
                    onChange={handleSlotChange}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeSlotTable;
