import React, { useRef } from "react";
import html2canvas from "html2canvas";
import "./App.css"; // Add CSS styling for the table

// Function to calculate the distance between two points using the Euclidean distance formula
const calculateDistance = (point1, point2) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy).toFixed(2); // Return the distance rounded to two decimal places
};

function TableDisplay({ coordinates }) {
  const tableRef = useRef(null);

  // Function to handle download
  const handleDownload = async () => {
    if (tableRef.current) {
      const canvas = await html2canvas(tableRef.current, {
        scrollY: 0, // Fix scrolling issues
        scale: 2,  // High resolution for the image
        useCORS: true, // Allow cross-origin resources if any external fonts/images are used
      });

      const link = document.createElement("a");
      link.download = "table.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  // Calculate the lengths between the points
  const lengths = [];
  for (let i = 1; i < coordinates.length; i++) {
    const length = calculateDistance(coordinates[i - 1], coordinates[i]);
    lengths.push(length);
  }

  return (
    <div className="table-container">
      {/* Button wrapped with a class to make it sticky */}
      <div className="download-button-wrapper">
        <button onClick={handleDownload} className="download-button">
          Download Table as Image
        </button>
      </div>

      {/* Table wrapped with a ref */}
      <table ref={tableRef}>
        <thead>
          <tr>
            <th rowSpan="2">Нуқталар</th>
            <th colSpan="3">Геомаьлумотлар</th>
          </tr>
          <tr>
            <th>Узунлиги<br/>(м)</th>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          {coordinates.map((coord, index) => (
            <React.Fragment key={index}>
              {/* Render coordinate row */}
              <tr className={index === coordinates.length - 1 ? "hidden-row" : ""}>
                <td>{index + 1}</td>
                <td></td>
                {/* Display only integer part of coordinates */}
                <td>{Math.floor(coord.x)}</td>
                <td>{Math.floor(coord.y)}</td>
              </tr>

              {/* Render length row if it's not the last point */}
              {index < coordinates.length - 1 && (
                <tr>
                  <td></td>
                  <td>{lengths[index]}</td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableDisplay;
