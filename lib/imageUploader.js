import { message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

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
  const imgWindow = windowOpen;
  imgWindow.document.write(image.outerHTML);
};

export const uploadButton = loading => (
  <div className="noselect">
    {loading ? <LoadingOutlined /> : <PlusOutlined />}
    <div>Upload</div>
  </div>
);
