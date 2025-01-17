import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from "../../Axios/Axios";
import useCollapse from "react-collapsed";
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios_variebles from "../../Axios/Axios_variebles";


function DietEdit() {

    const [trainingGroupAll, setTrainingGroupAll] = useState([]);
    const [trainingGroupTypeAll, setTrainingGroupTypeAll] = useState([]);
    const [userInfo, setUserInfo] = useState("");
    const [groupToEditId, setGroupToEditId] = useState('none')
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pricePractice, setPricePractice] = useState(0);
    const [priceWeek, setPriceWeek] = useState(0);
    const [priceMonth, setPriceMonth] = useState(0);
    const [typeSelectedNew, setTypeSelectedNew] = useState([]);
    const [typeSelectedOld, setTypeSelectedOld] = useState([])

    const [photo, setPhoto] = useState();
    const [fileToUpload, setFileToUpload] = useState();
    const [fileToUploadName, setFileToUploadName] = useState("");
    const [isFilePicked, setIsFilePicked] = useState(false);


    useEffect(() => {

        axiosInstance
            .post(`diet/all`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                }
            })
            .then((res) => {
                setTrainingGroupAll(res.data)
            });

        axiosInstance
            .post(`diet/type/all`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                }
            })
            .then((res) => {
                setTrainingGroupTypeAll(res.data)
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

    const {getCollapseProps, getToggleProps, isExpanded} = useCollapse()


    const groupChosen = (e) => {
        setGroupToEditId(e.target.value)
        if (e.target.value !== 'none') {
            axiosInstance
                .post(`/diet/get`, {id: e.target.value}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token')
                    }
                })
                .then((res) => {
                    setGroupToEditId(res.data.id)
                    setTitle(res.data.title)
                    setDescription(res.data.description)
                    setPricePractice(res.data.price_day)
                    setPriceWeek(res.data.price_week)
                    setPriceMonth(res.data.price_month)
                    setTypeSelectedOld(res.data.type)
                });
        } else {
            setGroupToEditId('')
            setTitle('')
            setDescription('')
            setPricePractice('')
            setPriceWeek('')
            setPriceMonth('')
            setTypeSelectedOld([])
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        var formdata = new FormData();
        formdata.append("id", groupToEditId);


        formdata.append("title", title);
        formdata.append("description", description);

        if(typeSelectedNew.length > 0 ) {
            for (let i = 0; i < typeSelectedNew.length; i++) {
                formdata.append("type", typeSelectedNew[i]);
            }
        } else {
            for (let i = 0; i < typeSelectedOld.length; i++) {
                formdata.append("type", typeSelectedOld[i]);
            }
        }

        formdata.append("price_day", pricePractice);
        formdata.append("price_week", priceWeek);
        formdata.append("price_month", priceMonth);

        if(fileToUpload !== undefined) {
            formdata.append("image", fileToUpload, fileToUploadName);
            setPhoto()
            setFileToUpload()
            setFileToUploadName()
            setIsFilePicked(false)
        }

        formdata.append("is_private", "False");

        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('token_type') + ' ' + localStorage.getItem('access_token'));

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(axios_variebles.baseURL + "diet/edit", requestOptions)
            .then(response => {
                response.text();
                window.location.reload();
            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

    };


    const typesChecked = (e) => {

        if (typeSelectedNew.indexOf(e.target.name) !== -1) {
            let name = e.target.name;
            setTypeSelectedNew(typeSelectedNew.filter((e) => (e !== name)))
        } else {
            let name = e.target.name;
            setTypeSelectedNew([...typeSelectedNew, name]);
        }

    }

    const onFileChange = (event) => {
        setFileToUpload(event.target.files[0]);
        setFileToUploadName(event.target.files[0].name)
        setPhoto(URL.createObjectURL(event.target.files[0]));
        setIsFilePicked(true);
    };

    return (
        <div className="trainingGroupEdit">
            <div className="container">

                <div className="text-center">
                    <hr></hr>
                    <h1 style={{"fontSize": "4.75vw"}} className="display-1 font-weight-light mb-4">Edytuj Dietę</h1>
                    <hr></hr>
                </div>

                    <div className='row mx-auto ml-0 mr-0 justify-content-center' style={{minHeight: '130px'}}>
                        <div className='row  p-4 justify-content-center'>
                            <div className="col-md-6 text-center my-auto" style={{minWidth: '230px'}}>
                                <p>Wybierz Dietę</p>
                                <select className='text-center mx-auto' style={{width: '200px', height: '30px'}}
                                        onChange={groupChosen}>
                                    <option value='none'>-</option>
                                    {trainingGroupAll.map((training, idx) => {
                                        if (training.owner === userInfo.id) {
                                            return (
                                                <option key={idx} value={training.id}>{training.title}</option>

                                            )
                                        }
                                    })}
                                </select>
                            </div>
                            <div className="col-md-5 text-center my-auto pt-4" style={{minWidth: '200px'}}>
                                <button block size="lg" className="btn btn-lg my-1" id="btn-login"
                                        {...getToggleProps()}
                                        disabled={groupToEditId === 'none'}>
                                    {(isExpanded) ? 'Zamknij Edycję' : 'Edytuj Dietę'}
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="row mt-4">
                        <div className="container" {...getCollapseProps()}>

                            <div className="border p-4 mb-1">
                                <div className="row">
                                    <div className="mx-auto">
                                        <h6 className="mb-0">Profilowe Diety</h6>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto">
                                        <img src={photo} alt="..." className="img-thumbnail" width='200px'
                                             height='200px'/>
                                    </div>
                                </div>

                                <div className="mx-auto pt-1">
                                    <div className="custom-file">
                                        <input type="file" accept="image/png, image/gif, image/jpeg"
                                               className="custom-file-input" id="customFile"
                                               onChange={onFileChange}></input>
                                        <label className="custom-file-label" htmlFor="customFile">Wybierz plik</label>
                                        <div className="text-center mt-1">
                                            <hr/>
                                            {isFilePicked ? (
                                                <div>
                                                    <p>Nazwa : {fileToUpload.name}</p>
                                                    <p>Typ : {fileToUpload.type}</p>
                                                    <p>Wielkość : {fileToUpload.size} bytes</p>
                                                    <p>
                                                        Ostatnio modyfikowany :{' '}
                                                        {fileToUpload.lastModifiedDate.toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p>Wybierz plik aby zobaczyć jego dane</p>
                                            )}
                                            <hr/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Form className="border p-4" onSubmit={handleSubmit}>
                                <Form.Group size="lg" controlId="text">
                                    <Form.Label>Tytuł</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={title}
                                        placeholder={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group size="lg" controlId="text">
                                    <Form.Label>Opis</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        type="text"
                                        value={description}
                                        placeholder={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group size="lg" controlId="text">
                                    <Form.Label>Aktualnie typy diety :
                                        <ul>
                                            {trainingGroupTypeAll.map(function (type, id) {
                                                for (let i = 0; i < typeSelectedOld.length; i++) {
                                                    if (typeSelectedOld.includes(type.id)) {
                                                        return (<li className="m-0" key={id}>{type.type.charAt(0).toUpperCase() + type.type.slice(1)}</li>)
                                                    }
                                                }
                                            })}
                                        </ul>
                                    </Form.Label><br/>
                                    <Form.Label>Nowe typy diety : </Form.Label>
                                    {trainingGroupTypeAll.map((types) => (
                                        <div key={`inline-checkbox-${types.id}`} className="mb-3">
                                            <Form.Check
                                                inline
                                                name={types.id}
                                                type="checkbox"
                                                onChange={typesChecked.bind(this)}
                                                id={`inline-checkbox-${types.id}`}
                                            /> {types.type.charAt(0).toUpperCase() + types.type.slice(1)}
                                        </div>
                                    ))}
                                </Form.Group>
                                <Form.Group size="lg" controlId="text">
                                    <Form.Label>Ceny</Form.Label>
                                    <div className="row justify-content-center">
                                        <div className="col-md-3">
                                            <Form.Label>Dzień</Form.Label>

                                            <Form.Control
                                                type="number"
                                                min="0"
                                                value={pricePractice}
                                                onChange={(e) => setPricePractice(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Label>Tydzień</Form.Label>

                                            <Form.Control
                                                type="number"
                                                min="0"
                                                value={priceWeek}
                                                onChange={(e) => setPriceWeek(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Label>Miesiąc</Form.Label>

                                            <Form.Control
                                                type="number"
                                                min="0"
                                                value={priceMonth}
                                                onChange={(e) => setPriceMonth(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </Form.Group>
                                <Button onClick={handleSubmit} block size="lg" className="btn btn-lg"
                                        id="btn-login">
                                    Zatwierdź Edycję
                                </Button>
                            </Form>
                        </div>
                    </div>
            </div>

        </div>
    );
}

export default DietEdit;