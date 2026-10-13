import { FunctionComponent } from "react";
import { useCurrentUserRole } from "../../hooks/user.query";
import Role from "./role";

interface RestrictProps {
  min?: Role | string;
  specific?: Role | string | (Role | string)[];
  children: React.ReactNode | React.ReactNode[];
}

const Restrict: FunctionComponent<RestrictProps> = (props) => {
  const currentRole = useCurrentUserRole();
  if (!currentRole) {
    return null;
  }

  const currentRoleObject = Role.fromString(currentRole);
  if (!currentRoleObject) {
    return null;
  }

  if (props.min) {
    const minRoleObject = Role.fromString(props.min as string);

    if (!minRoleObject || !minRoleObject.equalOrHigher(currentRoleObject)) {
      return null;
    }
  }

  if (props.specific) {
    if (Array.isArray(props.specific)) {
      if (!props.specific.includes(currentRole)) {
        return null;
      }
    } else {
      if (currentRoleObject.toString() !== props.specific.toString()) {
        return null;
      }
    }
  }

  return <>{props.children}</>;
};

export default Restrict;
