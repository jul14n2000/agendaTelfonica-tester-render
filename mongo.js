const arg = process.argv[0];
const arg1 = process.argv[1];
const arg2 = process.argv[2];
const arg3 = process.argv[3];
const moongoose = require('mongoose');
const password = process.argv[2];
const url =`mongodb+srv://julianAdmin123:<db_password>@cluster0.udugpxl.mongodb.net/?appName=Cluster0`
moongoose.set('strictQuery', false);
moongoose.connect(url)
const personSchema = new moongoose.Schema({
    name: String,
    number: String,
})
const Person = moongoose.model('Person', personSchema) 

if(process.argv.length<4){
    Person.find({}).then(personas => {
        console.log("agenda:")
        personas.forEach(persona => console.log(persona.name + " " + persona.number))
        moongoose.connection.close();
        
})}else{
    const persona = new Person({
        name:process.argv[3],
        number:process.argv[4],
    })
    persona.save().then(result=>{
        console.log(`se agregó ${process.argv[3]} number ${process.argv[4]} a tu agenda`)
        moongoose.connection.close();
    })
}

