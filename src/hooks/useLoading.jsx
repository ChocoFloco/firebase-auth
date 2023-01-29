import { useState } from 'react'

const useLoading = () => {
  const [openLoading, setOpenLoading] = useState(true)

  return { openLoading, setOpenLoading }
}

export default useLoading
