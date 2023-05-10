import Image from 'next/image'
import Header from '../components/header'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import { useState } from 'react';

export default function Login() {

    const [loginName, setLoginName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    const connect = async () => {
        try {
            const res = await fetch(
                `http://localhost:8000`,
                {
                    method: 'POST',
                    headers: {
                        'X-RapidAPI-Key': 'your-rapidapi-key',
                        'X-RapidAPI-Host': 'famous-quotes4.p.rapidapi.com',
                    },
                    body: {loginName, loginPassword}
                }
            );
            const data = await res.json();
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <main>
            <Container maxWidth="md">
                <Grid container spacing={12}>
                    <Grid item xs={6}>
                        <h2 style={{ marginBottom: 20 }}>Se connecter</h2>
                        <TextField
                            style={{ marginBottom: 20 }}
                            type="email"
                            value={loginName}
                            size="small"
                            onChange={(e) => setLoginName(e.target.value)}
                            label="Nom de compte"
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            style={{ marginBottom: 10 }}
                            value={loginPassword}
                            type="password"
                            size="small"
                            onChange={(e) => setLoginPassword(e.target.value)}
                            label="Mot de passe"
                            variant="outlined"
                            fullWidth
                        />
                        <Button variant="contained" onClick={() => connect()}>Envoyer</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <h2 style={{ marginBottom: 20 }}>Créer un compte</h2>
                        <TextField
                            style={{ marginBottom: 20 }}
                            type="email"
                            value={signupName}
                            size="small"
                            onChange={(e) => setSignupName(e.target.value)}
                            label="Nom de compte"
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            style={{ marginBottom: 10 }}
                            value={signupPassword}
                            type="password"
                            size="small"
                            onChange={(e) => setSignupPassword(e.target.value)}
                            label="Mot de passe"
                            variant="outlined"
                            fullWidth
                        />
                        <Button variant="contained" onClick={() => signup()}>Envoyer</Button>
                    </Grid>
                </Grid>
                {/* <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} /> */}
            </Container>
        </main>
    )
}
