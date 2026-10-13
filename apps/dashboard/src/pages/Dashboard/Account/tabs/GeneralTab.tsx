import { Stack } from "@mui/joy";
import { FunctionComponent } from "react";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import { useCurrentUser } from "../../../../hooks/user.query";
import ContactCard from "../components/ContactCard";
import ProfileCard from "../components/ProfileCard";

const GeneralTab: FunctionComponent = () => {
  const { data: user } = useCurrentUser();

  if (!user) return <Placeholder />;

  return (
    <Stack spacing={2}>
      <ProfileCard user={user} />
      <ContactCard user={user} />
    </Stack>
  );
};

export default GeneralTab;
