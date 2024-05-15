import React, { useState } from 'react'
import { v4 } from 'uuid'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { imageDB } from './firebaseConfig'
import { MdOutlineFileUpload } from 'react-icons/md'

import axios from 'axios'

function FileUploader() {
  const [images, setImages] = useState([])
  const [prediction, setPrediction] = useState('')
  const [previewUrls, setPreviewUrls] = useState([])
  const [downloadUrl, setDownloadUrl] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submited, setSubmited] = useState(false)

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files)
    setImages(filesArray)

    const urls = filesArray.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const handleDelete = (index) => {
    const newImages = [...images]
    const newPreviewUrls = [...previewUrls]

    newImages.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setImages(newImages)
    setPreviewUrls(newPreviewUrls)
  }

  const compressImage = (file, quality) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0, img.width, img.height)
          canvas.toBlob(
            (blob) => {
              resolve(blob)
            },
            'image/jpeg',
            quality
          )
        }
        img.onerror = (error) => reject(error)
      }
    })
  }

  const handleClick = async () => {
    try {
      setSubmitting(true)
      const urls = []
      for (const image of images) {
        const compressedImage = await compressImage(image, 0.7)
        const imageRef = ref(imageDB, `files/${v4()}`)
        await uploadBytes(imageRef, compressedImage)
        const url = await getDownloadURL(imageRef)
        urls.push(url)
      }

      // Set the download URLs in state
      setDownloadUrl(urls)
      setSubmitting(false)
      setSubmited(true)
      // console.log(urls[0])
      // Make the POST request using the URLs directly from the `urls` array
      // if (urls.length > 0) {
      const response = await axios.post(
        'api',
        { url: urls[0] } // use the first URL from the array
      )
      setPrediction(response.data.prediction[0])
      console.log(response.data.prediction[0])
      // }

      // Log the URLs periodically if needed
    } catch (error) {
      console.error('Error compressing/uploading image:', error)
    }
  }

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex flex-col items-start gap-2  px-4 py-2 '>
        <input
          id='file-upload'
          type='file'
          onChange={handleFileChange}
          multiple
          className='hidden'
        />

        <label
          htmlFor='file-upload'
          className='flex w-full justify-center items-center gap-2 px-4 py-2 font-semibold bg-[#72d5ff] text-white rounded-2xl cursor-pointer hover:bg-blue-600 transition-colors'
        >
          <MdOutlineFileUpload className='text-lg' />
          Choose Files
        </label>
        {submited ? (
          <button className='px-4 py-2 font-semibold w-full bg-gray-400 text-gray-700 rounded-lg cursor-not-allowed'>
            Submitted
          </button>
        ) : (
          <button
            className='px-4 py-2 font-semibold bg-blue-500 w-full text-white rounded-xl hover:bg-blue-600 transition-colors'
            onClick={handleClick}
          >
            Submit
          </button>
        )}
        <div className='flex gap-2 items-center'>
          <h2 className='font-bold text-xl'>Result:</h2>
          <h3 className='font-semibold text-lg'>{prediction}</h3>
        </div>
      </div>

      {submitting ? (
        <h1 className='text-lg font-semibold text-gray-700'>Submitting...</h1>
      ) : submited ? (
        <h2 className='text-lg font-semibold text-green-500'>Submitted</h2>
      ) : (
        <div className='flex flex-wrap gap-4'>
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className='relative flex-shrink-0 w-48 h-48 md:w-64 md:h-64'
            >
              <img
                src={url}
                className='object-cover w-full h-full rounded-lg'
                alt={`Preview Image ${index}`}
              />
              <button
                onClick={() => handleDelete(index)}
                className='absolute top-2 left-2 px-2 py-1 text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors'
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUploader
