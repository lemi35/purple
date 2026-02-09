import { useState } from "react";
import "./deleteAccount.scss";
import { useNavigate } from "react-router-dom";

import * as React from "react";

const DeleteAccount = () => {

    const navigate = useNavigate()
    const baseurl = "http://localhost:3001"
    const [registrationError, setRegistrationError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

    const handleErrorTimer = (msg: string) => {
        setRegistrationError(true);
        setErrorMessage(msg)
        setTimeout(() => {
            setRegistrationError(false);
            setErrorMessage("")
        }, 3000)
    }

    const handleRegisterUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("delete account")
        try {
            const response = await fetch(`${baseurl}/users/remove`, {
                method: "DELETE",
                credentials: "include"
            })
            const data = await response.json();
            console.log(data);
            //handleSuccessTimer()
            console.log("done")
            navigate("/")
        } catch (error) {
            console.log(error);
            handleErrorTimer("An error happened.")
        }
    }


    return (
        <div className="delete-account-container">
            {registrationError &&
                <div className="div-error">
                    {errorMessage}
                </div>
            }
            <h2>{confirmDelete ? "Confirm Deletion" : "Delete Account"}</h2>
            {confirmDelete && <p className="confirm-text">Are you sure you want to delete your account? This action cannot be undone.</p>}
            <form onSubmit={(e) => handleRegisterUser(e)}>
                {confirmDelete && <input type="text" placeholder="Type username to confirm" required />}
                <div className="button-group">
                    {!confirmDelete ? (
                        <button type="button" className="delete-btn" onClick={() => setConfirmDelete(true)}>Delete Account</button>
                    ) : (
                        <>
                            <button type="submit" className="confirm-btn">Confirm Delete</button>
                            <button type="button" className="cancel-btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
                        </>
                    )}
                </div>
            </form>
        </div>
    )
}

export default DeleteAccount