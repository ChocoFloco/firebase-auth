import React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

import useLoading from '../../hooks/useLoading'

const Loading = () => {
  const { openLoading } = useLoading()

  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export default Loading
