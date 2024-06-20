const express = require('express');
const app = express();
app.use(express.json());

let phonebook=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": 5,
      "name": "Mjoe Joeeck", 
      "number": "39-23-31212122"
    }
]

app.get('/api/persons', (request, response)=>{
    response.send(phonebook);
});

app.get('/api/persons/:id', (request, response)=>{
    const id=Number(request.params.id);
    const contact = phonebook.find(contact=> contact.id === id)
    if(contact){
        response.json(contact);
    }else{
        response.status(404).send(`Person with id: ${id} is NOT FOUND!`).end();
    }
});

const generateId=()=>{
    const newId = Math.random()*phonebook.length;
    return Math.ceil(newId)+1;
}

app.post('/api/persons', (request, response)=>{
    const body = request.body;

    body.id=generateId();

    phonebook.concat(contact);
    response.json(contact);
    response.status(201).send(phonebook);
})

app.delete('/api/persons/:id', (request, response)=>{
    const id=Number(request.params.id);
    let contact  = phonebook.filter((contact)=>contact.id!==id);
    response.send(contact)
});

app.get('/info', (request, response)=>{
    response.send(`Phonebook has info for ${phonebook.length} people.<br/><br/> ${Date()}`);
});

app.get('/',(request, response)=>{
    response.send('<h1>Hello World</h1>');
});

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});