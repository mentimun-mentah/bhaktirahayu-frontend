import { formErrorMessage } from 'lib/axios'

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  image.width = image.width / 2;
  image.height = image.height / 2;

  const safeArea = Math.max(image.width, image.height) * 2;

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  if (!ctx) {
    setIsLoading(false);
    return null;
  }

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width,
    safeArea / 2 - image.height
  );
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    0 - safeArea / 2 + image.width - pixelCrop.x,
    0 - safeArea / 2 + image.height - pixelCrop.y
  );


  // image.width = image.width / 2;
  // image.height = image.height / 2;


  // const maxSize = Math.max(image.width, image.height)
  // const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

  // // set each dimensions to double largest dimension to allow for a safe area for the
  // // image to rotate in without being clipped by canvas context
  // canvas.width = safeArea
  // canvas.height = safeArea

  // // translate canvas context to a central location on image to allow rotating around the center.
  // ctx.translate(safeArea / 2, safeArea / 2)
  // ctx.rotate(getRadianAngle(rotation))
  // ctx.translate(-safeArea / 2, -safeArea / 2)

  // // draw rotated image and store data.
  // ctx.drawImage(
  //   image,
  //   safeArea / 2 - image.width * 0.5,
  //   safeArea / 2 - image.height * 0.5
  // )
  // const data = ctx.getImageData(0, 0, safeArea, safeArea)

  // // set canvas width to final desired crop size - this will clear existing context
  // canvas.width = pixelCrop.width
  // canvas.height = pixelCrop.height

  // // paste generated rotate image with correct offsets for x,y crop values.
  // ctx.putImageData(
  //   data,
  //   Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
  //   Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  // )

  // As Base64 string
  try {
    const base64Image = canvas.toDataURL('image/jpeg');
    return base64Image
  }
  catch (err) {
    formErrorMessage('error', 'Shometing was wrong!')
    return
  }

  /*
  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file))
    }, 'image/png')
  })
  */
  // As a File
  // console.log(canvas.toBlob(res => console.log(res), 'image/png'))
  
  // return new File([res], res.name || "filename", { type: res.type, lastModified: new Date().getTime() })
  // As a File
  /*
  return new Promise((resolve) => {
    canvas.toBlob((res) => {
      const file = new File([res], res.name || "filename", { type: res.type, lastModified: new Date().getTime() })
      const dataImage = {
        size: res.size,
        type: res.type,
        name: res.name || "filename",
        uid: -Math.abs(Math.random()),
        lastModified: new Date().getTime(),
        originFileObj: file
      }
      console.log(dataImage)
      resolve(file)
    }, 'image/png')
  })
  */
}

export async function getRotatedImage(imageSrc, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const orientationChanged = rotation === 90 || rotation === -90 || rotation === 270 || rotation === -270
  if (orientationChanged) {
    canvas.width = image.height
    canvas.height = image.width
  } else {
    canvas.width = image.width
    canvas.height = image.height
  }

  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(image, -image.width / 2, -image.height / 2)

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file))
    }, 'image/png')
  })
}
