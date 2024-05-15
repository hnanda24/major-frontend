import './App.css'
import FileUploader from './FileUploader'
import Navbar from './Navbar'

function App() {
  return (
    <div className='flex  items-center justify-evenly w-full h-screen '>
      <Navbar />
      <div className='h-[70%] items-start flex'>
        <img
          src='/img2.png'
          className='w-96 h-96'
          alt='helo'
        />
      </div>
      <FileUploader />
      <div className='h-[70%] items-end flex'>
        <img
          src='/img1.png'
          alt=''
        />
      </div>
    </div>
  )
}

export default App
