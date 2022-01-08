import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Registration.css';
import { API_BASE_URL, ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

function RegistrationForm(props) {

    useEffect(() => {
        Aos.init({
            offset: 400,
            duration: 800
        });
    }, []);

    const [state, setState] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        successMessage: null
    })
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }
    const sendDetailsToServer = () => {
        if (state.email.length && state.password.length) {
            props.showError(null);
            const payload = {
                "email": state.email,
                "password": state.password,
            }
            axios.post(API_BASE_URL + '/user/register', payload)
                .then(function (response) {
                    if (response.status === 200) {
                        setState(prevState => ({
                            ...prevState,
                            'successMessage': 'Registration successful. Redirecting to home page..'
                        }))
                        localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
                        redirectToHome();
                        props.showError(null)
                    } else {
                        props.showError("Some error ocurred");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            props.showError('Please enter valid username and password')
        }

    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login');
    }
    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (state.password === state.confirmPassword) {
            sendDetailsToServer()
        } else {
            props.showError('Passwords do not match');
        }
    }
    return (
        <div className="bodyofform" style={{ display: 'flex' }}>
            <div class="containerofform">
                <div class="contentofform" data-aos='fade-left'>
                    <form>
                    
                        <div class="user-details">
                            <div class="input-box">
                                <span class="details">Email</span>
                                <input type="email" id="email"
                                    aria-describedby="emailHelp"
                                    value={state.email}
                                    onChange={handleChange}
                                    placeholder="Enter email" required />
                            </div>
                            <div class="input-box">
                                <span class="details">Password</span>
                                <input type="password" id="password"
                                    value={state.password}
                                    onChange={handleChange} placeholder="Password" required />
                            </div>
                            <div class="input-box">
                                <span class="details">Confirm Password</span>
                                <input type="password" id="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={state.confirmPassword}
                                    onChange={handleChange} required />
                            </div>
                        </div>

                        <div class="button">
                            <input type="submit" value="Register"
                                onClick={handleSubmitClick} />
                        </div>
                    </form>

                </div>
                <div style={{ display: state.successMessage ? 'inline-block' : 'none'}} role='alert'>
                    {state.successMessage}
                </div>
                
                <div className="already">
                    <span>Already have an account? </span>
                    <span className="loginText" onClick={() => redirectToLogin()}>Login here</span>
                </div>
            </div>



        </div>
    )
}

export default withRouter(RegistrationForm);