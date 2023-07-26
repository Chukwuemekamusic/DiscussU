import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useHomeStore } from "../store";
import { Link, useNavigate } from "react-router-dom";
import MyRooms from "../components/profile/MyRooms";
import MyParticipatedRooms from "../components/profile/MyParticipatedRooms";
import BioForm from "../components/BioForm";

const UserProfilePage = () => {
   const navigate = useNavigate();
  const rooms = useHomeStore((state) => state.rooms);
  const user = JSON.parse(localStorage.getItem("user"));

  const user_rooms = rooms.filter((room) => room.host === user.id);
  console.log("user_rooms", user_rooms);
  console.log("rooms", rooms);
  console.log("user_id", user.id);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowedUsers, setShowFollowedUsers] = useState(false);
  const [showEditBio, setShowEditBio] = useState(false);

  const handleEditProfile = () => {
    navigate("/edit-profile", { state: { user: user } });
  };
  return (
    <Container>
      <Row className="mt-5">
        <Col md={4}>
          <Card>
            <Card.Img
              variant="top"
              src={user.profile_pic}
              className="img-fluid"
            />
            <Card.Body>
              <Card.Title>{user.username}</Card.Title>
              <Card.Text>{user.email}</Card.Text>
              <Card.Text>
                Followers: {user.no_of_followers}{" "}
                <Button onClick={() => setShowFollowers(!showFollowers)}>
                  {showFollowers ? "Hide" : "Show"} Followers
                </Button>
              </Card.Text>
              {showFollowers && (
                //Render list of followers here
                <Card.Text>
                  {user.followers.map((follower) => (
                    <div key={follower.id}>
                      <Link to={`/profile/${follower.id}`}>
                        {follower.full_name} (@{follower.username})
                      </Link>
                    </div>
                  ))}
                </Card.Text>
              )}

              <Card.Text>
                Following: {user.no_of_followed}{" "}
                <Button
                  onClick={() => setShowFollowedUsers(!showFollowedUsers)}
                >
                  {showFollowedUsers ? "Hide" : "Show"} Following
                </Button>
              </Card.Text>
              {showFollowedUsers && (
                // Render list of followed users here
                <Card.Text>
                  {user.followed_users.map((followedUser) => (
                    <div key={followedUser.id}>
                      <Link to={`/profile/${followedUser.id}`}>
                        {followedUser.full_name} (@{followedUser.username})
                      </Link>
                    </div>
                  ))}
                </Card.Text>
              )}
              <Card.Text>{user.school_name}</Card.Text>
              <Card.Text>Course: {user.course}</Card.Text>
            </Card.Body>
          </Card>
          <Row className="mt-4">
            <Col>
              <Button onClick={handleEditProfile} variant="primary">
                Edit Profile
              </Button>
            </Col>
          </Row>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>About Me</Card.Title>
              {/* {user.about} */}
              <Card.Text>{user.bio}</Card.Text>
              <Button variant={showEditBio ? "danger" : "primary"} onClick={() => setShowEditBio(!showEditBio)}>
                {showEditBio ? "Cancel" : "Edit"}
              </Button>
              {showEditBio && <Card.Text>
                <BioForm user={user} setShowEditBio={setShowEditBio}/>
                </Card.Text>}
            </Card.Body>
          </Card>
          <Row className="mt-4">
            <MyRooms title={"My Created Rooms"} user={user} />
          </Row>

          <Row className="mt-4">
            <MyParticipatedRooms user={user} />
          </Row>
        </Col>
      </Row>

    
    </Container>
  );
};

export default UserProfilePage;
