import { useState } from "react";
import { mdiArrowUpBoldOutline } from '@mdi/js';
import { mdiArrowUpBold } from '@mdi/js';
import { mdiArrowDownBoldOutline } from '@mdi/js';
import { mdiArrowDownBold } from '@mdi/js';
import axios from "axios";
import Icon from "@mdi/react";
import "./votingButtons.scss"

const VotingButtons: React.FC<{ upvotes: number, downvotes: number, post_id: number }> = ({ upvotes, downvotes, post_id }) => {
  //state of buttons
  const [upVoted, setUpVoted] = useState(false);
  const [downVoted, setDownVoted] = useState(false);

  //number of votes
  const [upVotesN, setUpVotesN] = useState(upvotes);
  const [downVotesN, setDownVotesN] = useState(downvotes);

  const voteSum = upVotesN - downVotesN;

  const baseurl = "http://localhost:3001";

  const updateVotes = async (newUpvotes: number, newDownvotes: number) => {
    try {
      await axios.put(`${baseurl}/posts/${Number(post_id)}/vote`, {
        upvotes: newUpvotes,
        downvotes: newDownvotes
      });
    } catch (error) {
      console.error("Error updating votes:", error);
    }
  }

  function toggleUpVote(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    const newUpVoted = !upVoted;
    setUpVoted(newUpVoted);

    const newUpvotesN = newUpVoted ? upVotesN + 1 : upVotesN - 1;
    setUpVotesN(newUpvotesN);
    updateVotes(newUpvotesN, downVotesN);
  }


  function toggleDownVote(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    const newDownVoted = !downVoted;
    setDownVoted(newDownVoted);

    const newDownVotesN = newDownVoted ? downVotesN + 1 : downVotesN - 1;
    setDownVotesN(newDownVotesN);
    updateVotes(upVotesN, newDownVotesN);
  }

  return (
    <div className="votes">

      <button onClick={(e) => toggleUpVote(e)}
        disabled={downVoted}>
        {upVoted
          ? <Icon path={mdiArrowUpBold} size={1.2} />
          : <Icon path={mdiArrowUpBoldOutline} size={1.2} />}
      </button>
      {voteSum}
      <button onClick={(e) => toggleDownVote(e)}
        disabled={upVoted}>
        {downVoted
          ? <Icon path={mdiArrowDownBold} size={1.2} />
          : <Icon path={mdiArrowDownBoldOutline} size={1.2} />}
      </button>

    </div>
  );

}

export default VotingButtons;