import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Card, Row, Col, Button, Image, Accordion } from "react-bootstrap";

const RoomsFeed = ({ rooms }) => {
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {rooms.map((room) => {
        return (
          <Col key={room.id}>
            {console.log("room host id", room.host)}
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>
                  <Link to={`/room/${room.id}`}>{room.name}</Link>
                </Card.Title>
                <Card.Text>
                  <div className="d-flex align-items-center mb-2">
                    <Image
                      src={room.host_profile_pic}
                      roundedCircle
                      className="profile-pic mr-3"
                    />
                    <Link to={`/student/${room.host}/profile`}>
                      {" "}
                      <i>@{room.host_name}</i>
                    </Link>
                  </div>

                  <small className="text-muted">
                    Created: {moment(room.created).format("MMM DD, YYYY")}
                  </small>

                  {room.permit_all ? (
                    <p>Involved Schools: All</p>
                  ) : room.school_names ? (
                    <Accordion>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header className="p-0">
                          Involved Schools:
                        </Accordion.Header>
                        <Accordion.Body
                          style={{ maxHeight: "100px", overflowY: "auto" }}
                        >
                          <ul>
                            {room.school_names.map((school) => (
                              <li key={school}>{school}</li>
                            ))}
                          </ul>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  ) : null}
                </Card.Text>
                {room.description && (
                  <Card.Text className="roomfeed-description mt-3">
                    {room.description.length <= 100
                      ? room.description
                      : `${room.description.slice(0, 100)}...`}
                  </Card.Text>
                )}
              </Card.Body>
              <Card.Footer>
                <small>{room.category}</small>
                <Button
                  as={Link}
                  to={`/room/${room.id}`}
                  variant="primary"
                  className="float-end"
                >
                  Join Room
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default RoomsFeed;
