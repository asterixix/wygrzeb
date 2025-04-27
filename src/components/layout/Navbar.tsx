"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import SourceIcon from "@mui/icons-material/Source";
import HelpIcon from "@mui/icons-material/Help";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigation = [
    { name: "Home", href: "/", icon: <HomeIcon /> },
    { name: "Search", href: "/search", icon: <SearchIcon /> },
    { name: "About", href: "/about", icon: <InfoIcon /> },
    { name: "Sources", href: "/sources", icon: <SourceIcon /> },
    { name: "Help", href: "/help", icon: <HelpIcon /> },
  ];

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: "flex",
              fontWeight: 700,
              color: "primary.main",
              textDecoration: "none",
              flexGrow: isMobile ? 1 : 0,
            }}
          >
            Wygrzeb
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                  onClick={toggleDrawer}
                >
                  <List>
                    {navigation.map((item) => (
                        <ListItem
                        component={Link}
                        href={item.href}
                        key={item.name}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: pathname === item.href ? "action.selected" : "inherit",
                        }}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center" }}>
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  href={item.href}
                  startIcon={item.icon}
                  sx={{
                    my: 2,
                    mx: 1,
                    color: pathname === item.href ? "primary.main" : "text.primary",
                    display: "flex",
                    borderBottom: pathname === item.href ? 2 : 0,
                    borderColor: "primary.main",
                    borderRadius: 0,
                    "&:hover": {
                      backgroundColor: "transparent",
                      borderBottom: 2,
                      borderColor: "primary.light",
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ flexGrow: 0 }}>
              <Button
                component={Link}
                href="/search"
                variant="contained"
                startIcon={<SearchIcon />}
              >
                Advanced Search
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}