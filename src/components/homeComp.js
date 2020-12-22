import React from "react";
import { Jumbotron, Container, Spinner } from "react-bootstrap";
class Home extends React.Component {
  state = {};
  render() {
    return (
      <div>
        <Jumbotron fluid>
          <Container>
            <h1 style={{ fontSize: 50 }}>Crowd Tracker</h1>
            <h2>Coming Soon.....</h2>
            <Spinner animation="grow" variant="success" />
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default Home;
