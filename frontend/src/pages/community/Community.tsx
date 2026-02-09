import axios from 'axios'
import { useEffect, useState } from 'react'
import CommunityComponent from '../../components/communityComponent/communityComponent';
import CommunityType from '../../types/CommunityType';
import CommunityCreate from '../../components/communityCreate/communityCreate';
import "./community.scss"


const Community = () => {
  const baseurl = import.meta.env.VITE_API_URL;
  //const baseurl = "http://localhost:3001"
  const [communities, setCommunities] = useState<CommunityType[]>([]);

  useEffect(() => {
    const fetchCommunityIfAvailable = async () => {
      try {
        const response = await axios.get(`${baseurl}/communities`)
        setCommunities(response.data)
      } catch (error) {
        console.log("Error fetching communities", error)
      }
    }
    fetchCommunityIfAvailable()
    
  }, [])

  return (
    <div className="div-community">
      <CommunityCreate />
      {communities.length === 0 && <p>No communities found</p>}
      {communities.map((community) => (
        <CommunityComponent
          key={community.community_id}
          community_id={community.community_id}
          name={community.name}
          description={community.description ?? ""}
          image={community.image ?? null }
          username={community.username}
        />
      ))}
    </div>
  )
}

export default Community;