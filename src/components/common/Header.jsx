import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, getDownloadURL } from 'firebase/storage'
import Button from '@mui/material/Button'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import Avatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme } from '@mui/material/styles'
import { Hidden } from '@mui/material'

import { storage } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import useLogout from '../../hooks/useLogout'

const Header = () => {
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const { logout } = useLogout()

  const theme = useTheme()

  const pages = ['dashboard']
  const settings = ['profile', 'account', 'logout']

  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState()

  if (user && user.photoURL) {
    getDownloadURL(ref(storage, user.photoURL))
      .then((url) => {
        setAvatarUrl(url)
      })
      .catch(() => {
        // Handle any errors
      })
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null)

    if (page) navigate(`/${page}`)
  }

  const handleCloseUserMenu = async (setting) => {
    setAnchorElUser(null)

    if (setting === 'logout') {
      await logout()
      navigate(`/login`)
    } else if (setting) {
      navigate(`/${setting}`)
    }
  }

  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: 'none',
        borderBottom: '1px solid black',
        backgroundColor: 'unset',
        color: 'black',
        marginBottom: 4,
      }}
    >
      <Toolbar disableGutters style={{ justifyContent: 'space-between' }}>
        {/* desktop logo */}
        <Hidden only={['xs', 'sm']}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VpnKeyIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                display: { xs: 'none', md: 'flex' },
                fontWeight: 600,
                color: 'inherit',
                textDecoration: 'none',
                marginBottom: 0,
              }}
            >
              FIREBASE AUTH APP
            </Typography>
          </Box>
        </Hidden>

        {/* mobile menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            onClick={handleOpenNavMenu}
            color="inherit"
            edge="start"
            style={{ paddingRight: 0 }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={() => handleCloseNavMenu()}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {pages.map((page) => (
              <MenuItem
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{ textTransform: 'capitalize' }}
              >
                {page.replaceAll('-', ' ')}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* mobile logo */}
        <Hidden only={['md', 'lg', 'xl']}>
          <div style={{ display: 'flex' }}>
            <VpnKeyIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 600,
                fontSize: 14,
                color: 'inherit',
                textDecoration: 'none',
                marginTop: '3px',
                marginBottom: '3px',
              }}
            >
              FIREBASE AUTH APP
            </Typography>
          </div>
        </Hidden>

        {/* desktop menu */}
        {user && user.emailVerified && (
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{
                  my: 2,
                  padding: '5px 10px',
                  display: 'block',
                  margin: '0 10px',
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {page.replaceAll('-', ' ')}
              </Button>
            ))}
          </Box>
        )}

        {/* avatar */}
        {user && user.emailVerified && (
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                alt={user.displayName}
                sx={{ bgcolor: !avatarUrl && theme.palette.primary.main }}
                src={avatarUrl}
              />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={() => handleCloseUserMenu()}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleCloseUserMenu(setting)}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {setting}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
