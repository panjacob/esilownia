import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from "../Axios/Axios";
import Button from "react-bootstrap/Button";
import axios_variebles from "../Axios/Axios_variebles";
import trashIcon from "../../imgs/trash-10-16.png";
import {BsShield} from "react-icons/bs";
import {Link} from "react-router-dom";



function ForumTopicsList() {

    const [topicsList, setTopicsList] = useState([])
    const [userList, setUserList] = useState([])
    const [newTopic, setNewTopic] = useState('')
    const [newTopicDescription, setNewTopicDescription] = useState('')
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {

        axiosInstance
            .post(`/forum/topic/all`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                }
            })
            .then((res) => {

                res.data.map((topic) => {

                    axiosInstance
                        .post(`/users/get/`, {id: topic.owner}, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                            }
                        })
                        .then((res) => {
                            setUserList(userList => [...userList, res.data])
                        });

                })

                setTopicsList(res.data)
            });

        axiosInstance
            .post(`/users/info/`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                }
            })
            .then((res) => {
                setCurrentUser(res.data)
            });

    }, []);

    function uniqBy(a, key) {
        var seen = {};
        return a.filter(function (item) {
            var k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        })
    }

    const handleSubmitData = (e) => {
        e.preventDefault();

        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token'));

        var formdata = new FormData();
        formdata.append("title", newTopic);
        formdata.append("body", newTopicDescription);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(axios_variebles.baseURL + "forum/topic/create", requestOptions)
            .then(response => {
                response.text();
                window.location.reload();
            })
            .then(result => {
                //window.location.reload();
            })
            .catch(error => console.log('error', error));
    }

    const handleDeleteTopic = (e) => {
        e.preventDefault();
        //console.log(e.target.id)

        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token'));

        var formdata = new FormData();
        formdata.append("id", e.target.id);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(axios_variebles.baseURL + "forum/topic/remove", requestOptions)
            .then(response => response.text())
            .then(result => {
                window.location.reload()
            })
            .catch(error => console.log('error', error));

    }

    return (
        <div className="forumTopicsList">
            <div className="container">

                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="wrapper wrapper-content animated fadeInRight">
                                <div className="p-2 pl-4 mb-3 mt-2 border shadow">
                                        <div className="pull-left mr-2">
                                            <div className='row'>
                                                <div className='col'>
                                                    <h2>Dodaj Temat</h2>
                                                    <hr/>
                                                    <div className='container  justify-content-center p-3'>
                                                        <div className='row justify-content-center'>
                                                            <div className="col-sm-4 p-1">
                                                                <div className="col-sm-12">
                                                                    <h6 className="mb-0">Nazwa Tematu</h6>
                                                                </div>
                                                                <div className="col-sm-12 text-secondary">
                                                                    <input type="text" className="form-control form-control-sm" placeholder='Nazwa'
                                                                           onChange={(e) => setNewTopic(e.target.value)}/>
                                                                </div>
                                                            </div>

                                                            <div className="col-sm-8 p-1">
                                                                <div className="col-sm-12">
                                                                    <h6 className="mb-0">Opis Tematu</h6>
                                                                </div>
                                                                <div className="col-sm-12 text-secondary">
                                                                    <input type="text" className="form-control form-control-sm" placeholder='Opis'
                                                                           onChange={(e) => setNewTopicDescription(e.target.value)}/>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="col pt-2 pb-2">
                                                            <Button onClick={handleSubmitData} variant="btn" size="sm">Utwórz</Button>
                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                </div>

                                <div className="forum-container border shadow">

                                    <div className="forum-title">
                                        <h3>Tematy</h3>
                                        <hr/>
                                    </div>

                                    {topicsList.map((topic,idx) => {
                                        return (
                                            <div key={idx} className="forum-item">

                                                <div className="row align-middle">

                                                    <div className="col-md-1">
                                                        <div className="forum-icon align-middle">
                                                            <BsShield className='mid-icon'></BsShield>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <Link className="forum-item-title" to={{
                                                            pathname: '/forum_temat',
                                                            search: 'id=' + topic.id.toString()

                                                        }}>{topic.title}</Link>
                                                        {(topic.post_count > 0) ? (
                                                            <div className="forum-sub-title border-top border-bottom pb-2 mt-3">
                                                                <div className="container mt-2">
                                                                    {topic.first_post.body}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="forum-sub-title border-top border-bottom pb-2 mt-3">
                                                                <div className="container mt-2">
                                                                    Brak postow w tym temacie
                                                                </div>
                                                            </div>)
                                                        }
                                                    </div>
                                                    <div className="col-md-3">
                                                        {uniqBy(userList, JSON.stringify).map((user,idx)=>{
                                                            if(user.id === topic.owner){
                                                                return (
                                                                    <Link className="forum-item-title" to={{
                                                                        pathname: '/profil_uzytkownika',
                                                                        search: 'id=' + user.id.toString()

                                                                    }}>
                                                                    <div key={idx} className="forum-sub-title">{user.first_name} {user.last_name}</div>
                                                                    </Link>
                                                                )
                                                            }
                                                        })}
                                                        <div className="forum-sub-title">{topic.date.replace('T', " ").replace('Z', '').substr(0, 19)}</div>
                                                    </div>

                                                    <div className="col-md-1 forum-info">
                                                <span className="views-number">
                                                    {topic.post_count}
                                                </span>
                                                        <div>
                                                            <small>Posty</small>
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className='row pl-3 mt-2'>
                                                {(currentUser.id === topic.owner) ? (
                                                    <div>
                                                        <Button className='m-1' id={topic.id} onClick={handleDeleteTopic} variant="btn" size="md"><img id={topic.id} src={trashIcon}/></Button>
                                                    </div>
                                                ) : ('')}
                                                    <div>
                                                        <Link className='m-1 btn'
                                                            to={{
                                                                pathname: '/zgłoszenia',
                                                            }}
                                                        >Zgłoś</Link>
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    })}


                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="container" style={{height:"450px"}}/>
            </div>
        </div>
    );
}

export default ForumTopicsList;