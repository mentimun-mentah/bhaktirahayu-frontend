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

export const getImgUrl = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export const imageValidation = (file, name, url, method, setLoading, dispatch, successResponse) => {
  const formData = new FormData()
  formData.append(name, file)

  let promise = new Promise((resolve, reject) => {
    setLoading(true);

    axios[method](url, formData, formHeaderHandler())
      .then(res => {
        resolve(file);
        setLoading(false);
        dispatch()
        formErrorMessage("success", res.data.detail)
      })
      .catch(err => {
        const errDetail = err.response?.data.detail;
        if(errDetail == signature_exp){
          dispatch()
          resolve(file);
          setLoading(false);
          formErrorMessage("success", successResponse)
        } 
        else {
          setLoading(false);
          if(typeof errDetail === "string"){
            reject(file);
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

  let promise = new Promise((resolve, reject) => {
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
  console.log(file)
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
