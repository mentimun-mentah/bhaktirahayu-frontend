export const formImage = {
  file: { value: [], isValid: true, message: null },
}

export const formImageIsValid = (state, setState, msg = "KTP/KIS tidak boleh kosong") => {
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
