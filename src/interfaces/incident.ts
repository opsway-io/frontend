import { User } from "./user";

export interface Incident {
    id: string;
    title: string;
    description: string;
    status: IncidentStatus;
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
    closedBy?: User;
}

export enum IncidentStatus {
    Open = "OPEN",
    Closed = "CLOSED",
}
