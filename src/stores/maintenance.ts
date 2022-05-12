import create from "zustand";
import * as falso from "@ngneat/falso";
import { Incident } from "../interfaces/incident";

interface MaintenanceState {
    Maintenance?: Incident[];
}

const useMaintenance = create<MaintenanceState>()((set) => ({
    // TODO
}));

export default useMaintenance;
