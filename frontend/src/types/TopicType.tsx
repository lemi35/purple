
interface TopicType {
  topic_id: number;
  title: string;
  image: string | null;
  description: string | null;
  created_at: string;
  ownerId: number | null;
  owner: {
    id: number;
    username: string;
  } | null;
}

export default TopicType;