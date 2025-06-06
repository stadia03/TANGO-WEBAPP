import {create} from "zustand";

type UserStore = {
  name : string;
  setName : (name : string)=>void;

  designation : string;
  setDesignation : (designation : string) =>void;

  isAuth : boolean;
  setAuth : (isAuth : boolean)=>void;

};

export const useUserStore = create<UserStore>((set)=>({
  name : "",
  setName: (name : string)=> set({name}),
  designation: "",
  setDesignation:(designation:string )=> set({designation}),
  isAuth: false,
  setAuth: (isAuth:boolean)=>set({isAuth})
} ));

