const { Sequelize, DataTypes } = require("sequelize");
const data = require('./data.json')
const connection = new Sequelize("police_tracker", "root", "pass@123", {
  host: "localhost",
  dialect: "mysql",
});
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



//   console.log(data)

data.forEach((item, index) => {
    // Set id for each batch of records
    const id = index + 1;
    // Set serialid starting from 1 and incrementing up to the length of the current batch
    for (let i = 0; i < item.coords.length; i++) {
        const booth = item.coords[i];
        // Insert record into the database
        Data.create({
            id: id,
            lat: booth.lat.toString(),
            long: booth.lng.toString(),
            serialid:booth.serialid,
            name : booth.name.length > 100 ? booth.name.slice(0,100) : booth.name
        }).then(() => {
            console.log(`Record inserted for Booth ${booth.name}`);
        }).catch(err => {
            console.error('Error inserting record:', err);
        });
    }
});