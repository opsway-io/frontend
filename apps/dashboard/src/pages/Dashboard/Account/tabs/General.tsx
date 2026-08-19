import { Card, CardContent } from "@mui/material";
import { FunctionComponent, useState } from "react";
import {
  CategoryList,
  CategoryListItem,
} from "../../../../components/CategoryList";
import EditableInput from "../../../../components/EditableInput";
import {
  useCurrentUser,
  useMutateCurrentUser,
} from "../../../../hooks/user.query";
import { validate as validateEmail } from "email-validator";

const AccountGeneralTabView: FunctionComponent = () => {
  const { data: user } = useCurrentUser();
  const { mutate } = useMutateCurrentUser();

  const [name, setName] = useState(user?.name ?? "");
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");

  const handleSave = () => {
    if (!user) {
      return;
    }

    mutate({
      name: name,
      email: email,
      displayName: displayName,
      phoneNumber: phoneNumber || undefined,
    });
  };

  return (
    <>
      <Card>
        <CardContent>
          <CategoryList>
            <CategoryListItem
              title="Name"
              description="Your full name and display name which other people can see."
            >
              <EditableInput
                label="Full name"
                onSave={handleSave}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onValidate={(value) => {
                  return value.length > 0 && value.length <= 255;
                }}
              />

              <EditableInput
                label="Display name"
                onSave={handleSave}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onValidate={(value) => {
                  return value.length <= 255;
                }}
              />
            </CategoryListItem>

            <CategoryListItem
              title="Email"
              description="Your email address used for login."
            >
              <EditableInput
                label="Email address"
                onSave={handleSave}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onValidate={(value) => {
                  return validateEmail(value);
                }}
              />
            </CategoryListItem>

            <CategoryListItem
              title="Phone number"
              description="Your phone number used for SMS and Voice alerts."
            >
              <EditableInput
                label="Phone number (e.g. +1234567890)"
                onSave={handleSave}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </CategoryListItem>
          </CategoryList>
        </CardContent>
      </Card>
    </>
  );
};

export default AccountGeneralTabView;
