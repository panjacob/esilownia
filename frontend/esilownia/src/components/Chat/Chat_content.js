import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from "../Axios/Axios";
import photo from '../../imgs/basic_profile_photo.jpg'
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import axios_variebles from "../Axios/Axios_variebles";

function ChatContent() {

    const [users, setUsers] = useState([])
    const [msgs, setMsgs] = useState([])
    const [msgs2, setMsgs2] = useState([])
    const [msgsNew, setMsgsNew] = useState([])
    const [msgToSend, setMsgToSend] = useState('')
    const [myId, setMyId] = useState('')
    const [userId, setUserId] = useState('')

    const [time, setTime] = useState('')

    useEffect(() => {

        axiosInstance
            .post(`/users/info/`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                }
            })
            .then((res) => {
                setMyId(res.data.id)
            });

        axiosInstance
            .post(`/message/users`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                }
            })
            .then((res) => {
                setUsers([])

                res.data.map((user) => {
                    axiosInstance
                        .post(`/users/get/`, {id: user}, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                            }
                        })
                        .then((res2) => {
                            setUsers(users => [...users, res2.data])
                        });
                })
            });

    }, []);

    useEffect(() => {
        var objDiv2 = document.getElementById("msgBox");
        objDiv2.scrollTo(0, 1000000)
    }, [msgs]);

    function msToTime(t) {

        let time_send = new Date()
        time_send.setTime(t)
        let time_now = Date.now()
        let duration = time_now - time_send;

        var minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
            days = Math.floor((duration / (1000 * 60 * 60 * 24)));

        if (hours === 0 && minutes === 0) {
            return 'Chwilę temu';
        }
        if (hours === 0) {
            return minutes + " min. temu";
        }
        if (days === 0) {
            return hours + " godz. temu";
        }
        if (days > 0) {
            if (days === 1) {
                return days + " dzień temu"
            } else {
                return days + " dni temu"
            }
        }
    }

    useEffect(()=>{
        var handle=setInterval(update,1000);

        return ()=>{
            clearInterval(handle);
        }
    });

    function update(){

        if(userId !== "") {
            setMsgsNew([]);
            axiosInstance
                .post(`/message/get`, {user: userId, begin: 0, end: 1000}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                    }
                })
                .then((res) => {
                    res.data.messages.map((message) => {
                        setMsgsNew(msgsNew => [...msgsNew, message])
                    })
                    if (msgsNew.length > 0 && JSON.stringify(msgsNew) !== JSON.stringify(msgs) ) {
                        setMsgs(msgsNew)
                        console.log('test')
                    }
                });
        }
    }

    function getMsgs(e) {
        setMsgs([]);

        console.log(e.currentTarget.id)

        setMsgToSend('')
        setUserId(e.currentTarget.id)


        axiosInstance
            .post(`/message/get`, {user: e.currentTarget.id, begin: 0, end: 1000}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                }
            })
            .then((res) => {
                res.data.messages.map((message) => {
                    setMsgs2(msgs => [...msgs, message])
                })
                setMsgs( msgs2 => [...msgs2])
            });

        var divItems = document.getElementsByClassName("user-wrapper");
        for(var i=0; i < divItems.length; i++) {
            var item = divItems[i];
           item.style.backgroundColor = 'white';
        }
        e.currentTarget.style.backgroundColor = 'orange';

    }

    function sendMsg(){

        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token'));
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("receiver", userId);
        urlencoded.append("message", msgToSend);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(axios_variebles.baseURL +  "message/send", requestOptions)
            .then(response => response.text())
            .then((result) => {})
            .catch(error => console.log('error', error));

        setMsgToSend('')
    }

    return (
        <div className="chatContent">
            <div className="container">

                <div className='row mt-3 mb-3'>
                    <div className='col-lg-4 border' style={{overflowY: 'scroll', minHeight: '750px'}}>
                        {users.map((user, idx) => {
                            if(user.id !== myId) {
                                return (
                                    <div key={idx} className='m-1 border border-dark'>
                                        <div className='p-2 user-wrapper' id={user.id} onClick={getMsgs.bind(this)}>
                                            <div id='chat-user-wrapper'>
                                                <div id='chat-user-photo'>
                                                    {(user.profile_photo === null) ? (
                                                        <img src={photo} alt="..." className="img-thumbnail"
                                                             width='100px'
                                                             height='100px'/>
                                                    ) : (
                                                        <img src={axios_variebles.baseURL.slice(0, -1) + user.profile_photo} alt="..."
                                                             className="img-thumbnail"
                                                             width='200px'
                                                             height='200px'/>
                                                    )}
                                                </div>
                                                <div className='align-middle align-self-auto'
                                                     id='chat-user-name'>{user.first_name} {user.last_name}</div>
                                                <div className='align-middle align-self-auto'
                                                     id='chat-user-lastMsg'>{user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <div className='col-lg-8 border'>

                        <div id='msgBox' style={{overflowY: 'scroll', minHeight: '675px', maxHeight:'675px'}}>
                            <div id='innerMsgBox'>
                            {msgs.map((msg, idx) => {
                                if(msg.sender.toString() === myId.toString() && msg.receiver.toString() === userId.toString()) {
                                    return (
                                        <div key={idx} className='m-1 p-1' style={{width:'75%', float:'right', wordBreak: 'break-word'}}>
                                            <p className='mb-1 p-2 pl-4 pr-4 border rounded' style={{margin: '0', float:'right', color:'white', backgroundColor:'Orange'}}>{msg.message}</p>
                                            <br/>
                                            <br/>
                                            <p style={{margin: '0', float:'right', color:'grey'}}>{msToTime(msg.time)}</p>
                                        </div>
                                    )
                                }
                                if(msg.receiver.toString() === myId.toString() && msg.sender.toString() === userId.toString()) {
                                    return (
                                        <div key={idx} className='m-1 p-1' style={{width:'75%', float:'left', wordBreak: 'break-word'}}>
                                            <p className='mb-1 p-2 pl-4 pr-4 border rounded' style={{margin: '0', float:'left', color:'white', backgroundColor:'Gray'}}>{msg.message}</p>
                                            <br/>
                                            <br/>
                                            <p style={{margin: '0', float:'left', color:'grey'}}>{msToTime(msg.time)}</p>
                                        </div>
                                    )
                                }
                            })}
                            </div>
                        </div>

                        <div className='pt-2 pb-2' style={{width:'100%', minHeight:'75px'}}>

                            <div className='row border pt-2 pb-2 my-auto mx-auto'>
                                <div className='col-9'>
                                    <Form.Control
                                        type="text"
                                        value={msgToSend}
                                        onChange={(e) => setMsgToSend(e.target.value)}
                                    />
                                </div>
                                <div className='col-3 text-center'>
                                    <Button onClick={sendMsg}>Wyślij</Button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default ChatContent;