require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;
console.log('conectando a', url);
mongoose.connect(url)
    .then(() => {
        console.log('conectado a la base de datos MongoDB')})
    .catch((error) => {
        console.log('error al conectar a la base de datos MongoDB:', error.message)
    });
    const personaSchema= new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        required: true,
    },
    number: {
        type: String,
        validate:{
            validator: function(v){
                return /\d{2,3}-/.test(v);
            },
            message: props => `${props.value} no es un número de teléfono válido! Debe tener el formato XX-XXXXXXX o XXX-XXXXXXX`
        },
        minlength: [8, 'El número debe tener al menos 8 digitos'],
        required: [true, 'El número de teléfono es obligatorio']
    }
    })
    personaSchema.set('toJSON',{
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString(),
            delete returnedObject._id,
            delete returnedObject.__v
        }})

        module.exports = mongoose.model('Person', personaSchema);