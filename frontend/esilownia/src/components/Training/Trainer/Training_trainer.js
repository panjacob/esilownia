import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from "../../Axios/Axios";
import Button from "react-bootstrap/Button";

function TrainingTrainer(props) {

    const [groupInfo, setGroupInfo] = useState([]);
    const [groupInfoParticipants, setGroupInfoParticipants] = useState([]);
    const [typeSelected, setTypeSelected] = useState([]);
    const [usersData, setUsersData] = useState([])


    useEffect(() => {

        axiosInstance
            .post(`training/group/get`, {id: props.groupId}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                }
            })
            .then((res) => {
                setGroupInfo(res.data)
                setGroupInfoParticipants(res.data.participants)
            });

        groupInfoParticipants.map((user) =>{
            axiosInstance
                .post(`/users/get/`, {id: user.user}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                    }
                })
                .then((res) => {
                    setUsersData([...usersData, res.data]);
                    console.log(usersData);
                })
        })

    }, [props.groupId]);


    const typesChecked = (e) => {
    setTypeSelected(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        var urlencoded = new URLSearchParams();
        urlencoded.append("training_group", groupInfo.id);
        urlencoded.append("user", typeSelected);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token'));
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("http://127.0.0.1:8000/training/group/participant/remove", requestOptions)
            .then(response => response.text())
            .catch(error => console.log('error', error));
    window.location.reload();
    };

    function validateForm() {
        return typeSelected.length > 0;
    }

    return (
        <div className="trainingTrainer">
            <div className="container">
                <div className="container text-center">
                    <hr/>
                    <h1 style={{"fontSize": "4vw"}} className="display-1 font-weight-light mb-4">Usuń użytkownika z grupy</h1>
                    <hr/>
                    <div className="row border justify-content-center">
                        <div className="col-md-5">
                        <select className="m-4" size="lg" controlId="text" onChange={typesChecked}>

                            {groupInfoParticipants.map((participants, idx) => (
                                <option
                                    key={idx}
                                    value={participants.user}
                                >
                                    {participants.user}
                                </option>
                            ))
                            }
                        </select>
                        </div>
                        <div className="col-md-3 my-auto">
                        <Button onClick={handleSubmit} block size="lg" className="btn btn-lg" id="btn-login"
                                disabled={!validateForm()}>
                            Usuń Użytkownika
                        </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );

}

export default TrainingTrainer;