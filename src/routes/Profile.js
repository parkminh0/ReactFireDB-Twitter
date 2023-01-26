import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const Profile = ({refreshUser, userObj}) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
    };
    const getMytweets = async () => {
        const q = query(
            collection(dbService, "tweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("CreatedAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
        });
    }
    useEffect(() => {
        getMytweets();
    }, [])
    const onChange = (event) => {
        setNewDisplayName(event.target.value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser,{
                displayName: newDisplayName
            });
            refreshUser();
        }
    }
    return(
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input 
                    onChange={onChange} 
                    value={newDisplayName} 
                    type="text" 
                    placeholder="Display name"
                    autoFocus
                    className="formInput"
                />
                <input 
                    type="submit" 
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    )
}

export default Profile;