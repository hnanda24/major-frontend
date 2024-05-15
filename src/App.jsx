import './App.css'
import FileUploader from './FileUploader'

function App() {
  return (
    <div className='flex  items-center justify-evenly w-full h-screen '>
      <div className='h-[70%] items-end flex'>
        <img
          src='/img1.png'
          className='w-96 h-96'
          alt='helo'
        />
      </div>
      <FileUploader />
      <div className='h-[70%] items-start flex'>
        <img
          src='/img2.png'
          alt=''
        />
      </div>
    </div>
  )
}

export default App
