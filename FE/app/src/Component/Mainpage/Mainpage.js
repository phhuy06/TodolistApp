import { useState, useRef, useEffect } from "react"
import styles from './Mainpage.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faRightFromBracket, faGear, faX } from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import jwt from "jwt-decode"



export default function Mainpage() {
    const navigate = useNavigate();
    const [avatarclick, setAvatarclick] = useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [todolist, setTodolist] = useState([]);
    const [work, setWork] = useState("");
    const [time, setTime] = useState("");
    const [errormsg, setErrormsg] = useState();
    const ref = useRef();


    function handleClickout() {
        if (avatarclick) {
            setAvatarclick(false);
        }
    }

    function handleLogout() {
        localStorage.clear()
        navigate('/')
    }

    function handleAdd() {
        
        if(work === ""){
            return setErrormsg("Hãy nhập công việc của bạn!");
        }
        const token = localStorage.getItem('token');
        const decode = jwt(token)
        let timedefault = time
        if(timedefault === ""){
            timedefault = "...-...";
        }
        const todo = {
            work: work,
            time: timedefault
        };
        const datasend = {
            work: work,
            account: decode.account,
            day: format(startDate,'yyyy-MM-dd'),
            time: timedefault
        }
        fetch("http://13.229.94.222:8000/create_work",{
            method:"POST",
            body: JSON.stringify(datasend),
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer ".concat(token)
            }
        })
        setTodolist(prev => [...prev, todo]);
        setWork("");
        setTime("");
        ref.current.focus();
    }

    useEffect(()=>{
        const token = localStorage.getItem('token');
        const decode = jwt(token)
        fetch(`http://13.229.94.222:8000/list_works?day=${format(startDate,'yyyy-MM-dd')}&account=${decode.account}`,{
            method:"GET",
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer ".concat(token)
            }
        })
        .then((res) => res.json())
        .then((data) => setTodolist(data))
    }, [startDate])

    function handleRemovework(todo){

        const token = localStorage.getItem('token');
        const decode = jwt(token)        

        const datasend = {
            account: decode.account,
            day: format(startDate,'yyyy-MM-dd'),
            work: todolist[todo].work
        }
        fetch("http://13.229.94.222:8000/delete_works",{
            method:"DELETE",
            body: JSON.stringify(datasend),
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer ".concat(token)
            }
        })
        setTodolist(prev => prev.filter((work, ind) => ind !== todo));
    }

    // function handleDatepick(date){
    //     const token = localStorage.getItem('token');
    //     const decode = jwt(token)
    //     fetch(`http://127.0.0.1:8000/list_works?day=${format(date,'yyyy-MM-dd')}&account=${decode.account}`,{
    //         method:"GET",
    //         headers: {
    //             "content-type": "application/json",
    //             Authorization: "Bearer ".concat(token)
    //         }
    //     })
    //     .then((res) => res.json())
    //     .then((data) => setTodolist(data))
    // }

    return (
        <div onClick={() => handleClickout()} className={styles.mainpage}>
            <div className={styles.logo}>
                <h3>Todo List Application</h3>
            </div>
            <div onClick={() => setAvatarclick(!avatarclick)} className={styles.avatar}>
                <FontAwesomeIcon icon={faUser} />
                <div className={clsx({ [styles.avatarNavigationshow]: avatarclick }, styles.avatarNavigation)}>
                    <div className={styles.navitem}>
                        <FontAwesomeIcon icon={faGear} className={styles.icons} />
                        <p>Cài Đặt</p>
                    </div>
                    <div onClick={() => handleLogout()} className={styles.navitem}>
                        <FontAwesomeIcon icon={faRightFromBracket} className={styles.icons} />
                        <p>Đăng Xuất</p>
                    </div>
                </div>
            </div>
            <div className={styles.body}>
                <div className={styles.datepicker}>
                    <p>Chọn ngày:</p>
                    <DatePicker dateFormat='dd/MM/yyyy' className={styles.calendar} selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
                <div className={styles.input}>
                    <input ref={ref} value={work} onChange={(e) => {setWork(e.target.value); setErrormsg("")}} placeholder="Bạn muốn làm gì hôm nay?"></input>
                    <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Nhập thời gian VD: 16h-16h30"></input>
                    <button onClick={() => handleAdd()}>Thêm</button>
                </div>
                <span className={styles.errormsg}>{errormsg}</span>
                <div className={styles.todolist}>
                    <ul>
                        {todolist.map((todo, ind) => (
                            <li className={styles.works} key={ind}>{todo.work} <p className={styles.time}>{todo.time}</p> <FontAwesomeIcon onClick={() => handleRemovework(ind)} className={styles.deleteWork} icon={faX} /></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}