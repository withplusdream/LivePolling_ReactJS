import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line
const Auth = (props) => {
    const { Component, isAuthRequired } = props
    const navigate = useNavigate()
    const [ cookies ] = useCookies()

    const AuthenticationCheck = () => {
        // 로그인을 하지 않은 상태
        if(!cookies.auth){
            // 로그인이 필요한 페이지인 경우
            if(isAuthRequired){
                navigate("/login")
            }
        }
        // 로그인을 한 상태
        else{
            // 로그인 페이지인 경우
            if(!isAuthRequired){
                navigate("/manager")
            }
        }
    }

    useEffect(() => {
        AuthenticationCheck()
        // eslint-disable-next-line
    }, []);

    return(
        <Component/>
    )
}

export default Auth