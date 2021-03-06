import create from "zustand";
import * as falso from "@ngneat/falso";
import { User } from "../interfaces/user";

interface PeopleState {
    users?: User[];
}

const usePeople = create<PeopleState>()((set) => ({
    users: falso.randUser({ length: 20 }).map((user) => ({
        id: user.id,
        email: user.email,
        picture: user.img + "?id=" + user.id,
        name: user.firstName + " " + user.lastName,
        createdAt: falso.randPastDate(),
        updatedAt: falso.randPastDate(),
    })),
}));

export default usePeople;
