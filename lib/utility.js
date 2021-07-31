export const urltoFile = (url, filename, mimeType) => {
  return (fetch(url)
    .then(res => {return res.arrayBuffer();})
    .then(buf => {return new File([buf], filename,{type:mimeType});})
  );
}
