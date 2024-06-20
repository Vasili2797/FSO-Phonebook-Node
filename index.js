const express = require('express');
const app = express();
app.use(express.json());

let persons=[
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

//Getting all the people
app.get('/api/persons', (request, response)=>{
    response.send(persons);
});

//Getting a person info
app.get('/info', (request, response)=>{
    response.send(`Phonebook has info for ${persons.length} people.<br/><br/> ${Date()}`);
});

//Get a single individual
app.get('/api/persons/:id', (request, response)=>{
    const id=Number(request.params.id);
    const contact = persons.find(contact=> contact.id === id)
    if(contact){
        response.json(contact);
    }else{
        response.status(404).send(`Person with id: ${id} is NOT FOUND!`).end();
    }
});

// generate a ranndom ID
const generateId=()=>{
    const maxID = persons.length>0 ? Math.max(...persons.map(n=>n.id)) : 0;
    return maxID+1;
}

app.post('/api/persons', (request, response)=>{
    const body = request.body;

    let entry={
        id:generateId(),
        name: body.name,
        number: body.number
    }

    persons.push(entry);
    response.json(entry);
})

app.delete('/api/persons/:id', (request, response)=>{
    const id=Number(request.params.id);
    persons  = persons.filter((contact)=>contact.id!=id);
    response.status(204).end();
    // response.send(contact)
});

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});