import { useState } from 'react'

const useAlert = () => {
  const [message, setMessage] = useState(null)
  const [openAlert, setOpenAlert] = useState(false)

  return { message, setMessage, openAlert, setOpenAlert }
}

export default useAlert
