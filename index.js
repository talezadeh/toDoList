import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import * as date from "./date.mjs"

const app = express();
const port = 3000;

  // mongodb+srv://admin-mori:Test123@cluster0.w0sfg3n.mongodb.net/todolistDB
async function run() {
  await mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

  const itemSchema = {
    name: String,
  };

  const Item = mongoose.model("item", itemSchema);

  const buy = new Item({
    name: "Buy Food.",
  });

  const cook = new Item({
    name: "Cook Food.",
  });

  const eat = new Item({
    name: "Eat Food.",
  });


  // try {
  //   await Item.insertMany([buy, cook, eat]);
  //   console.log("Items inserted successfully!");
  // } catch (err) {
  //   console.log(err);
  // }

const toDoItems = ["Buy Food", "Cook Food", "Eat Food"];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var itemsNames = [];
async function myFindFunction(itemsNames) {
  try {
    var items = await Item.find();

    items.forEach((item) => {
      // mongoose.connection.close();
      itemsNames.push(item.name);
      // console.log(item.name);
    });

    return itemsNames;
  } catch (err) {
    console.log(err);
  }
}

app.get("/", async (req, res) => {
  var items = await myFindFunction(itemsNames);
  // console.log(items);
  var today= date.getDate();
  res.render("list.ejs", {listTitle:"Personal", toDoDate:today , items });
});

app.post("/", (req, res) => {
  const newToDo = req.body.newItem;
  toDoItems.push(newToDo);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

}

run();



// (async () => {
//   try {
//     await Item.insertMany([buy, cook, eat]);
//     console.log("Items inserted successfully!");
//   } catch (err) {
//     console.log(err);
//   }
// })();

