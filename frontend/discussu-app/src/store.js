import { create } from 'zustand'
import axios from "axios";
import { getHeaders } from './api/getHeaders';
import Cookies from 'js-cookie';
import { ErrorCheck } from './components/utils/utilFunctions';

const token = Cookies.get('token');

const useHomeStore = create((set) => ({
    rooms: [],
    categories: [],
    isopen: false,
    schools: [],

    setRooms: (data) => set(() => ({ rooms: data })),
    setCategories: (data) => set(() => ({ categories: data })),
    setIsopen: () => set((state) => ({ isopen: !state.isopen })),
    setClose: () => set(() => ({ isopen: false })),
    setSchools: (data) => set(() => ({schools: data})),
    // sortRoomsByCategory
    updateRoomsData: async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/rooms/`,
            getHeaders(token)
          );
          const data = await response.data;
          set({ rooms: data });
        } catch (error) {
          console.error(error);
        }
      },
}))

const useStoreFns = create((set) => ({
    // Your existing state and actions...
  
    deleteRoom: async (roomId) => {
      try {
        // Make an API call to delete the room
        await axios.delete(`http://localhost:8000/api/rooms/${roomId}/`, getHeaders(token));
  
        useHomeStore.getState().updateRoomsData()
      } catch (error) {
        console.error(error);
        ErrorCheck(error)
        // Handle any errors that occurred during the deletion process.
        // For example, you can show an error message to the user.
      }
    },

    
  }));

export { useHomeStore, useStoreFns }

// Optionally, you can fetch the updated room list after the deletion
        // using your existing getRoomsData action if you have one.
  
        // Update the state or perform any other actions after successful deletion
        // For example, you can remove the deleted room from the room list in the state.
  
        // For simplicity, I'm not updating the state here. You can update it according to your application's state structure.