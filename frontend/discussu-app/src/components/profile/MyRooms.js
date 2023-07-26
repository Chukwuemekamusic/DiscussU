import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useHomeStore } from "../../store";
import { Link } from "react-router-dom";
import moment from "moment";
import { handleDateAndTime } from "../utils/utilFunctions";
import { useState } from "react";

const MyRooms = ({ user, title }) => {
  const rooms = useHomeStore((state) => state.rooms);
  const user_rooms = rooms.filter((room) => room.host === user.id);
  // console.log("user_id fact", user.id);
  const participated_rooms = rooms.filter((room) => {
    return room.participants.find((participant) => participant.id === user.id);
  });
  // console.log("participants", participated_rooms);
  // console.log("user_rooms", user_rooms);

  const [showUserRooms, setShowUserRooms] = useState(false);
  

  return (
    <Col>
      <Card>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            <Button onClick={() => setShowUserRooms(!showUserRooms)}>
              {showUserRooms ? "Hide" : "Show"}
            </Button>
          </Card.Text>
          {/* Render user's posts here */}
          {showUserRooms && (
            <Row>
              {user_rooms && user_rooms.length > 0 ? (
                user_rooms.map((room) => (
                  <Col key={room.id} md={4} sm={6}>
                    <Card>
                      <Card.Body>
                        <div key={room.id} style={{ marginBottom: "10px" }}>
                          <Card.Title>
                            <Link key={room.id} to={`/room/${room.id}`}>
                              {room.name} <br />
                              <small className="text-muted">
                                {room.description}
                              </small>
                            </Link>
                          </Card.Title>
                          <p>
                            {room.number_of_participants}{" "}
                            {room.number_of_participants <= 1
                              ? "participant"
                              : "participants"}
                          </p>
                          <p>Category: {room.category}</p>
                          <p>
                            Permitted Schools:{" "}
                            {room.school.length > 0
                              ? room.school_names.join(", ")
                              : "All Schools"}
                          </p>
                          <p>
                            <small>
                              Created on:{" "}
                              {handleDateAndTime(room.created)}
                            </small>
                          </p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col>
                  <div>No rooms created</div>
                </Col>
              )}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default MyRooms;
