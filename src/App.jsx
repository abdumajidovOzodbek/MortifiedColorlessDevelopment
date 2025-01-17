import React, { useState } from "react";
import InputForm from "./InputForm";
import TableDisplay from "./TableDisplay";

function App() {
  const [coordinates, setCoordinates] = useState([]);
  const [lengths, setLengths] = useState([]);

  // Calculate distance between two points
  const calculateDistance = (coord1, coord2) => {
    const deltaX = coord2.x - coord1.x;
    const deltaY = coord2.y - coord1.y;
    return Math.sqrt(deltaX ** 2 + deltaY ** 2).toFixed(2); // Two decimal precision
  };

  const handleAddCoordinates = (newCoords) => {
    // Append new coordinates
    const updatedCoords = [...coordinates, ...newCoords];
    setCoordinates(updatedCoords);

    // Calculate lengths between consecutive points
    const newLengths = [];
    for (let i = 0; i < updatedCoords.length - 1; i++) {
      newLengths.push(calculateDistance(updatedCoords[i], updatedCoords[i + 1]));
    }
    setLengths(newLengths);
  };

  return (
    <div>
      <h1>Coordinate Length Calculator</h1>
      <InputForm onAddCoordinates={handleAddCoordinates} />
      <TableDisplay coordinates={coordinates} lengths={lengths} />
    </div>
  );
}

export default App;
