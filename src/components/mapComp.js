import React, { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";
import { Container, Button, Row, Col, Modal, Form } from "react-bootstrap";
import { useAuth } from "../context/authContext";
import { database } from "../firebase";
import uuid from "react-uuid";
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 16.845510226236318,
  lng: 74.60121878322096,
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
  const { currentUser } = useAuth();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
  });
  const [newGeofences, setNewGeofences] = useState({});
  const [geofences, setGeofences] = useState({});
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [radius, setRadius] = useState(100);
  const [showModal, setShow] = useState(false);
  const [mapClick, setMapClick] = useState("");

  const handleModalClose = () => setShow(false);
  const handleModalShow = useCallback((mapClickEvent) => {
    setMapClick(mapClickEvent);
    setShow(true);
  }, []);

  const handleModalSubmit = async (event) => {
    event.preventDefault();
    handleModalClose();
    console.log(event.target);
    let geofence = {};
    if (event.target.geofenceName.value === "") {
      geofence[uuid()] = {
        geofenceName: "Geofence" + (Object.keys(geofences).length + 1),
        latitude: mapClick.latLng.lat(),
        longitude: mapClick.latLng.lng(),
        time: new Date(),
        radius: radius,
        usersCount: 0,
      };
    } else {
      geofence[uuid()] = {
        geofenceName: event.target.geofenceName.value,
        latitude: mapClick.latLng.lat(),
        longitude: mapClick.latLng.lng(),
        time: new Date(),
        radius: radius,
        usersCount: 0,
      };
    }
    console.log(geofence);
    setNewGeofences((current) => Object.assign({}, current, geofence));
  };
  const getGeofences = useCallback(async () => {
    await database.ref("/admins/" + currentUser.uid).on("value", (snapshot) => {
      if (snapshot.val().geofences !== "undefined") {
        setGeofences(snapshot.val().geofences);
      } else {
        setGeofences({});
      }
    });
  }, [currentUser.uid]);
  //
  useEffect(() => {
    getGeofences();
  }, [getGeofences]);

  const onMapClick = useCallback(
    async (event) => {
      await handleModalShow(event);
    },
    [handleModalShow]
  );

  //
  if (loadError) return "Error Loading Maps";
  if (!isLoaded) return "Loading Maps";

  //
  const updateDataBase = async () => {
    let updatedgeofences = {};

    if (geofences && newGeofences) {
      updatedgeofences = Object.assign({}, geofences, newGeofences);
    } else {
      updatedgeofences = newGeofences;
    }

    await database
      .ref("/admins/" + currentUser.uid)
      .update({ geofences: updatedgeofences })
      .then(() => {
        alert("updated successfully");
      })
      .catch((error) => {
        console.log("Error in updating Database", error);
      });
    //  setGeofenceName("");
    setNewGeofences({});
  };
  const getMarkers = async () => {
    await database.ref("/users/").on("value", (snapshot) => {
      // console.log(snapshot.val());
      for (var key in snapshot.val()) {
        const userData = snapshot.val()[key];
        // console.log(user.last_location);
        // console.log(userData);
        setMarkers((current) => [...current, userData]);
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
        <Modal
          animation={false}
          show={showModal}
          onHide={handleModalClose}
          backdrop="static"
          keyboard={false}
        >
          <Form onSubmit={handleModalSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control
                type="text"
                name="geofenceName"
                placeholder="Geofence1"
                required
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <Row>
          <Col>
            <Form.Label>Enter radius of Circle :</Form.Label>
            <Form.Control
              style={{ backgroundColor: "#010101", color: "#FFF" }}
              type="number"
              min="10"
              step="10"
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
                setNewGeofences({});
              }}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Container>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={17}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={getMarkers}
      >
        {markers &&
          markers.map((marker) => (
            <Marker
              key={
                marker.last_location.latitude +
                marker.last_location.longitude +
                marker.mail
              }
              position={{
                lat: marker.last_location.latitude,
                lng: marker.last_location.longitude,
              }}
              icon={{
                url: "/standing-up-man-.svg",
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={() => {
                setSelected(marker);
              }}
            />
          ))}
        {newGeofences !== "undefined" &&
          Object.keys(newGeofences).map((key) => {
            return (
              <Circle
                key={key}
                center={{
                  lat: newGeofences[key].latitude,
                  lng: newGeofences[key].longitude,
                }}
                options={circleOptions}
                radius={newGeofences[key].radius}
                onClick={() => {
                  console.log(key);
                }}
              />
            );
          })}
        {geofences !== "undefined" &&
          geofences &&
          Object.keys(geofences).map((key) => (
            <Circle
              key={key}
              center={{
                lat: geofences[key].latitude,
                lng: geofences[key].longitude,
              }}
              radius={geofences[key].radius}
              options={circleOptions2}
              onClick={() => {
                console.log("Circle Clicked");
              }}
              onMouseOver={() => {
                // console.log(geofences[key]);
                setSelectedCircle(geofences[key]);
              }}
            />
          ))}

        {/* Marker InfoWindow */}
        {selected ? (
          <InfoWindow
            position={{
              lat: selected.last_location.latitude,
              lng: selected.last_location.longitude,
            }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h4>{selected.mail}</h4>
            </div>
          </InfoWindow>
        ) : null}
        {/* UserCount InfoWindow */}
        {selectedCircle ? (
          <InfoWindow
            position={{
              lat: selectedCircle.latitude,
              lng: selectedCircle.longitude,
            }}
            onCloseClick={() => {
              setSelectedCircle(null);
            }}
          >
            <div>
              <h4>{selectedCircle.geofenceName}</h4>
              <ul>
                <li>Radius:{selectedCircle.radius}</li>
                <li>User Count :{selectedCircle.usersCount}</li>
              </ul>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}
