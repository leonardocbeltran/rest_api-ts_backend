import request from 'supertest'
import server from '../../server'

describe('POST /api/products', () => {

    it('should display validation error', async() => {
        const response = await request(server).post('/api/products').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)
        
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(3)
    })

    it('should validate price > 0', async() => {
        const response = await request(server).post('/api/products').send({
            name : "Monitor curvo - Testing",
            price : 0
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(3)
    })

    it('should validate price != string & > 0', async() => {
        const response = await request(server).post('/api/products').send({
            name : "Monitor curvo - Testing",
            price : "hola"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)
        
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(1)
    })

    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name : "Teclado Virtual - Testing",
            price : 100
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')      
    }, 15000)
})

describe('GET /api/products', () => {

    it('should check if api/products url exist', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })

    it('GEt a Json response with product', async() => {
        const response = await request(server).get('/api/products')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })

})

describe('GET /api/products/:id', () => {
    it('should return a 404 response for a non-existent product', async() => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')

        expect(response.status).not.toBe(200)
    })

    it('should validate id diferent to string', async () => {
        const productId = "text"
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        //console.log(response.body.errors[0].msg)
        expect(response.body.errors[0].msg).toBe('ID no válido')
        
        expect(response.status).not.toBe(200)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate received a product', async () => {
        const productId = 1
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        
        expect(response.status).not.toBe(400)
    })

})

describe('PUT /api/products/:id', () => {

    it('should check if api/products url exist', async () => {
        const response = await request(server).put('/api/products/not-valid-url').send({
            name : "Teclado Virtual jaja",
            price : 200,
            availability : true 
        }) 
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors[0].msg).toBe('ID no válido')
    
        expect(response.status).not.toBe(200)
    })

    it('should display validation error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({})
        
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)
        
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
        expect(response.body.errors).not.toHaveLength(1)
    })

    it('should display validation error messages when price <= 0', async () => {
        const response = await request(server).put('/api/products/1').send({
                name : "Teclado Virtual jaja",
                price : -200,
                availability : true              
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors[0].msg).toBe('Precio No válido')

        //console.log(response.body.errors[0].msg)
        //expect(response.body.errors[0].msg).toBe('ID no válido')
        
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
        //expect(response.body.errors).not.toHaveLength(1)
    })

    it('should return a 404 response for a non-existen product', async () => {
        const productId=200
        const response = await request(server).put(`/api/products/${productId}`).send({
                name : "Monitor curvo",
                price : 200,
                availability : true              
        })
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBeTruthy()
        expect(response.body.error).toBe('Producto no encontrado.')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update an existing product with valid data', async () => {
        const productId=1
        const response = await request(server).put(`/api/products/${productId}`).send({
                name : "Monitor curvo test",
                price : 100,
                availability : true              
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBeTruthy()

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/products/:id', () => {
    it('should return a 404 msg error', async () => {
        const productID = 2000
        const response = await request(server).patch(`/api/products/${productID}`).send({})
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado.')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should return msg Not Exist', async () => {
        const response = await request(server).patch('/api/products/url-not-valid').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')

        expect(response.status).not.toBe(200)
    })
    
    it('should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1').send({})
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('DELETE /api/products/:id', () => {

    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productID = 200
        const response = await request(server).delete(`/api/products/${productID}`).send({})
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado.')

        expect(response.status).not.toBe(200)
    })

    it('should delete a product', async () => {
        const response = await request(server).delete('/api/products/1').send({})
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBe('Producto eliminado')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})