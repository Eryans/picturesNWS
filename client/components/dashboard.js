import Image from 'next/image'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ token, setTokenUrl }) {

    const [listImg, setListImg] = useState([]);

    const deleteUser = async () => {
        console.log(localStorage.getItem("tokenExoMai"))
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

    // const uploadImg = () = {

    // }

    useEffect(() => {
        axios.get('http://localhost:5000/pictures/all', {
            id: JSON.parse(localStorage.getItem("infoUserExoMail"))._id,
        })
            .then(response => {
                if (response.status === 200) {
                    console.log(response)
                    setListImg(response.data)
                }
            });
    }, [])

    return (
        <div>
            <Button variant="contained" color="error" onClick={() => deleteUser()}>Supprimer mon compte</Button>
            dashboard
        </div>
    )
}
