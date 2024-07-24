import Chat from "./components/chat/Chat"
import Login from "./components/login/Login"
import List from "./components/list/List"
import Detail from "./components/detail/Detail"
import Notification from "./components/notification/Notification"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userStore"
import { useChatStore } from "./lib/chatStore"


const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore()
  const { chatId } = useChatStore()

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid)
    })

    return () => {
      unSub()
    }
  }, [fetchUserInfo])

  // console.log(currentUser)

  if (isLoading) return <div className="loading">Sabar bro</div>

  

  return (
    <div className='container'>
      {currentUser ? (
        <>
          <List/>
          {chatId && <Chat/>}
          {chatId && <Detail/>}
        </>
      ) : (
        <Login/>
      )}
      <Notification/>
    </div>
  )
}

export default App