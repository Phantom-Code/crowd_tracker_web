import React, { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/authContext";
import { database } from "../firebase";
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 16.86088,
  lng: 74.565964,
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
let circleOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  clickable: true,
  draggable: false,
  radius: 100,
  editable: false,
  visible: true,
  zIndex: 1,
};
let circleOptions2 = {
  strokeColor: "#00FF00",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#00FF00",
  fillOpacity: 0.35,
  clickable: true,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1,
};
export default function MapComp() {
  const { logout, currentUser } = useAuth();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
  });
  const [newGeofences, setNewGeofences] = useState([]);
  const [geofences, setGeofences] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [radius, setRadius] = useState(100);

  const getGeofences = useCallback(async () => {
    await database.ref("/admins/" + currentUser.uid).on("value", (snapshot) => {
      if (snapshot.val().geofences !== "undefined") {
        setGeofences(snapshot.val().geofences);
      } else {
        setGeofences([]);
      }
    });
  }, [currentUser.uid]);
  useEffect(() => {
    getGeofences();
  }, [getGeofences]);

  const onMapClick = useCallback(
    (event) => {
      setNewGeofences((current) => [
        ...current,
        {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          time: Date.now(),
          radius: radius,
        },
      ]);
    },
    [radius]
  );
  if (loadError) return "Error Loading Maps";
  if (!isLoaded) return "Loading Maps";
  const updateDataBase = async () => {
    let updatedgeofences = [];
    if (geofences && newGeofences) {
      updatedgeofences = [...geofences, ...newGeofences];
    } else {
      updatedgeofences = newGeofences;
    }

    setNewGeofences([]);
    await database
      .ref("/admins/" + currentUser.uid)
      .update({ geofences: updatedgeofences })
      .then(() => {
        alert("updated successfully");
      })
      .catch((error) => {
        console.log("Error in updating Database", error);
      });
  };
  const getMarkers = async () => {
    await database.ref("/users/").on("value", (snapshot) => {
      for (var key in snapshot.val()) {
        const last_location = snapshot.val()[key];
        // console.log(typeof last_location, last_location);
        setMarkers((current) => [...current, last_location]);
      }
    });
  };
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Container
        style={{
          width: "30%",
          backgroundColor: "#010101",
          color: "#FFF",
        }}
      >
        <Row>
          <Col>
            <label>Enter radius of Circle :</label>
            <input
              style={{ backgroundColor: "#010101", color: "#FFF" }}
              type="number"
              min="50"
              step="50"
              value={radius}
              onChange={(event) => {
                setRadius(event.target.valueAsNumber);
                circleOptions.radius = radius;
              }}
            />
          </Col>
        </Row>
        <Row className="mt-3 mb-3">
          <Col>
            <Button onClick={updateDataBase}>Save</Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                setNewGeofences([]);
              }}
            >
              Clear
            </Button>
          </Col>
        </Row>
        <Button
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
      </Container>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={getMarkers}
      >
        {markers &&
          markers.map((marker) => (
            <Marker
              key={marker.mail}
              position={{
                lat: marker.last_location[0].coords.latitude,
                lng: marker.last_location[0].coords.longitude,
              }}
              onClick={() => {
                setSelected(marker);
              }}
            />
          ))}
        {newGeofences &&
          newGeofences.map((geofence) => (
            <Circle
              key={geofence.time}
              center={{ lat: geofence.lat, lng: geofence.lng }}
              options={circleOptions}
              radius={geofence.radius}
              onClick={() => {
                console.log("Circle Clicked");
              }}
            />
          ))}
        {geofences &&
          geofences.map((geo) => (
            <Circle
              key={geo.time}
              center={{ lat: geo.lat, lng: geo.lng }}
              radius={geo.radius}
              options={circleOptions2}
              onClick={() => {
                console.log("Circle Clicked");
              }}
            />
          ))}
        {selected ? (
          <InfoWindow
            position={{
              lat: selected.last_location[0].coords.latitude,
              lng: selected.last_location[0].coords.longitude,
            }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h1>{selected.mail}</h1>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}
