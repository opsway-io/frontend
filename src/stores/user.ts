import create from "zustand";
import { User } from "../interfaces/user";
import { persist } from "zustand/middleware"

export interface UserState extends User {
    user?: User;
    setUser: (user?: User) => void;
    clearUser: () => void;
}

const useUser = create<UserState>()(persist((set, get) => ({
    setUser: (user?: User) => set({ user }),
    clearUser: () => set({ user: undefined }),
}), {
    name: "userState",
}));

export default useUser;
