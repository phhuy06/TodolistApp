import styles from './Register.module.css'
import { useState } from 'react' 

export default function Register({ onRegister }) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    function handleError(data){
        if(typeof data === "string"){
            setError(data);
        }
        else{
            alert("Register Success!, plese login")
            onRegister()
        }
    }


    function handleSubmit(e){
        e.preventDefault()

        const email_validation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const password_validation = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if(!email_validation.test(email)){
            return setError("Email invalid");
        }
        if(!password.match(password_validation)){
            return setError("Password between 7 to 15 characters, contain at least one number and a special character")
        }
        const form ={
            account: name,
            email: email,
            password: password
        }
        fetch('http://13.229.94.222:3000/register', {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(form),
        })
        .then((res) => res.json())
        .then((data) => handleError(data))
    }

    return (
        <div className={styles.form}>
            <div className={styles.heading}>
                <h3>Đăng Ký</h3>
            </div>
            <form onSubmit={(e) => handleSubmit(e)} className={styles.submitForm}>
                <label htmlFor={styles.username}>Tài Khoản</label>
                <input onChange={(e) => {setName(e.target.value); setError("")}} placeholder='Nhập Tài Khoản' className={styles.input} id={styles.username}></input>
                <label htmlFor={styles.email}>Email</label>
                <input onChange={(e) => {setEmail(e.target.value); setError("")}} placeholder='Nhập Email' className={styles.input} id={styles.email}></input>
                <label htmlFor={styles.password}>Mật Khẩu</label>
                <input onChange={(e) => {setPassword(e.target.value); setError("")}} placeholder='Nhập Mật Khẩu' className={styles.input} type='password' id={styles.password}></input>
                <input className={styles.submitButton} type="submit"></input>
                <span className={styles.error}>{error}</span>
            </form>
            <p>Bạn đã có tài khoản? vui lòng bấm đăng nhập.</p>
        </div>
    )
}
