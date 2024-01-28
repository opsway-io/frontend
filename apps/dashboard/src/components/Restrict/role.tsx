class Role {
  name: string;
  constructor(name: "MEMBER" | "ADMIN" | "OWNER") {
    this.name = name;
  }

  toString() {
    return this.name;
  }

  static MEMBER = new Role("MEMBER");
  static ADMIN = new Role("ADMIN");
  static OWNER = new Role("OWNER");

  static ORDER = [Role.MEMBER, Role.ADMIN, Role.OWNER];

  static fromString(role: string | null | undefined): Role | null {
    switch (role?.toString()) {
      case "MEMBER":
        return Role.MEMBER;
      case "ADMIN":
        return Role.ADMIN;
      case "OWNER":
        return Role.OWNER;
      default:
        return null;
    }
  }

  equalOrHigher(other: Role | string | undefined | null): boolean {
    if (typeof other === "string") {
      other = Role.fromString(other) as Role;
    }

    if (!other) {
      return false;
    }

    const thisIndex = Role.ORDER.indexOf(this);
    const otherIndex = Role.ORDER.indexOf(other);

    return otherIndex >= thisIndex;
  }
}

export default Role;
