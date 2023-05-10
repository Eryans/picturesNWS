import Image from 'next/image'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Uploady from "@rpldy/uploady";

export default function Dashboard({ token, setTokenUrl }) {

    const [listImg, setListImg] = useState([]);
    const [uploadedImg, setUploadedImg] = useState({});

    const deleteUser = async () => {
        axios
            .delete(`http://localhost:5000/users/${JSON.parse(localStorage.getItem("infoUserExoMail"))._id}`,
                {
                    headers: {
                        'auth-token': localStorage.getItem("tokenExoMai"),
                    }
                },
            )
            .then(response => {
                if (response.status === 200) {
                    setTokenUrl(null);
                    localStorage.removeItem("tokenExoMai");
                    localStorage.removeItem("infoUserExoMail");
                }
                console.log(response);
            });
    }

    const uploadImg = (param) => {
        // console.log(param.target.files[0])
        setUploadedImg(param.target.files[0])
    }

    const sendImgToServer = () => {
        // axios
        //     .post('http://localhost:5000/pictures/upload', {
        //         uploadedImg
        //     })
        //     .then(response => {
        //         if (response.status === 200) {
        //             setTokenUrl(response.data.token)
        //             localStorage.setItem("tokenExoMai", response.data.token);
        //             localStorage.setItem("infoUserExoMail", JSON.stringify(response.data.newUser));
        //         }
        //     });

    }
    const handleFileUpload = async (event) => {
        event.preventDefault()
        const formData = new FormData();
        formData.append("file", uploadedImg);
        console.log(uploadedImg)
        try {
            const response = await axios.post("http://localhost:5000/pictures/upload", formData, {
                headers: {
                    'auth-token': localStorage.getItem("tokenExoMai"),
                }
            });
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    // useEffect(() => {
    //     axios.get('http://localhost:5000/pictures/all', {
    //         id: JSON.parse(localStorage.getItem("infoUserExoMail"))._id,
    //     })
    //         .then(response => {
    //             if (response.status === 200) {
    //                 console.log(response)
    //                 setListImg(response.data)
    //             }
    //         });
    // }, [])

    return (
        <div>
            <div>
                <Button variant="contained" color="error" style={{ margin: 20 }} onClick={() => deleteUser()}>Supprimer mon compte</Button>
                <div>
                    <form encType="multipart/form-data" onSubmit={handleFileUpload}>
                        <label for="img">Select image:</label>
                        <input type="file" id="img" name="image" accept="image/*" onChange={(e) => uploadImg(e)} />
                        <input type="submit" />
                    </form>
                </div>

                <div style={{ margin: 20 }}>
                    {listImg.length === 0 ? "vous n'avez pas encore d'image" :
                        "test"}
                </div>
            </div>
        </div>
    )
}
