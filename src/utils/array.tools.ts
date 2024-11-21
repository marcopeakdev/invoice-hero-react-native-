export const toggleArrayItem = <T>(arr: T[], v: T): T[] => {
  const localArray = [...arr];

  const i = localArray.indexOf(v);
  if (i === -1) {
    localArray.push(v);
  } else {
    localArray.splice(i, 1);
  }

  return localArray;
};

export const toggleArrayObject = <T>(arr: T[], v: T): T[] => {
  const localArray = [...arr];

  const i = localArray.findIndex(item => item._id === v._id);
  if (i === -1) {
    localArray.push(v);
  } else {
    localArray.splice(i, 1);
  }

  return localArray;
};
