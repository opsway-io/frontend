import create from "zustand";
import * as falso from "@ngneat/falso";
import { Incident } from "../interfaces/incident";

interface IncidentsState {
    incidents?: Incident[];
}

const useIncidents = create<IncidentsState>()((set) => ({
    // TODO
}));

export default useIncidents;
