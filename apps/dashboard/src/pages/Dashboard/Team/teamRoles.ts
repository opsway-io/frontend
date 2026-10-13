import { ColorPaletteProp } from "@mui/joy";

/** Roles that can be given to a member through an invitation or role change. */
export const ASSIGNABLE_ROLES = [
  {
    value: "ADMIN",
    label: "Admin",
    description: "Can manage the team, its members and monitors.",
  },
  {
    value: "MEMBER",
    label: "Member",
    description: "Can view but not edit the team and its monitors.",
  },
];

export const formatRole = (role?: string) => {
  if (!role) return "";
  return role.charAt(0) + role.slice(1).toLowerCase();
};

export const roleColor = (role: string): ColorPaletteProp => {
  switch (role) {
    case "OWNER":
      return "danger";
    case "ADMIN":
      return "warning";
    default:
      return "info";
  }
};
