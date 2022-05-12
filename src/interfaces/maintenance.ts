export interface Maintenance {
    id: string;
    name: string;
    description: string;
    status: MaintenanceStatus;
    createdAt: Date;
    updatedAt: Date;
    startsAt: Date;
    endsAt: Date;
    tags: string[];
}

export enum MaintenanceStatus {
    Scheduled = "SCHEDULED",
    Active = "ACTIVE",
    Completed = "COMPLETED",
}