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

//mongodb://127.0.0.1:27017/todolistDB
async function run() {
  await mongoose.connect("{Your server}");

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

  var today = date.getDate();

  app.get("/", async (req, res) => {
    var foundItems = await Item.find();

    if (foundItems.length === 0) {
      try {
        Item.insertMany(defaultItems);
        console.log("Successfully savevd default items to DB.");
      } catch (err) {
        console.log(err);
      }
      res.redirect("/");
    } else {
      res.render("list.ejs", {
        listTitle: "Today",
        newListItems: foundItems,
        toDoDate: today,
      });
    }
  });

  app.get("/:customListName", async function (req, res) {
    const customListName = _.capitalize(req.params.customListName);
    try {
      var foundList = await List.findOne({ name: customListName });

      if (!foundList) {
        // Create a new List
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing List
        res.render("list.ejs", {
          listTitle: foundList.name,
          newListItems: foundList.items,
          toDoDate: today,
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  app.post("/", async (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
      name: itemName,
    });

    if (listName === "Today") {
      item.save();
      res.redirect("/");
    } else {
      const foundList = await List.findOne({ name: listName });
      foundList.items.push(item);
      await foundList.save();
      res.redirect("/" + listName);
    }
  });

  app.post("/delete", async function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
      await Item.findByIdAndRemove(checkedItemId);
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    } else {
      await List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: checkedItemId } } }
      );
      res.redirect("/" + listName);
    }
  });

  let port = process.env.PORT;
  if (port==null || port==""){
    port= 3000;
  }

  app.listen(port, () => {
    console.log(`Server has started successfully.`);
  });
}

run();

