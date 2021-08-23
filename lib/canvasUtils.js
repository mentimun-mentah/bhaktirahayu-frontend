import { createLogs } from 'lib/logsCreator'
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

  // As Base64 string
  try {
    const base64Image = canvas.toDataURL('image/jpeg');
    createLogs({ req: 'canvasUtils.js', bs64: 'panjang' })
    return base64Image
  }
  catch (err) {
    formErrorMessage('error', 'Shometing was wrong!')
    createLogs({ req: 'canvasUtils.js', catch: 'Shometing was wrong!' })
    return
  }
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


export const getOrientation = (file, callback) => {
  let reader = new FileReader();
  reader.onload = (e) => {
    let view = new DataView(e.target.result);
    if(view.getUint16(0, false) != 0xFFD8) {
      return callback(-2);
    }
    let length = view.byteLength, offset = 2;
    while (offset < length) {
      if(view.getUint16(offset+2, false) <= 8) return callback(-1);
      let marker = view.getUint16(offset, false);
      offset += 2;
      if(marker == 0xFFE1) {
        if(view.getUint32(offset += 2, false) != 0x45786966) {
          return callback(-1);
        }

        let little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        let tags = view.getUint16(offset, little);
        offset += 2;
        for (let i = 0; i < tags; i++) {
          if (view.getUint16(offset + (i * 12), little) == 0x0112) {
            return callback(view.getUint16(offset + (i * 12) + 8, little));
          }
        }
      }
      else if((marker & 0xFF00) != 0xFF00) {
        break;
      }
      else { 
        offset += view.getUint16(offset, false);
      }
    }
    return callback(-1);
  };
  reader.readAsArrayBuffer(file);
}

export const resetOrientation = (srcBase64, srcOrientation, callback) => {
	var img = new Image();	

	img.onload = function() {
  	var width = img.width,
    		height = img.height,
        canvas = document.createElement('canvas'),
	  		ctx = canvas.getContext("2d");
		
    // set proper canvas dimensions before transform & export
		if (4 < srcOrientation && srcOrientation < 9) {
    	canvas.width = height;
      canvas.height = width;
    } else {
    	canvas.width = width;
      canvas.height = height;
    }
	
  	// transform context before drawing image
		switch (srcOrientation) {
      case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
      case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
      case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
      case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
      case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
      case 7: ctx.transform(0, -1, -1, 0, height , width); break;
      case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
      default: break;
    }

		// draw image
    ctx.drawImage(img, 0, 0);

		// export base64
		callback(canvas.toDataURL());
  };

	img.src = srcBase64;
}
