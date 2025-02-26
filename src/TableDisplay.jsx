import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./App.css";

// Register the chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Function to calculate the distance between two points using the Euclidean distance formula
const calculateDistance = (point1, point2) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy).toFixed(2); // Return the distance rounded to two decimal places
};

// Function to generate DXF content with table layout (including lines)
const generateDXFTable = (coordinates) => {
  let dxfContent = `0\nSECTION\n2\nHEADER\n0\nENDSEC\n`;
  dxfContent += `0\nSECTION\n2\nTABLES\n0\nENDSEC\n`;
  dxfContent += `0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n`;
  dxfContent += `0\nSECTION\n2\nENTITIES\n`;

  // Start a new POLYLINE
  dxfContent += `0\nPOLYLINE\n8\n0\n66\n1\n70\n1\n`;

  // Add each coordinate as a vertex to the POLYLINE
  coordinates.forEach((point) => {
    const x = Array.isArray(point) ? point[0] : point?.x;
    const y = Array.isArray(point) ? point[1] : point?.y;

    if (x !== undefined && y !== undefined) {
      dxfContent += `0\nVERTEX\n8\n0\n10\n${x}\n20\n${y}\n30\n0.0\n`;
    } else {
      console.warn("Invalid coordinate point:", point);
    }
  });

  // End the POLYLINE
  dxfContent += `0\nSEQEND\n`;

  // Properly close the DXF sections
  dxfContent += `0\nENDSEC\n`;
  dxfContent += `0\nSECTION\n2\nOBJECTS\n0\nENDSEC\n`;
  dxfContent += `0\nEOF\n`;

  return dxfContent;
};


function TableDisplay({ coordinates }) {
  const tableRef = useRef(null);

  // Ensure the last coordinate is the same as the first
  const modifiedCoordinates = [...coordinates];
  if (
    coordinates.length > 1 &&
    (coordinates[0].x !== coordinates[coordinates.length - 1].x ||
      coordinates[0].y !== coordinates[coordinates.length - 1].y)
  ) {
    modifiedCoordinates.push(coordinates[0]); // Add the first coordinate to the end
  }

  // Function to handle JPEG download
  const handleDownloadJPEG = async () => {
    if (tableRef.current) {
      const canvas = await html2canvas(tableRef.current, {
        scrollY: 0,
        scale: 2,
        useCORS: true,
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const link = document.createElement("a");
      link.download = `table-${timestamp}.jpeg`;
      link.href = canvas.toDataURL("image/jpeg");
      link.click();
    }
  };

  // Function to handle DXF download with table lines
  const handleDownloadDXF = () => {
    const dxfContent = generateDXFTable(modifiedCoordinates);
    const blob = new Blob([dxfContent], { type: "application/dxf" });
    saveAs(blob, "coordinates_table_with_lines.dxf");
  };

  // Calculate the lengths between the points
  const lengths = [];
  for (let i = 1; i < modifiedCoordinates.length; i++) {
    const length = calculateDistance(
      modifiedCoordinates[i - 1],
      modifiedCoordinates[i]
    );
    lengths.push(length);
  }

  return (
    <div className="table-container">
      {/* Buttons for downloading */}
      <div className="download-button-wrapper">
        <button onClick={handleDownloadJPEG} className="download-button">
          RASM SIFATIDA YUKLAB OLISH (JPEG)
        </button>
        <button onClick={handleDownloadDXF} className="download-button">
          DXF SIFATIDA YUKLAB OLISH (DXF)
        </button>
      </div>

      {/* Table */}
      <table ref={tableRef}>
        <thead>
          <tr>
            <th rowSpan="2">Нуқталар</th>
            <th colSpan="3">Геомаьлумотлар</th>
          </tr>
          <tr>
            <th>Узунлиги<br />(м)</th>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          {modifiedCoordinates.map((coord, index) => (
            <React.Fragment key={index}>
              {/* Render coordinate row */}
              <tr
                className={
                  index === modifiedCoordinates.length - 1 ? "hidden-row" : ""
                }
              >
                <td>{index + 1}</td>
                <td></td>
                <td>{Math.floor(coord.x)}</td>
                <td>{Math.floor(coord.y)}</td>
              </tr>

              {/* Render length row if it's not the last point */}
              {index < lengths.length && (
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
