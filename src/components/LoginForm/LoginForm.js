import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../RegistrationForm/Registration.css';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

function LoginForm(props) {

    useEffect(() => {
        Aos.init({offset: 400,
            duration: 800});
      }, []);

    const [state , setState] = useState({
        email : "",
        password : "",
        successMessage: null
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        const payload={
            "email":state.email,
            "password":state.password,
        }
        axios.post(API_BASE_URL+'/user/login', payload)
            .then(function (response) {
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Login successful. Redirecting to home page..'
                    }))
                    localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token);
                    redirectToHome();
                    props.showError(null)
                }
                else if(response.code === 204){
                    props.showError("Username and password do not match");
                }
                else{
                    props.showError("Username does not exists");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToRegister = () => {
        props.history.push('/register'); 
        props.updateTitle('Register');
    }
    return(
        <div className="bodyofform" style={{ display: 'flex' }}>
        <div class="containerofform">
            <div class="contentofform" data-aos='fade-left'>
                <form>
                    <div class="user-details">
                        <div class="input-box">
                            <span class="details">Email</span>
                            <input type="email" id="email"
                                aria-describedby="emailHelp"
                                placeholder="Enter email"
                                value={state.email}
                                onChange={handleChange} required />
                        </div>
                        <div class="input-box">
                            <span class="details">Password</span>
                            <input type="text" id="password"
                                placeholder="Password"
                                value={state.password}
                                onChange={handleChange} required />
                        </div>
                    </div>

                    <div class="button">
                        <input type="submit" value="Register" onClick={handleSubmitClick}
                        />
                    </div>
                </form>
                <div className="already">
                <span>New Here? </span>
                <span className="loginText" onClick={() => redirectToRegister()}>Register Here!</span> 
            </div>
                <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            

            </div>
        </div>
    </div>
    )
}

export default withRouter(LoginForm);