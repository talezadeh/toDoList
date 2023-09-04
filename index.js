import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import * as date from "./date.mjs";
import lodash from "lodash";

const app = express();
const port = 3000;
const _ = lodash;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongodb+srv://admin-mori:Test123@cluster0.w0sfg3n.mongodb.net/todolistDB
async function run() {
  await mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

  const itemSchema = {
    name: String,
  };

  const Item = mongoose.model("item", itemSchema);

  const item1 = new Item({
    name: "Welcome to your todolist!",
  });

  const item2 = new Item({
    name: "Hit the + button to add a new item.",
  });

  const item3 = new Item({
    name: "<-- Hit this to delete an item.",
  });

  const defaultItems = [item1, item2, item3];

  const listSchema = {
    name: String,
    items: [itemSchema],
  };


  const List = mongoose.model("List", listSchema);

  app.get("/", async (req, res) => {
    var foundItems = await Item.find();
    var today = date.getDate();

    if (foundItems.length === 0) {
      try {
        Item.insertMany(defaultItems);
        console.log("Successfully savevd default items to DB.");
      } catch (err) {
        console.log(err);
      }
      res.redirect("/");
    }else{
      res.render("list.ejs",{listTitle:"Today", newListItems: foundItems, toDoDate: today});
    }
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

// try {
//   await Item.insertMany([buy, cook, eat]);
//   console.log("Items inserted successfully!");
// } catch (err) {
//   console.log(err);
// }
