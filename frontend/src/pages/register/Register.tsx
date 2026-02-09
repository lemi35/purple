import { useState } from "react";
import "./register.scss";
import { Link } from "react-router-dom";

const Register = () => {

    const baseurl = "http://localhost:3001"
    const [username, setUsername] = useState<null | string>(null)
    const [password, setPassword] = useState<null | string>(null)
    const [confirmPassword, setConfirmPassword] = useState<null | string>(null)
    const [registrationError, setRegistrationError] = useState<boolean>(false); 
    const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false); 
    const [errorMessage, setErrorMessage] = useState<string>(""); 

    const handleErrorTimer = (msg: string) => {
        setRegistrationError(true);
        setErrorMessage(msg)
        setTimeout(() => {
            setRegistrationError(false);
            setErrorMessage("")
        }, 3000)
    } 

    const handleSuccessTimer = () => {
        setRegistrationSuccess(true);
        setTimeout(() => {
            setRegistrationSuccess(false);
        }, 3000)
    } 

    const handleRegisterUser = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (password != confirmPassword) {
            handleErrorTimer("Passwords not matching.")
            return;
        }
        try {
            const response = await fetch(`${baseurl}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            })
            //const data = await response.json();
            handleSuccessTimer()
        } catch (error) {
            console.log(error);
            handleErrorTimer("An error happened during account creation.")
        }
    }


    return (
        <div className="register">
            <div className="register-card">
                <div >
                    <h2>Welcome to Purple!</h2>
                    {registrationSuccess &&
                    <div className="div-success">
                        Account succesfully created!
                    </div>
                    }
                    {registrationError &&      
                    <div className="div-error">
                        <h5>{errorMessage}</h5>
                    </div>
                    }
                <h2>Register</h2>
                <form onSubmit={(e) => handleRegisterUser(e)}>
                    <input onChange={(e) => {setUsername(e.target.value)}} type="text" placeholder="Username" />
                    <input onChange={(e) => {setPassword(e.target.value)}} type="password" placeholder="Password" />
                    <input onChange={(e) => {setConfirmPassword(e.target.value)}} type="password" placeholder="Password again" />
                    <button type="submit">Create a new account</button>   
                </form>  
                <hr/>
                <p>Already have an account?</p>
                <Link to="/login">
                    <button>Login</button>
                </Link>
                </div>
            </div>
        </div>
    )
}

export default Register