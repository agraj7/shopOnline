import React,{useRef,useState,useEffect} from "react"
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { Link, useParams } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FaceIcon from "@mui/icons-material/Face";
import Profile from "../../images/Profile.png";
import {useDispatch,useSelector} from "react-redux"
import { clearErrors,login,register } from "../../actions/userAction";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";

const LoginSignUp = () =>{

    const {location}=useParams();
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const {error,loading,isAuthenticated}= useSelector(state=>state.user)


    const loginTab=useRef(null);
    const registerTab=useRef(null);
    const switcherTab=useRef(null);

    const [loginEmail,setLoginEmail]=useState("");
    const [loginPassword,setLoginPassword]=useState("");
    const [user,setUser] =useState({
        name:"",
        email:"",
        password:"",
    })

    const {name,email,password}=user;

    const [avatar,setAvatar]=useState();
    const [avatarPreview,setAvatarPreview]=useState(Profile);

    const loginSubmit=(e)=>{
        e.preventDefault();
        dispatch(login(loginEmail,loginPassword))
        toast.info("Login details entered,checking...", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
    }

const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);
    dispatch(register(myForm));
    toast.info("Data Entered, checking...", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
  };


    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
              }
            } catch (error) {
              console.error("Error while processing the uploaded image:", error);
              // You can set an error message state or handle the error as needed
            }
          };
      
          try {
            reader.readAsDataURL(e.target.files[0]);
          } catch (error) {
            console.error("Error while reading the image file:", error);
            // You can set an error message state or handle the error as needed
          }
        } else {
          setUser({ ...user, [e.target.name]: e.target.value });
        }
      };
      
      const redirect = location ? location.split("=")[1] :"/account";

    useEffect(()=>{
        if(error)
        {
            toast.error(error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
        dispatch(clearErrors());
            }
            if(isAuthenticated){
                    navigate(redirect);
            }
    },[dispatch,error,navigate,redirect,isAuthenticated])

    const switchTabs= (e,tab) =>{
        if(tab==="login"){
            switcherTab.current.classList.add("shiftToNeutral");            
            switcherTab.current.classList.remove("shiftToRight");   

            registerTab.current.classList.remove("shiftToNeutralForm");            
            loginTab.current.classList.remove("shiftToLeft");            
        }
        if(tab==="register")
        {
            switcherTab.current.classList.add("shiftToRight");   
            switcherTab.current.classList.remove("shiftToNeutral");            

            registerTab.current.classList.add("shiftToNeutralForm");            
            loginTab.current.classList.add("shiftToLeft");            
        }

    }

    return (<div>
{loading ? <Loader/> :     <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
                <div>
                <div className="login_signUp_toggle">
                <p onClick={(e)=>switchTabs(e,"login")}>Login</p>
                <p onClick={(e)=>switchTabs(e,"register")}>Register</p>
                </div>
                <button ref={switcherTab}></button>
                </div>
                <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                    <div className="loginEmail">
                        <MailOutlineIcon/>
                        <input
                        type="email"
                        placeholder="Email"
                        required
                        value={loginEmail}
                        onChange={(e)=>setLoginEmail(e.target.value)}
                        />
                    </div>
                    <div className="loginPassword">
                        <LockOpenIcon/>
                        <input 
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e)=>setLoginPassword(e.target.value)}
                        />
                    </div>
                    <Link to="/password/forgot">Forgot Password</Link>
                    <input type="submit" value="Login" className="loginBtn"/>

                </form>

                <form className="signUpForm" ref={registerTab} encType="multipart/form-data" onSubmit={registerSubmit}>
                    <div className="signUpName">
                        <FaceIcon />
                        <input
                        type="text"
                        placeholder="Name"
                        required
                        name="name"
                        value={name}
                        onChange={registerDataChange}
                        />
                    </div>
                    <div className="signUpEmail">
                        <MailOutlineIcon/>
                        <input 
                        type="email"
                        placeholder="Email"
                        required
                        name="email"
                        value={email}
                        onChange={registerDataChange}
                        />
                    </div>
                    <div className="signUpPassword">
                        <LockOpenIcon/>
                        <input 
                        type="password"
                        placeholder="Password"
                        required
                        name="password"
                        value={password}
                        onChange={registerDataChange}
                        />
                    </div>
                    <div id="registerImage">
                        <img src={avatarPreview} alt="Avatar Preview"/>
                        <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={registerDataChange}
                        />
                    </div>
                    <input type="submit" value="Register" className="signUpBtn"  />         
                </form>
            </div>
        </div>}
    </div>
    )
}
export default LoginSignUp;