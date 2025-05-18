// const mongoose = require("mongoose");
import mongoose from "mongoose";
const password = "";
const encodedPassword = encodeURIComponent(password);

const url = `mongodb+srv://bjornbjornssonn:${encodedPassword}@cluster0.8qqv2wd.mongodb.net/phoneContactApp?retryWrites=true&w=majority&appName=Cluster0
`;
const MONGODB_URI = `mongodb+srv://bjornbjornssonn:${encodedPassword}@cluster0.8qqv2wd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", numberSchema);

// Save a new contact after updating the numberSchema

// const newContact = new Contact({ name: "Jane Doe", number: "123-456-7890" });
// (async () => {
//   try {
//     await mongoose.connect(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to mongoDB");

//     await newContact.save().then((result) => {
//       console.log("New Contact saved");
//     });
//   } catch (err) {
//     console.log("Error: ", err.message);
//   } finally {
//     await mongoose.connection.close();
//   }
// })();

// Connect and retrieve all the data on Mongo
(async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to mongoDB");

    const count = await Contact.countDocuments({});
    console.log("Document count:", count);

    const contacts = await Contact.find({});
    contacts.forEach((contact) => {
      console.log(contact);
    });
  } catch (err) {
    console.error("Error occured", err.message);
  } finally {
    mongoose.connection.close();
  }
})();
