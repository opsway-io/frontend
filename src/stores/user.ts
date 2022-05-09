import create from "zustand";
import { persist } from "zustand/middleware";
import * as falso from "@ngneat/falso";
import { User } from "../interfaces/user";

export interface UserState extends User {
    setEmail: (email: string) => void;
    getFullName(): string;
}

const useUser = create<UserState>()(
    persist(
        (set, get) => ({
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
        }),
        {
            name: "userState",
        }
    )
);

export default useUser;
