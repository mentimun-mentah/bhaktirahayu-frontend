export const formImage = {
  file: { value: [], isValid: true, message: null },
}

export const formImageIsValidMsg = (state, setState, msg = "Image can't be empty") => {
  const file = { ...state.file };
  let isGood = true;

  if (file.value.length < 1) {
    isGood = false;
    file.isValid = false;
    file.message = msg;
    message.error({ 
      content: msg, 
      style: { marginTop: '10vh' },
    });
  }

  if (!isGood) setState({ ...state, file });

  return isGood;
}

export const formImageIsValid = (state, setState, msg = "Image can't be empty") => {
  const file = { ...state.file };
  let isGood = true;

  if (file.value.length < 1) {
    isGood = false;
    file.isValid = false;
    file.message = msg;
  }

  if (!isGood) setState({ ...state, file });

  return isGood;
}
