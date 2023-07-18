import { Link } from "react-router-dom";
import moment from "moment";

const RoomsFeed = ({ rooms }) => {
  return (
    <article>
      {rooms.map((room) => {
        return (
          <div key={room.id}>
            <h3>
              <Link to={`/room/${room.id}`}>{room.name}</Link>
            </h3>
            <p>
              @<i>{room.host} </i>
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
          </div>
        );
      })}
    </article>
  );
};

export default RoomsFeed;
