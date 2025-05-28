"use client";
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  PersonOutline as PersonOutlineIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import { useState, MouseEvent } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [userName] = useState<string>("John Doe");  
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/login");
    handleClose();
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        width: "100%",
        backgroundColor: "#f4f9fd",
        height: "64px",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Paper
        sx={{
          padding: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 400,
          borderRadius: "14px",
          backgroundColor: "#fff",
          boxShadow: "none",
          border: "1px solid #e0e0e0",
        }}
      >
        <IconButton sx={{ padding: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ marginLeft: 1, flex: 1 }}
          placeholder="Search..."
          inputProps={{ "aria-label": "search" }}
        />
      </Paper>

      <Stack direction="row" spacing={2} alignItems="center">
        <Badge badgeContent={5} color="error">
          <IconButton aria-label="notifications">
            <NotificationsIcon />
          </IconButton>
        </Badge>

        <Button
          id="profile-button"
          aria-controls={open ? "profile-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          startIcon={
            <Avatar sx={{ backgroundColor: "#3f8cff" }}>
              {userName ? userName.charAt(0) : <PersonOutlineIcon />}
            </Avatar>
          }
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            textTransform: "none",
            color: "#000000DE",
            backgroundColor: "#ffffff",
            padding: "8px 16px",
            borderRadius: "8px",
          }}
        >
          {userName}
        </Button>

        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "profile-button",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: "#d32f2f" }}>
            Logout
          </MenuItem>
        </Menu>
      </Stack>
    </Stack>
  );
}