import express from 'express';

const app = express();

app.get('/users', (request, response) => {
    console.log('Usuários');

    response.json([
        'Diego',
        'Fernando',
        'Júlia',
        'Larissa'
    ]);
});

app.listen(3333);