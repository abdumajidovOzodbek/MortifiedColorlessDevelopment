import React, { useState } from "react";

function InputForm({ onAddCoordinates }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse user input and extract X, Y values
    const coordStrings = input.split("\n").filter(line => line.trim() !== ""); // Split by lines and filter empty lines
    const newCoords = coordStrings.map((line) => {
      const xMatch = line.match(/X=([\d.]+)/); // Match the X coordinate
      const yMatch = line.match(/Y=([\d.]+)/); // Match the Y coordinate
      if (xMatch && yMatch) {
        const x = parseFloat(xMatch[1]); // Extract X value
        const y = parseFloat(yMatch[1]); // Extract Y value
        return { x, y };
      }
      return null; // Ignore invalid lines
    }).filter(coord => coord !== null); // Filter out null values

    // Pass the filtered coordinates to the parent
    onAddCoordinates(newCoords);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <textarea
        rows="5"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Koordinata kiritish (misol):
       в точке  X=20180.3652  Y=76351.9184  Z=   0.0000
       в точке  X=20180.3652  Y=76351.9184  Z=   0.0000
       в точке  X=20180.3652  Y=76351.9184  Z=   0.0000
       в точке  X=20180.3652  Y=76351.9184  Z=   0.0000`}
        className="input-textarea"
      ></textarea>
      <button type="submit" className="submit-button">HISOBLASH</button>
    </form>
  );
}

export default InputForm;
