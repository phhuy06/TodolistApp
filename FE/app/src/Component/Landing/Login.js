import styles from './Login.module.css'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import jwt from 'jwt-decode'


export default function Login() {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    function handleData(data) {
        if (typeof data === "string") {
            localStorage.clear()
            localStorage.setItem('token', data) // Lưu JWT token vào localstorage
            console.log("login!");
            const decode = jwt(data)
            setTimeout(() => {
                localStorage.removeItem('token')
            }, decode.exp_day * 24 * 60 * 1000)
            navigate("/mainpage")
        }
        else {
            alert(data.detail)
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        const form = {
            account: name,
            password: password
        }

        fetch('http://13.229.94.222:3000/login', {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(form),
        })
            .then((res) => res.json())
            .then((data) => handleData(data))

    }

    return (
        <div className={styles.form}>
            <div className={styles.heading}>
                <h3>Đăng Nhập</h3>
            </div>
            <form onSubmit={(e) => handleSubmit(e)} className={styles.submitForm}>
                <label htmlFor={styles.username}>Tài Khoản</label>
                <input onChange={(e) => setName(e.target.value)} placeholder='Nhập Tài Khoản' className={styles.input} id={styles.username}></input>
                <label htmlFor={styles.password}>Mật Khẩu</label>
                <input onChange={(e) => setPassword(e.target.value)} placeholder='Nhập Mật Khẩu' className={styles.input} type='password' id={styles.password}></input>
                <input className={styles.submitButton} type="submit"></input>
            </form>
            <p>Bạn chưa có tài khoản? vui lòng bấm vào nút đăng ký</p>
        </div>
    )
}