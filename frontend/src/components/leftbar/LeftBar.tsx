
import Icon from '@mdi/react';
import {
  mdiHomeOutline,
  mdiAccountOutline,
  mdiAccountMultipleOutline,
  mdiAccountSearch,
  mdiAccountGroupOutline,
} from '@mdi/js';
import { Link } from "react-router-dom";
import "./leftBar.scss";
import { useEffect, useState } from 'react';
import axios from 'axios';
import CommunityType from '../../types/CommunityType';

const LeftBar = () => {

    const baseurl = "http://localhost:3001"
    const [/*topics*/, setTopics] = useState([])
    const [/*communities*/, setCommunities] = useState<CommunityType[]>([])

    useEffect(() => {
        const fetchTopics = async () => {
            const response = await axios.get(`${baseurl}/topics`)
            setTopics(response.data)
        }
        fetchTopics()
    }, [])

    useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get<CommunityType[]>(`${baseurl}/communities`);
        setCommunities(response.data);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };
    fetchCommunities();
  }, []);

    return (
        <div className="leftBar">
            <div className="container">
                <div className="menu">
                    <div className="item">
                        <Link to="/">
                            <Icon path={mdiHomeOutline} size={1} />
                            <span>Home</span>
                        </Link>
                    </div>
                    <div className="item">
                        <Link to="/profile/my">
                            <Icon path={mdiAccountOutline} size={1}/>
                            <span>My Profile</span>
                        </Link>
                    </div>
                    <div className="item">
                        <Link to="/friends">
                            <Icon path={mdiAccountMultipleOutline} size={1} />
                            <span>Friends</span>
                        </Link>
                    </div>
                   
                </div>

                <hr/>

                <div className='menu'>
                    <div className="item">
                        <Link to="/topic">
                        <Icon path={mdiAccountSearch} size={1} />
                            <span>Topics</span>
                        </Link>                    
                    </div>
                    <div className="item">
                        <Link to="/communities">
                        <Icon path={mdiAccountGroupOutline} size={1} />
                            <span>Groups</span>
                        </Link>                    
                    </div>
                    
                </div>
                <hr />
                <div className='menu'>
                    <div className="item">
                        <Link to="/login">
                            <Icon path={mdiAccountOutline} size={1} />
                                <span>Login</span>
                        </Link>
                    </div>   
                    <div className='item'>
                        <Link to="/register">
                            <Icon path={mdiAccountOutline} size={1} />
                                <span>Register</span>  
                        </Link>                        
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default LeftBar;