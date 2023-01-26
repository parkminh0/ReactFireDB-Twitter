import AppRouter from "./Router";
import { useState, useEffect } from "react";
import { authService } from "../fbase";
import { updateProfile } from "firebase/auth";

function App() {
  const [init, setInit]= useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user){
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(user, {
            displayName: user.displayName
          }),
        });
      } else{
        setUserObj(null);
      }
      user ? setUserObj(user) : setUserObj(null);
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => updateProfile(user, {
        displayName: user.displayName
      }),
    });
  }
  return (
    <div>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj}/> : "Initializing...."}
      <footer>&copy; {new Date().getFullYear()} Twitter</footer>
    </div>
  );
}

export default App;
