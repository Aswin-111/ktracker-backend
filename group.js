const fs = require('fs');
const csv = require('csv-parser');
const { Sequelize, DataTypes } = require("sequelize");

const connection = new Sequelize("police_tracker", "root", "pass@123", {
  host: "localhost",
  dialect: "mysql",
});
// Path to your CSV file
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
  },{timestamps : false});
  
// Read the CSV file
fs.createReadStream('./data.csv')
  .pipe(csv())
  .on('data', (row) => {
   
    
    
    
    (async () =>{
        await User.create({
            grouppatrol : row.grouppatrol,
            officername : row.officername,
            location    : row.location,
            phone : row.phone,
            date : row.date,
            time : row.time
        })
    })()
    
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  })
  .on('error', (err) => {
    console.error('Error:', err.message);
  });
