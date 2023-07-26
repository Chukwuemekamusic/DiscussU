import moment from "moment";
import { Link } from "react-router-dom";

const Room = ({ room }) => {
  return (
    <>
      <h3>
        <Link to={`/room/${room.id}`}>{room.name}</Link>
      </h3>
      <p>
        @<i>{room.host_name} </i>
        <small>created: {moment(room).fromNow()}</small>
      </p>
      {room.description && (
        <p className="roomfeed_description">
          {room.description.length <= 50
            ? room.description
            : `${room.description.slice(0, 50)}...`}
        </p>
      )}
      <small>{room.category}</small>
    </>
  );
};

export default Room;
