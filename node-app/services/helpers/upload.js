import { uploadToGoogleCloudStorage } from '../storage/googleCloudStorage'
import { resizeImage } from '../resize/sharp'

import fs from 'fs'
import os from 'os'

const storeBufferToTemp = (buffer, filename) => {
  const uploadDir = os.tmpdir()
  const path = `${uploadDir}/${filename}`
  return new Promise((resolve, reject) => {
    fs.writeFile(path, buffer, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(path)
        }
    })
  })
}

export { storeBufferToTemp }

const storeStreamToTemp = (readStream, filename) => {
  const uploadDir = os.tmpdir()
  const path = `${uploadDir}/${filename}`
  return new Promise((resolve, reject) =>
    readStream
      .on('error', error => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on('error', error => reject(error))
      .on('finish', () => resolve(path))
  )
}

export { storeStreamToTemp }

const resizeSizes = [128, 256, 512, 1024]

const uploadToFolderpath = async (filepath, folderpath, shouldResize) => {
  let promises = []
  if (shouldResize) {
    for (let size of resizeSizes) {
      let promise = new Promise(async (resolve) => {
        let filePathResized = await resizeImage(size, filepath)
        let mediaUrl = await uploadToGoogleCloudStorage(filePathResized, 'test_resized')
        await fs.unlinkSync(filePathResized)
        resolve(mediaUrl)
      })
      promises.push(promise)
    }
  } else {
    let promise = uploadToGoogleCloudStorage(filepath, folderpath)
    promises.push(promise)
  }
  const imageUrls = await Promise.all(promises)
  return imageUrls
}

export { uploadToFolderpath }

const removeFromTemp = async (filename) => {
  const uploadDir = os.tmpdir()
  const path = `${uploadDir}/${filename}`
  await fs.unlinkSync(path)
}

export { removeFromTemp }