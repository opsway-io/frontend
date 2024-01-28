function stringToInitials(str: string) {
  const names = str.split(" ");

  let initials = names[0].charAt(0);

  if (names.length > 1) {
    initials += names[names.length - 1].charAt(0);
  }

  return initials.toUpperCase();
}

export { stringToInitials };
