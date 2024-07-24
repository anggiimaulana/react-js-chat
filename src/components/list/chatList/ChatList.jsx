import "./chatList.css"
import { useEffect, useState } from "react";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
    const [chats, setChats] = useState([]); 
    const [addMode, setAddMode] = useState(false); 
    const [input, setInput] = useState("")

    const { currentUser } = useUserStore(); // Mengambil user saat ini dari user store
    const { changeChat, chatId } = useChatStore(); // Mengambil fungsi untuk mengubah chat dan id chat dari chat store

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data().chats; // Mendapatkan data chat dari database

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef); // Mengambil data user dari database

                const user = userDocSnap.data();

                return { ...item, user }; // Menggabungkan data chat dengan data user
            });
            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt)); // Mengurutkan chat berdasarkan waktu update terbaru
        });

        return () => {
            unSub(); 
        };
    }, [currentUser.id]);

    const handleSelect = async (chat) => {
        const userChats = chats.map((item) => {
            const { user, ...rest } = item;
            return rest;
        });

        const chatIndex = userChats.findIndex(
            (item) => item.chatId === chat.chatId
        );

        userChats[chatIndex].isSeen = true; // Menandai chat sebagai sudah dilihat

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userChats,
            });
            changeChat(chat.chatId, chat.user); // Mengubah chat aktif
        } catch (err) {
            console.log(err); // Menangani error jika terjadi
        }
    };

    const filteredChats = chats.filter((c) => 
        c.user.username.toLowerCase().includes(input.toLowerCase())
    )

    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder="Search" onChange={(e) => setInput(e.target.value)}/>
                </div>
                <img 
                    src={addMode ? "./minus.png" : "./plus.png"} 
                    alt=""  
                    className="add"
                    onClick={() => setAddMode((prev) => !prev)} // Mengubah mode tambah user
                />
            </div>
            {filteredChats.map((chat) => (
                <div 
                    className="item" 
                    key={chat.chatId} 
                    onClick={() => handleSelect(chat)}
                    style={{ backgroundColor: chat?.isSeen ? "transparent" : "#5183fe" }} // Mengatur background chat berdasarkan status dilihat
                >
                    <img src={ chat.user.blocked.includes(currentUser.id) 
                        ? "./avatar.png" 
                        : chat.user.avatar || "./avatar.png"} 
                        alt="" 
                    />
                    <div className="texts">
                        <span>{ chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            
            {addMode && <AddUser />} {/* Menampilkan komponen tambah user jika dalam mode tambah */}
        </div>
    );
};

export default ChatList;
