console.log("🚨 YOU ARE INSIDE THE CORRECT index.js FILE");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
const mongoose = require("mongoose");

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
const encodedPassword = "1%40Saqartvelo";

const url = `mongodb+srv://bjornbjornssonn:${encodedPassword}@cluster0.8qqv2wd.mongodb.net/phoneContactApp?retryWrites=true&w=majority&appName=Cluster0`;
MONGODB_URI = `mongodb+srv://bjornbjornssonn:${encodedPassword}@cluster0.8qqv2wd.mongodb.net/phoneContactApp?retryWrites=true&w=majority&appName=Cluster0`;
console.log(url);

mongoose.set("strictQuery", false);
console.log("🚀 Starting index.js");

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error occured: ", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

let Person = mongoose.model("Person", personSchema);

// Logger middleware
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

// Log every incoming request regardless of route
app.use((req, res, next) => {
  console.log(`🛰  Incoming Request → ${req.method} ${req.path}`);
  next();
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    console.log("Fetched from MongoDB:", persons);
    response.json(persons);
  });
});

//Getting a person info
app.get("/info", async (request, response) => {
  const count = await Person.countDocuments({});
  response.send(`Phonebook has info for ${count} people.<br/><br/> ${Date()}`);
});

//Getting a single phonebook entry information
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//Delete a single phonebook entry
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//Add a new entry
app.post("/api/persons", async (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const existing = await Person.findOne({ name });

  if (existing) {
    return response.status(400).json({
      error: "Person already exists in the records",
    });
  }

  const personAdded = new Person({ name, number });
  personAdded
    .save()
    .then((savedPerson) => {
      response.status(201).json(savedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons", async (req, res) => {
  console.log("🔥 DELETE /api/persons handler reached"); // <-- Confirm it's hit

  try {
    await Person.deleteMany({});
    res.status(204).end();
  } catch (error) {
    console.error("❌ Error deleting all contacts:", error);
    res.status(500).json({ error: "Failed to delete contacts" });
  }
});

//Unknown endpoint handler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown Endpoint" });
};

app.use(unknownEndpoint);

const listEndpoints = require("express-list-endpoints");

console.log("📋 Registered endpoints:");
const endpoints = listEndpoints(app);
endpoints.forEach((ep) => {
  console.log(`➡️ ${ep.methods.join(", ")} ${ep.path}`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
