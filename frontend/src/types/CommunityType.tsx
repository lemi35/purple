import TopicType from "./TopicType";

interface CommunityType {
  community_id: number;
  name: string;
  description?: string;
  image?: string;
  created_at: string;
  topics: TopicType[];
  username: string;
}

export default CommunityType;