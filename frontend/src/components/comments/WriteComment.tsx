import { useState, ChangeEvent, FormEvent } from "react";
import CommentType from "../../types/CommentType";
import "./writeComment.scss";
import axios from "axios";

interface WriteCommentProps {
    postId: number;
    addComment: (newComment: CommentType) => void;
}

export default function WriteComment({ postId, addComment }: WriteCommentProps) {

    const initialState: CommentType = {
        comment_id: 1,
        user_id: 1,
        post_id: postId,
        created_at: "",
        content: "",
    }

    const baseurl = "http://localhost:3001";

    const [comment, setComment] = useState<CommentType>(initialState);
    //const [submit, setSubmit] = useState<CommentType>(initialState);

    function handleComment(e: ChangeEvent<HTMLTextAreaElement>) {
        e.preventDefault();
        setComment({ ...comment, content: e.target.value })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${baseurl}/comments`, comment, { withCredentials: true });
            console.log("Comment created:", response.data);

            // Add the new comment to the local state so it renders immediately
            addComment(response.data);

            // Reset the form
            setComment(initialState);
            /*if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the file input
            }*/
        } catch (error) {
            console.error("error submitting comment:", error)
        }

        //setSubmit(comment);
        //setComment(initialState);
        //console.log(submit.content)
    }
    return (
        <div className="commentForm">
            <form onSubmit={(e) => handleSubmit(e)}>
                <textarea
                    value={comment.content}
                    onChange={(e) => handleComment(e)}
                    name="writeComment"
                    id="writeComment"
                    rows={1}
                    placeholder="Write a comment. Be nice!" />
                <button type="submit">Send</button>
            </form>
        </div>

    )
}