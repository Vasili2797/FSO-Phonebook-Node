// import numberService from "./src/services/Contacts";
// const numberService2 = require('./src/services/Contacts');
const mongoose = require("mongoose");

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://bjornbjornssonn:${password}@cluster0.8qqv2wd.mongodb.net/phoneContactApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (name && number) {
  const contact = new Contact({
    name,
    number,
  });
  // This is the code that creates and saves a new contact object in MongoDB
  contact
    .save()
    .then((result) => {
      console.log(`Added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
    .catch((err) => {
      console.log("Error fetching the person data! ", err);
      mongoose.connection.close();
    });
} else {
  Contact.find({})
    .then((result) => {
      console.log("phonebook:");
      result.forEach((contact) => {
        console.log(`${contact.name} ${contact.number}`);
      });
      mongoose.connection.close();
    })
    .catch((err) => {
      console.log("Error saving the person: ", err);
      mongoose.connection.close();
    });
}
