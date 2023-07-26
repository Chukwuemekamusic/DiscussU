import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const RoomHeader = ({ room }) => {
  return (
    <Container className="room-header">
      <Row>
        <Col>
          <h2>{room.name}</h2>
          <p>
            Hosted by: <span className="host-name">@{room.host_name}</span>
          </p>
          <p>
            <i>{room.description}</i>
          </p>
          {/* Add any other elements or information you want in the header */}
        </Col>
      </Row>
    </Container>
  );
};

export default RoomHeader;
