import { useState } from "react";
import "./changePassword.scss";

import * as React from "react";

const ChangePassword = () => {

    const baseurl = "http://localhost:3001"
    const [oldPassword, setOldPassword] = useState<null | string>(null)
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

    const handleRegisterUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (password != confirmPassword) {
            handleErrorTimer("Passwords not matching.")
            return;
        }
        try {
            const response = await fetch(`${baseurl}/users/update`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "currentPassword": oldPassword,
                    "password": password
                })
            })
            const data = await response.json();
            console.log(data);
            handleSuccessTimer()
        } catch (error) {
            console.log(error);
            handleErrorTimer("An error happened.")
        }
    }


    return (
        <div className="change-password-container">
            {registrationSuccess &&
                <div className="div-success">
                    Password successfully changed!
                </div>
            }
            {registrationError &&
                <div className="div-error">
                    {errorMessage}
                </div>
            }
            <h2>Change Password</h2>
            <form onSubmit={(e) => handleRegisterUser(e)}>
                <input
                    onChange={(e) => { setOldPassword(e.target.value) }}
                    type="password"
                    placeholder="Current password"
                />
                <input
                    onChange={(e) => { setPassword(e.target.value) }}
                    type="password"
                    placeholder="New password"
                />
                <input
                    onChange={(e) => { setConfirmPassword(e.target.value) }}
                    type="password"
                    placeholder="New password again"
                />
                <button type="submit">Update Password</button>
            </form>
        </div>
    )
}

export default ChangePassword