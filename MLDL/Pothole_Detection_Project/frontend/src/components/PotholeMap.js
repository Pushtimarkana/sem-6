import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function PotholeMap({ potholes }) {

  const center = [22.3039, 70.8022]; // Example: Rajkot

  return (
    <div style={{marginTop:"40px"}}>

      <h2>📍 Pothole Map</h2>

      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >

        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {potholes.map((p, index) => (

          <Marker
            key={index}
            position={[p.lat, p.lng]}
          >

            <Popup>

              <strong>Pothole #{index + 1}</strong> <br/>
              Depth: {p.depth} <br/>
              Area: {p.area_m2} m²

            </Popup>

          </Marker>

        ))}

      </MapContainer>

    </div>
  );
}

export default PotholeMap;