export const truncateMiddleString = s => {
  if (!s) {
    return null;
  }
  return s.length >= 10 ? s.substring(0, 6) + '...' + s.substring(s.length - 6, s.length) : s;
};
