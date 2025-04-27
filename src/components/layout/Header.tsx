import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Container
} from '@mui/material';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import LanguageIcon from '@mui/icons-material/Language';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };
  
  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const languageMenuOpen = Boolean(languageAnchorEl);
  
  const navItems = [
    { label: 'Wyszukaj', href: '/search', icon: <SearchIcon /> },
    { label: 'O Projekcie', href: '/about', icon: <InfoIcon /> },
    { label: 'Jak działa', href: '/how-it-works', icon: <HelpIcon /> },
    { label: 'Kontakt', href: '/contact', icon: <ContactSupportIcon /> },
  ];
  
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Wygrzeb
        </Typography>
        <Typography variant="caption" display="block">
          Sprawdź fakty i dane o Polsce
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.label} 
            component={Link} 
            href={item.href}
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button 
          variant="outlined" 
          fullWidth
          onClick={handleLanguageClick}
          startIcon={<LanguageIcon />}
        >
          Język
        </Button>
        <Menu
          anchorEl={languageAnchorEl}
          open={languageMenuOpen}
          onClose={handleLanguageClose}
        >
          <MenuItem onClick={handleLanguageClose}>Polski</MenuItem>
          <MenuItem onClick={handleLanguageClose}>English</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
  
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Wygrzeb
          </Typography>
          
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{ 
                    color: 'inherit', 
                    display: 'block',
                    mx: 1
                  }}
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
          
          <Box sx={{ flexGrow: 0 }}>
            {!isMobile && (
              <IconButton
                onClick={handleLanguageClick}
                sx={{ ml: 1 }}
                aria-controls={languageMenuOpen ? 'language-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={languageMenuOpen ? 'true' : undefined}
              >
                <LanguageIcon />
              </IconButton>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id="language-menu"
              anchorEl={languageAnchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={languageMenuOpen}
              onClose={handleLanguageClose}
            >
              <MenuItem onClick={handleLanguageClose}>
                Polski
              </MenuItem>
              <MenuItem onClick={handleLanguageClose}>
                English
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;