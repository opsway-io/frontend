const isCertValid = (notAfter: Date): boolean => {
  const now = new Date();
  const notAfterDate = new Date(notAfter);

  return notAfterDate.getTime() > now.getTime();
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

export { certDaysUntilExpiry, isCertValid };
