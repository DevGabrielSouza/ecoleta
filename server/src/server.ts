import express from 'express';

const app = express();

// Rota: Endereço completo da requisição
// Entidade: Entidade acessada

const users = [
    'Diego',
    'Fernando',
    'Júlia',
    'Larissa'
];


app.get('/users', (request, response) => {
    
    const search = String(request.query.search);

    // Se não existir o param search, será atribuido a variável users
    const filteredUser = request.query.search ? users.filter( user => user.includes(search) ) : users;

    return response.json(filteredUser);
});

app.get('/users/:id', (request, response) => {

    const userId = Number(request.params.id);

    const user = users[userId];

    if (user){
        return response.json(user)
    }else{
        return response.json({'msg' : 'Usuário não existe'});
    }

    
});

app.listen(3333);