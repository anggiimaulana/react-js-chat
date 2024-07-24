import ChatList from "./chatList/ChatList"
import "./list.css"
import Userinfo from "./userInfo/Userinfo"

const list = () => {
  return (
    <div className="list">
        <Userinfo/>
        <ChatList/>
    </div>
  )
}

export default list
