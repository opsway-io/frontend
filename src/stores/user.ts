import create from "zustand";
import * as falso from "@ngneat/falso";
import { User } from "../interfaces/user";

export interface UserState extends User {
    setEmail: (email: string) => void;
    getFullName(): string;
}

const useUser = create<UserState>()((set, get) => ({
    id: falso.randUuid(),
    email: falso.randEmail(),
    firstName: falso.randFirstName(),
    lastName: falso.randLastName(),
    picture: falso.randImg(),
    createdAt: falso.randPastDate(),
    updatedAt: falso.randPastDate(),

    setEmail: (email: string) => {
        set(() => ({ email }));
    },

    getFullName: () => {
        const state = get();
        return `${state.firstName} ${state.lastName}`;
    },
}));

export default useUser;
