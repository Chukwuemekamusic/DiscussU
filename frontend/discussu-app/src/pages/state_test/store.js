import {create} from 'zustand'

const useRoomStore = create((set) => ({
    room: [],
    roomComment: [],
    replyParentComment: {},
    setRoom: (room) => set(() => ({ room })),
    setRoomComment: (roomComment) => set(() => ({ roomComment })),
    setReplyParentComment: (replyParentComment) => set(() => ({ replyParentComment })),
    // Define other actions as needed
  }));

  export { useRoomStore };
