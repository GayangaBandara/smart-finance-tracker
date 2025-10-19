import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center space-x-4">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="h-24 p-6 transition-all hover:drop-shadow-lg" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-24 p-6 transition-all hover:drop-shadow-lg animate-spin" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold text-center my-8">Vite + React</h1>
      <div className="card bg-gray-100 p-8 rounded-lg shadow-md max-w-md mx-auto">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p className="mt-4 text-gray-600">
          Edit <code className="bg-gray-200 px-1 rounded">src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs text-center text-gray-500 mt-8">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
