import React, { useState, useEffect, useCallback } from "react";
import { database } from "../firebase";
import { useAuth } from "../context/authContext";
import BarComp from "./chartComponents/barComp";
import LineComp from "./chartComponents/lineComp";
export default function ChartsComp() {
  const [geofences, setGeofences] = useState({});
  const { currentUser } = useAuth();

  const getData = useCallback(async () => {
    await database
      .ref("/admins/" + currentUser.uid + "/geofences/")
      .on("value", (snapshot) => {
        console.log(Object.values(snapshot.val()));
        setGeofences(snapshot.val());
      });
  }, [currentUser]);
  const formatDataforBar = () => {
    console.log(Object.values(geofences));
  };
  useEffect(() => {
    getData();
  }, [getData]);
  return (
    <>
      {/* <div style={{ height: 500 }}>
        <h1>Bar</h1>
        <BarComp data={Object.values(geofences)} />
      </div> */}
      <div style={{ height: 500, width: 500 }}>
        <h1>Line</h1>
        <LineComp data={Object.values(geofences)} />
      </div>
    </>
  );
}
