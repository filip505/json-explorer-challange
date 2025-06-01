// src/App.tsx
import React from "react";
import JsonExplorer from "./JsonExplorer"; // Import your component
import "./App.css"; // Make sure your styles are imported

// The demo data provided in the challenge
const demoData = {
  date: "2021-10-27T07:49:14.896Z",
  hasError: false,
  fields: [
    {
      id: "4c212130",
      prop: "iban",
      value: "DE81200505501265402568",
      hasError: false,
    },
  ],
};

function App() {
  return (
    <div className="App">
      <JsonExplorer data={demoData} />
    </div>
  );
}

export default App;
