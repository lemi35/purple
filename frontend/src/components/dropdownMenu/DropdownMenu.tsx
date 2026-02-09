import "./dropdownMenu.scss";
import { useState } from "react";
import Icon from '@mdi/react';
import { mdiMenu } from '@mdi/js';
import { useNavigate } from "react-router-dom";
import { mdiAccountOutline } from '@mdi/js';
import { mdiLogin } from '@mdi/js';
import { mdiAccountSearch } from '@mdi/js';





const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsOpen (!isOpen);
    };

    const handleNavigation = (path: string) => {
        toggleDropdown();
        navigate(path);
    };

    return (
        <div className="dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
                <Icon path={mdiMenu} size={1} color="white"/>
            </button>
            {isOpen && (                   
            <ul className="dropdown-menu">
                
                
                <li className="dropdown-item" onClick={() => handleNavigation(('/login'))}>
                    <Icon path={mdiLogin} size={1} />
                    <p>Login | Register</p>
                </li>
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