import create from "zustand";
import * as falso from "@ngneat/falso";
import { Monitor } from "../interfaces/monitor";

interface MonitorState {
    monitors?: Monitor[];
}

const useMonitors = create<MonitorState>()((set) => ({
    monitors: falso.randProduct({ length: 4 }).map((product) => ({ id: falso.randUuid(), name: product.title })),
}));

export default useMonitors;
