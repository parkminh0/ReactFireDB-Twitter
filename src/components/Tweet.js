import React from "react";
import { doc, deleteDoc, updateDoc }from"firebase/firestore";
import { dbService } from "fbase";
import { useState } from "react";
import { storageService } from "fbase";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Tweet = ({tweetObj, isOwner}) => {
    const updateTweet = doc(dbService, "tweets", `${tweetObj.id}`);
    const updateImg = ref(storageService, tweetObj.attachmentUrl);
    const [edit, setEdit] = useState(false);
    const [newTweet, setNewTweet] = useState(tweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this tweet?");
        if(ok){
            await deleteDoc(updateTweet);
            await deleteObject(updateImg);
        }
    };
    const onEditClick = () => {
        setEdit((prev) => !prev);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(updateTweet, {
            text: newTweet,
        });
        setEdit(false);
    }
    const onChange = (event) => {
        const {
            target:{value}
        } = event;
        setNewTweet(value);
    }
    return (
        <div className="tweet">
            { edit ? (
                <div>
                    <form onSubmit={onSubmit} className="container tweetEdit">
                        <input 
                            onChange={onChange} 
                            type="text" 
                            placeholder="Edit your tweet" 
                            value={newTweet} 
                            required
                            autoFocus
                            className="formInput"
                        />
                        <input 
                            type="submit" 
                            value="Update Tweet"
                            className="formBtn"
                        />
                    </form> 
                    <span onClick={onEditClick} className="formBtn cancelBtn">
                        Cancel
                    </span>
                </div>
            ) : ( 
                <div>
                    <h4>{tweetObj.text}</h4>
                    {tweetObj.attachmentUrl && <img alt="preview" src={tweetObj.attachmentUrl}/>}
                    {isOwner && (
                        <div class="tweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </span>
                            <span onClick={onEditClick}>
                                <FontAwesomeIcon icon={faPencilAlt}/>
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Tweet;