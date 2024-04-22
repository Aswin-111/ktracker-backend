const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors())
app.use(express.json());
// const http = require("http").createServer(app);
// const io = require("socket.io")(http, {
//   cors: {
//     origin: "*", // Allow all origins
//     methods: ["GET", "POST"], // Allow GET and POST requests
//     allowedHeaders: ["my-custom-header"], // Allow custom headers
//     credentials: true, // Allow credentials
//   },
// });

const { Sequelize, DataTypes } = require("sequelize");

const connection = new Sequelize("police_tracker", "root", "pass@123", {
  host: "localhost",
  dialect: "mysql",
});

const User = connection.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  grouppatrol: DataTypes.TEXT,
  officername: DataTypes.TEXT,
  location: DataTypes.STRING,

  phone: DataTypes.STRING,

  status: DataTypes.BOOLEAN,

  toggle: DataTypes.BOOLEAN,
  date: DataTypes.STRING,
  time : DataTypes.STRING,
},{initialAutoIncrement:1000},{timestamps : false});

const Data = connection.define("boothdata", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lat: DataTypes.STRING,
  long: DataTypes.STRING,

  name : DataTypes.STRING,
  serialid:{
    type : DataTypes.INTEGER,
    primaryKey : true,
   }

},{timestamps : false});
// Data.sync({force: true});

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
  
//   socket.on("fetchdata", () => {
//     (async () => {
//       const users = await User.findAll();

//       console.log("void setup");
//       io.emit("fetchdata", [...users]);
//     })();
//   });
// });

app.post("/init", async (req, res) => {
  console.log("init");
  const { groupname, officername, phone,latlong,time,date } = req.body;
  console.log( groupname, officername, phone,latlong,time,date);
  try {
    const newUser = await User.create({
      grouppatrol: groupname,
      officername: officername,
      phone: phone,
      location : latlong,
      time,
      date
    });
    return res.json({ status: "done",data:newUser });
  } catch (err) {
    console.log(err);

    return res.json({ err });
  }
});

app.post("/updateusersdata", async (req, res) => {
  console.log("update");
  
  const { 
    date,
    time,
    location,
    id,
  } = req.body
  const response = await User.update({ 
    date,
    time,
    location,
    id,
  }, {
    where: {
      id
    }
  })
  console.log(response)
    return res.json({ status: "done" });
  
   
  
});

  app.post("/getuser" ,async(req,res) =>{
    const response = await User.findOne({where : {
      id : req.body.id
    }})
    return res.json({ status: "done", data:response});
  })
app.get("/users", async (req, res) => {
 
          const users = await User.findAll();
    
          console.log("void setup");
          // io.emit("fetchdata", [...users]);
      console.log(users)
      return res.json({users:users})
    
});
app.post("/fetchuserdata", async (req, res) => {
 
  const users = await User.findAll({
    where: {
      id: req.body.id
    },
  });
  const data = await Data.findAll({
    where: {
      id: req.body.id
    },
  });
  console.log("void setup",req.body.id);
  // io.emit("fetchdata", [...users]);
console.log(data)
return res.json({users:users,usersdata:data})

});
app.post("/updatestatus", async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.toggle = true;
    await user.save();

    res.json({ message: "User status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/getlatlong", async (req, res) => {
 
  const latlong = await Data.findAll();
return res.json({latlong})

});
app.listen(5000, () => {
  console.log("listening on :5000");
});
