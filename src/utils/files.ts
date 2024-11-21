export const getFileNameFromUri = (location: string) => {
  const splitted = location.split('/');
  return splitted[splitted.length - 1];
};
