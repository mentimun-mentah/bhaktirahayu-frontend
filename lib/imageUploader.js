import axios from './axios'
import { message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { formHeaderHandler, formErrorMessage, signature_exp } from './axios'

message.config({ duration: 5, maxCount: 1 });

export const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const imageValidation = (file, name, url, method, setLoading, dispatch, successResponse) => {
  const formData = new FormData()
  formData.append(name, file)

  let promise = new Promise((resolve, _) => {
    setLoading(true);

    axios[method](url, formData, formHeaderHandler())
      .then(res => {
        resolve(file)
        setLoading(false)
        dispatch()
        formErrorMessage("success", res.data.detail)
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail == signature_exp){
          dispatch()
          resolve(file)
          setLoading(false)
          formErrorMessage("success", successResponse)
        } 
        else {
          setLoading(false)
          if(typeof errDetail === "string"){
            formErrorMessage("error", errDetail)
            return false
          } else {
            resolve(file);
          }
        }
      })
  })

  return promise
}

export const imageValidationNoHeader = (file, name, url, method, setLoading) => {
  const formData = new FormData()
  formData.append(name, file)

  let promise = new Promise((resolve, _) => {
    setLoading(true);

    axios[method](url, formData)
      .then(res => {
        resolve(file)
        setLoading(false)
        formErrorMessage("success", res.data.detail)
      })
      .catch(err => {
        setLoading(false)
        const errDetail = err.response?.data.detail
        if(typeof errDetail === "string"){
          formErrorMessage("error", errDetail)
          return false
        } else {
          resolve(file)
        }
      })
  })

  return promise
}

export const imagePreview = async file => {
  const windowOpen = window.open('', '_blank')
  let src = file.url;
  if (!src) {
    src = await new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => resolve(reader.result);
    });
  }
  const image = new Image();
  image.src = src;
  image.style = "width: 100%; height: auto;"
  const imgWindow = windowOpen;
  imgWindow.document.write(image.outerHTML);
};

export const uploadButton = loading => (
  <div className="noselect">
    {loading ? <LoadingOutlined /> : <PlusOutlined />}
    {loading ? <div>Uploading</div> : <div>Upload</div>}
  </div>
);


// get an image blob from url using fetch
let getImageBlob = url => {
  return new Promise(async resolve => {
    let resposne = await fetch(url);
    let blob = resposne.blob();
    resolve(blob);
  });
};

// convert a blob to base64
let blobToBase64 = blob => {
  return new Promise(resolve => {
    let reader = new FileReader();
    reader.onload = () => {
      let dataUrl = reader.result;
      resolve(dataUrl);
    };
    reader.readAsDataURL(blob);
  });
}

// combine the previous two functions to return a base64 encode image from url
let getBase64Image = async url => {
  let blob = await getImageBlob(url);
  let base64 = await blobToBase64(blob);
  return base64;
}

export const getBase64UrlImage = async url => {
  const result = getBase64Image(url)
  return result
}
