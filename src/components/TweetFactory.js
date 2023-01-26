import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const TweetFactory = ({ userObj }) => {
    const fileInput = useRef();
    const [tweet, setTweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        if(tweet === ""){
            return;
        }
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== ""){ 
            const fileRef = ref(storageService,`${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(fileRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        }
        const tweetObj = {
            text: tweet, //tweet = tweet
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await addDoc(collection(dbService, "tweets"), tweetObj);
        setTweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const {
            target: {value}
        } = event;
        setTweet(value);
    };
    const onFileChange = (event) => {
        const {
            target: {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    const onDeletePhoto = () => {
        setAttachment("");
        fileInput.current.value = null;
    }
    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">            
                <input 
                    className="factoryInput__input"
                    value={tweet} 
                    onChange={onChange} 
                    type="text" 
                    placeholder="What's on your mind?" 
                    maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow"/>
            </div>
            <label for="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus}/>
            </label>
            <input
                id="attach-file" 
                type="file" 
                accept="image/*" 
                onChange={onFileChange} 
                ref={fileInput}
                style={{
                    opacity: 50,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img 
                        alt="preview" 
                        src={attachment} 
                        style={{
                            backgrondImage:attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onDeletePhoto}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes}/>
                    </div>
                </div>
            )}
        </form>
    );
};

export default TweetFactory;