const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// Defining a custome token for morgan to log the request for POST requests
morgan.token("req-body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

// Middleware for logging with custom format
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: "5",
    name: "Mary Fifov",
    number: "39-23-642e212e3122",
  },
];

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown Endpoint" });
};

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

//Getting a person info
app.get("/info", (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people.<br/><br/> ${Date()}`
  );
});

//Getting a single phonebook entry information
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.send(person);
  } else {
    response.status(404).end();
  }
});

//Delete a single phonebook entry
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

//Generate a random ID
const generateID = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

//Add a new entry
app.post("/api/persons", (request, response) => {
  const body = request.body;
  body.id = generateID();
  console.log(body);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  } else if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "Person already exists in the records",
    });
  }

  const personAdded = {
    id: body.id,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(personAdded);
  response.status(201).json(personAdded);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
