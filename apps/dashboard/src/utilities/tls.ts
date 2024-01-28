const isCertValid = (notAfter: Date): boolean => {
  const now = new Date();
  const notAfterDate = new Date(notAfter);

  return notAfterDate.getTime() > now.getTime();
};

// Return a string representation of the date in the format of "DD of Month, YYYY"
const certValidUntilString = (notAfter?: Date): string => {
  if (!notAfter) {
    return "";
  }

  const notAfterDate = new Date(notAfter);

  const day = notAfterDate.getDate();
  const month = notAfterDate.toLocaleString("default", { month: "long" });
  const year = notAfterDate.getFullYear();

  return `${day} of ${month}, ${year}`;
};

const certDaysUntilExpiry = (notAfter?: Date): number => {
  if (!notAfter) {
    return 0;
  }

  const now = new Date();
  const notAfterDate = new Date(notAfter);

  const diff = notAfterDate.getTime() - now.getTime();

  return Math.ceil(diff / (1000 * 3600 * 24));
};

export { certDaysUntilExpiry, certValidUntilString, isCertValid };
