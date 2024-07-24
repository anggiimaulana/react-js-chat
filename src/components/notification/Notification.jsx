import { ToastContainer } from "react-toastify"
import "./notification.css"
import "react-toastify/dist/ReactToastify.css"

const Notification = () => {
    return (
        <div className="notification">
            <ToastContainer position="bottom-right"/>
        </div>
    )
}

export default Notification
