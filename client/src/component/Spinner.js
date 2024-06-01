import React from 'react'

function Spinner() {
  return (
    <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
    <span className="loading loading-spinner loading-lg"></span>
      
    </div>
  )
}

export default Spinner
