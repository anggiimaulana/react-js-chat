import "./login.css"
import { useState } from "react"
import { toast } from "react-toastify"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import upload from "../../lib/upload"

const Login = () => {

    const [avatar, setAvatar] = useState ({
        file:null,
        url:""
    })

    const handleAvatar  = e => {
        if (e.target.files[0]) {
            setAvatar({
                file:e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const [loading, setLoading] = useState(false)

    const handleRegister = async e => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)

        const { username, email, password } = Object.fromEntries(formData)

        try {

            const res = await createUserWithEmailAndPassword(auth,  email, password)

            const imgUrl = await upload(avatar.file)

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                id: res.user.uid,
                email,
                avatar: imgUrl,
                password,
                blocked: [],
            })


            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
            })

            toast.success("Akun berhasil dibuat! Silahkan login")
        } catch(err) {
            console.log(err)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    } 

    const handleLogin = async e => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)

        const { email, password } = Object.fromEntries(formData)

        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch(err) {
            console.log(err)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login">
            <div className="item">
                <h2>Selamat datang</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Masukan email" name="email"/>
                    <input type="password" placeholder="Masukan pasword" name="password" />
                    <button disabled={loading}>{loading ? "Loading" : "Login"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
            <h2>Daftar akun</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="" />
                        Masukan foto diri sendiri</label>
                    <input type="file" 
                        id="file" 
                        style={{display: "none"}}
                        onChange={handleAvatar}
                    />
                    <input type="text" placeholder="Masukan nama" name="username"/>
                    <input type="email" placeholder="Masukan email" name="email"/>
                    <input type="password" placeholder="Masukan pasword" name="password" />
                    <button disabled={loading}>{loading ? "Loading" : "Daftar akun"}</button>
                </form>
            </div>
        </div>
    )
}

export default Login
