import React, {useEffect, useRef, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from "../../Axios/Axios";
import Photo from "../../../imgs/logoJPEG.jpg";
import {Link} from "react-router-dom";
import axios_variebles from "../../Axios/Axios_variebles";


function DietShowDieticianDiets() {

    const [dietAll, setDietAll] = useState([]);
    const [dietTypeAll, setDietTypeAll] = useState([]);
    const [userInfo, setUserInfo] = useState("");

    useEffect(() => {

        axiosInstance
            .post(`diet/all`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                }
            })
            .then((res) => {
                setDietAll(res.data)
            });

        axiosInstance
            .post(`diet/type/all`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                }
            })
            .then((res) => {
                setDietTypeAll(res.data)
            });

        axiosInstance
            .post(`users/info/`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                }
            })
            .then((res) => {
                setUserInfo(res.data)
            });

    }, []);


    return (
        <div className="trainingGroupShowTrainerTrainings">
            <div className="container">

                <div className="text-center">
                    <hr></hr>
                    <h1 style={{"fontSize": "5vw"}} className="display-1 font-weight-light mb-4">Twoje Diety</h1>
                    <hr></hr>
                </div>

                <div className="row justify-content-center text-center inline-block">
                    {dietAll.map((diet, idx) => {

                        if (diet.owner === userInfo.id) {
                            return (
                                <div key={idx} style={{minWidth: '250px'}} className="col-md-3 mb-2 flex">
                                    <div className="h-100 card m-1 shadow bg-light">
                                        {(diet.image === null) ? (
                                            <img src={Photo}
                                                 width="233px"
                                                 height="233px"
                                                 className="card-img-top rounded-circle"
                                                 alt="..."/>
                                        ):(
                                            <img src={axios_variebles.baseURL.slice(0, -1) + diet.image}
                                                 width="233px"
                                                 height="233px"
                                                 className="card-img-top rounded-circle"
                                                 alt="..."/>
                                        )}
                                        <div className="card-body">
                                            <div>
                                                <h5 className="card-title">{diet.title}</h5>
                                                <div className="card-subtitle"
                                                     style={{overflow: 'auto', height: '100px'}}>
                                                    {dietTypeAll.map(function (type, id) {
                                                        for (let i = 0; i < diet.type.length; i++) {
                                                            if (diet.type.includes(type.id)) {
                                                                return (<p className="m-0"
                                                                           style={{fontSize:'15px'}}
                                                                           key={id}>{type.type}</p>)
                                                            }
                                                        }
                                                    })}
                                                </div>
                                                <p className="card-text text-center"> Trener:</p>
                                                <p className="card-text text-center">{userInfo.first_name} {userInfo.last_name}</p>
                                                <Link className='btn' to={{
                                                    pathname: '/strefa_dietetyka_dieta',
                                                    search: 'id='+diet.id.toString()
                                                }}>Szczegóły Diety</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })}
                    <div style={{minWidth: '250px'}} className="col-md-3"></div>
                    <div style={{minWidth: '250px'}} className="col-md-3"></div>
                    <div style={{minWidth: '250px'}} className="col-md-3"></div>
                </div>
                <hr/>
            </div>

        </div>
    );
}

export default DietShowDieticianDiets;