import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/message") // Send GET request to the backend
      .then((response) => response.text()) // Parse the response as text
      .then((data) => setMessage(data)) // Store the response in the state
      .catch((error) => console.error("Error fetching data:", error)); // Handle any errors
  }, []);

  return (
    <div>
      <h1>Backend Message:</h1>
      <p>{message}</p> {/* Display the message */}
    </div>
  );
}

export default App;
