export const urltoFile = (url, filename, mimeType) => {
  return (fetch(url)
    .then(res => {return res.arrayBuffer();})
    .then(buf => {return new File([buf], filename,{type:mimeType});})
  );
}

export const updateObject = (oldObject, updateValue) => {
  return { ...oldObject, ...updateValue };
}

export const enterPressHandler = (e, func) => {
  if(e.keyCode === 13) func(e)
}
