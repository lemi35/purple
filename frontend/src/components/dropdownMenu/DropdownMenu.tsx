import "./dropdownMenu.scss";
import { useState, useContext } from "react";
import userContext from "../../contexts/UserContext";
import Icon from '@mdi/react';
import { mdiMenu } from '@mdi/js';
import { useNavigate } from "react-router-dom";
import { mdiLogin } from '@mdi/js';
import { mdiAccountSearch } from '@mdi/js';





const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { currentUser, logout } = useContext(userContext);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigation = (path: string) => {
        toggleDropdown();
        navigate(path);
    };

    return (
        <div className="dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
                <Icon path={mdiMenu} size={1} color="white" />
            </button>
            {isOpen && (
                <ul className="dropdown-menu">



                    {!currentUser ? (
                        <li className="dropdown-item" onClick={() => handleNavigation(('/login'))}>
                            <Icon path={mdiLogin} size={1} />
                            <p>Login | Register</p>
                        </li>
                    ) : (
                        <li className="dropdown-item" onClick={() => { toggleDropdown(); logout(); }}>
                            <Icon path={mdiLogin} size={1} />
                            <p>Logout</p>
                        </li>
                    )}
                    <li className="dropdown-item" onClick={() => handleNavigation(('/users'))}>
                        <Icon path={mdiAccountSearch} size={1} />
                        <p>Users Search</p>
                    </li>

                </ul>
            )}
        </div>
    );
};

export default DropdownMenu;