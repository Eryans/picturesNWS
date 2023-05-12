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
    const [image, setImage] = useState(null);

    const handleImageUpload = (event) => {
        const uploadedImage = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setImage(reader.result);
        };

        reader.readAsDataURL(uploadedImage);
    };

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


    const handleImageSubmit = () => {
        if (image) {
            const formData = new FormData();
            formData.append('file', image);

            axios.post("http://localhost:5000/pictures/upload", formData, {
                headers: {
                    'auth-token': localStorage.getItem("tokenExoMai"),
                }
            }).then((response) => {
                console.log(response.data);
            });
        }
    };

    return (
        <div>
            <Container maxWidth="md" style={{ marginTop: 150, margin: 20 }}>
                <Button variant="contained" color="error" onClick={() => deleteUser()}>Supprimer mon compte</Button>
                <div style={{ marginTop: 30 }}>
                    <input type="file" id="img" name="image" accept="image/*" onChange={handleImageUpload} />
                    <button onClick={handleImageSubmit}>Upload Image</button>
                </div>
                {image && <img style={{ marginTop: 20 }} src={image} width="400" alt="Uploaded Image" />}
            </Container>
        </div>
    )
}
