import _ from 'lodash'

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

export const reformatClients = object => {
  const state = _.cloneDeep(object)
  state?.map(x => {
    x['clients'] = {
      clients_nik: x['clients_nik'],
      clients_covid_checkups: x['covid_checkups']
    }
    return x
  })
  return state
}

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
