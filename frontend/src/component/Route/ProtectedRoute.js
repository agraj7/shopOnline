import React from "react";
import {useSelector} from "react-redux";
import {Route,useNavigate,Link} from "react-router-dom";

const ProtectedRoute = ({element:Element,...rest}) => {
    // const navigate=useNavigate();
    const {loading,isAuthenticated,user} =useSelector((state)=>state.user)
    return (
        <>
            {!loading && (
                <Route
                {...rest}
                render = {
                    (props)=>{
                        if(!isAuthenticated)
                        {
                            return <Link to="/login"/>
                        }
                        return <Element {...props}/>
                    }
                }
                />
            )}
        </>
    )
}
export default ProtectedRoute;