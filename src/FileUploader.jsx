import React, { useState } from 'react'
import { v4 } from 'uuid'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { imageDB } from './firebaseConfig'
import axios from 'axios'

function FileUploader() {
  const [images, setImages] = useState([])
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
        // console.log('Download URL:', url)
      }
      setDownloadUrl(urls)
      setSubmitting(false)
      setSubmited(true)
      const response = axios.post(
        'https://f5e9b078-e262-43e1-acd7-8c768aa92f23-00-2s9q7md1dldiu.spock.replit.dev/post-string',
        { data: { url: downloadUrl } }
      )
      console.log(response)
    } catch (error) {
      console.error('Error compressing/uploading image:', error)
    }
  }

  return (
    <div className='flex flex-col w-full gap-4'>
      <div>
        <input
          type='file'
          onChange={handleFileChange}
          multiple
        />
        {submited ? (
          <button className='px-2 py-1 font-semibold bg-gray-200 rounded-lg cursor-not-allowed'>
            {' '}
            Sumbitted{' '}
          </button>
        ) : (
          <button
            className='px-2 py-1 font-semibold bg-gray-200 rounded-lg'
            onClick={handleClick}
          >
            Submit
          </button>
        )}
      </div>

      {submitting ? (
        <h1>Submitting...</h1>
      ) : submited ? (
        <h2>Submitted</h2>
      ) : (
        <div className='flex w-full gap-2 overflow-x-scroll'>
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className='relative flex-shrink-0 w-96 h-96'
            >
              <img
                src={url}
                className='object-cover w-full h-full'
                alt={`Preview Image ${index}`}
              />
              <button
                onClick={() => handleDelete(index)}
                className='absolute px-2 py-1 text-white bg-red-500 rounded-full top-2 left-2'
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
