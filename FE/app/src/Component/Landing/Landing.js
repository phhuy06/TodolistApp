import Register from './Register'
import Login from './Login'
import { useState } from 'react'
import clsx from 'clsx'
import styles from './Landing.module.css'


export default function Landing() {
    const [log, setLog] = useState(true);

    function handleRegister() {
        setLog(true)
    }

    return (
        <div className={styles.landing}>
            <div className={styles.logo}>
                <h3>Todo List Application</h3>
            </div>
            <div className={styles.block}>
                <div className={styles.sidebar}>
                    <div onClick={() => setLog(true)} className={clsx(styles.tologin, styles.side)}>
                        <h3>Đăng Nhập</h3>
                    </div>
                    <div onClick={() => setLog(false)} className={clsx(styles.tologout, styles.side)}>
                        <h3>Đăng Ký</h3>
                    </div>
                </div>
                {log ? <Login /> : <Register onRegister={handleRegister} />}
            </div>
        </div>
    )
}   