require('dotenv').config()
const express = require('express')
app = express()
const morgan = require('morgan')
const cors = require('cors')
const Persona = require('./models/persona')
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
//con esto aseguros q siempre q express reciba una peticion de tipo static, le diga q busque en la carpeta dist el archivo solicitado
app.use(express.static('dist'))    


const errorHandler = (error,request,response,next)=>{
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error:'id malformado'})
    }
     if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next();
}

const endpointNoEncontrado = (request,response)=>{
    response.status(404).send({error:'endpoint no encontrado'})
}


app.get('/api/persons',(request,response)=>{
    Persona.find({}).then(persona=>{
        console.log("esto me devuelve el servidor",persona)
        response.json(persona)
    }).catch(error=> {
        console.log(error)
    })
})
app.get('/info',(request,response,next)=>{
    const horaActual = new Date();
    const horaFormateada = `${horaActual}`
    Persona.find({}).then(personas=>{
        const cantidadContactos = personas.length
        response.send(
        `<div>
            <p>la cantidad de contactos agendados es ${cantidadContactos} personas</p>
            <p>${horaFormateada}</p> 
        </div>`)

    }).catch(error=>{
        next(error)
    })
    
})
app.get('/api/persons/:id',(request,response,next)=>{
    console.log("el tipo de id es ",typeof request.params.id)
    Persona.findById(request.params.id).then(persona=>{
        if(persona){
            response.json(persona)
        }else{
            response.status(404).end()
        }   
}).catch(error=>{
    next(error)
    }) 
})

app.post('/api/persons',(request,response,next)=>{
    const body = request.body
    console.log("el tipo es ",typeof body)
    /* if(body.name ==="" || body.number==="")
    {
        return response.status(400).json({
            error:"ninguno de los campos especificados pueden estar vacíos"})
        } */   
    const newPerson = new Persona({
        name: body.name,
        number: body.number,
    })
    newPerson.save().then(savedPerson=>{
        response.json(savedPerson)
    }).catch(error=>{
        next(error) 
    })

})

app.delete('/api/persons/:id',(request, response,next)=>{
   Persona.findByIdAndDelete(request.params.id).then(result=>{
        response.status(204).end()
   }).catch(error=>{
        next(error)
   })

})
app.put('/api/persons/:id',(request,response,next)=>{
    const personaActualizada = {
        name: request.body.name,
        number: request.body.number,
    }
    Persona.findByIdAndUpdate(request.params.id,personaActualizada,{new:true,runValidators:true,context:'query'}).then(persona=>{
        response.json(persona)
    }).catch(error=>{
        next(error)
    })
})


const generatedId = ()=>{
    idGenerado = Math.floor(Math.random()*(10000-1+1))+1;
    return idGenerado
}
app.use(endpointNoEncontrado)
app.use(errorHandler)   

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log("el servidor está corriendo en el puerto ",PORT)
})
