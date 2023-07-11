import React from 'react'
import { FaTimes } from 'react-icons/fa';

const Comments = ({
  room_id, roomComment, setRoomComment
}) => {
  return (
    <div>
      {roomComment.map((comment, index) => {
        return (
          <div>
                <span>@{comment.user}</span>
                <p>
                    {comment.content} <FaTimes />
                </p>
            </div>
        )
      })}
    </div>
  )
}

export default Comments