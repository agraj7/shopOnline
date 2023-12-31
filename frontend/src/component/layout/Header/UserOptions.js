import React, { Fragment, useState } from "react";
import "./Header.css";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import { useAlert } from "react-alert";
import { logout } from "../../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import ProfileImage from "../../../images/Profile.png"
import {toast} from "react-toastify";

const UserOptions = ({user}) => {
  const { cartItems } = useSelector((state) => state.cart);
  // const {user} = useSelector((state)=>state.user)
  // console.log(user)
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // const history = useHistory();
  // const alert = useAlert();
  const dispatch = useDispatch();

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func:orders},
    { icon: <PersonIcon />, name: "Profile", func:account },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  function dashboard() {
    // history.push("/admin/dashboard");
    navigate("/admin/dashboard")
  }

  function orders() {
    navigate("/orders")
    // history.push("/orders");
  }
  function account() {
    // history.push("/account");
    navigate("/account")
  }
  function cart() {
    // history.push("/cart");
    navigate("/cart")
  }
  function logoutUser() {
    try{
      dispatch(logout());
      toast.success("logout successfully");
    }
    catch (error) {
    toast.error("cannot logout");
  }
  
  }

  return (
    <Fragment>
      {/* <Backdrop open={open} style={{ zIndex: "10" }} /> */}
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        // style={{ zIndex: "11" }}
        open={open}
        direction="down"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : ProfileImage}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;