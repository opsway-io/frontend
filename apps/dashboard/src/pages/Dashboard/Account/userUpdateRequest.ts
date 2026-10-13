import {
  IGetUserResponse,
  IPutUserRequest,
} from "../../../api/endpoints/users";

/**
 * PUT /users/:id replaces the whole profile, so each section saves the
 * user's stored values with only its own fields changed.
 */
export const toUserUpdateRequest = (
  user: IGetUserResponse,
  changes: Partial<IPutUserRequest>,
): IPutUserRequest => ({
  name: user.name,
  email: user.email,
  displayName: user.displayName ?? "",
  phoneNumber: user.phoneNumber || undefined,
  ...changes,
});
