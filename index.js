const express = require('express')
app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

let agenda=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request,response)=>{
    response.json(agenda)
})
app.get('/info',(request,response)=>{
    const horaActual = new Date();
    const horaFormateada = `${horaActual}`
    response.send(
        `<div>
            <p>la cantidad de contactos agendados es ${agenda.length} personas</p>
            <p>${horaFormateada}</p> 
        </div>`)
})
app.get('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    const persona = agenda.find(a=>a.id ===id)
    persona? response.json(persona): response.status(404).end()
})

app.post('/api/persons',(request,response)=>{
    let existe = false
    const body = request.body
    if(body.name ==="" || body.number==="")
    {
        return response.status(400).json({
            error:"ninguno de los campos especificados pueden estar vacíos"})
        }   
    agenda.forEach(n=>{
        if(body.name === n.name)
            existe = true;
    })
    if(existe){
        return response.status(400).json({error:"la persona ingresada ya existe"})
    }
    const newContact = {
        id: generatedId(),
        name: body.name,
        number:body.number
    }
    agenda = agenda.concat(newContact)
    response.json(newContact)

})

app.delete('/api/persons/:id',(request, response)=>{
    const id = Number(request.params.id);
    agenda = agenda.filter(a=> a.id !==id)
    response.status(204).end()

})
app.put('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    const body = request.body
    let persona = agenda.find(a=> a.id ===id)
    if(!persona){
        return response.status(404).json({error:"la persona no existe"})
    }
    persona.number = body.number
    agenda = agenda.map(a=> a.id !==id ? a : persona)
    response.json(persona)
})

const generatedId = ()=>{
    idGenerado = Math.floor(Math.random()*(10000-1+1))+1;
    return idGenerado
}

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log("el servidor está corriendo en el puerto ",PORT)
})
