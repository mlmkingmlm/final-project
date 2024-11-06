const mongoose= require("mongoose");
const list=require("../models/listing");
const alllisting= require("./data.js");
const { object } = require("joi");

main().then((res)=>{
    console.log("db connected ");
}).catch(err=>{
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

const initdata= async()=>{
    await list.deleteMany({});
    alllisting.data = alllisting.data.map((obj)=>({...obj, owner:"66e7f4d5dd0c27d40621eb72"}));
    await list.insertMany(alllisting.data);
};

initdata();
