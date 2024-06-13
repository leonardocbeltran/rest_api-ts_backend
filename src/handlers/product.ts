import {Request, Response} from 'express'
import Product from '../models/Model.product'

// GET Funcion obtener productos
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            order: [
                ['id', 'DESC']
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        res.json({data: products})
    } catch (error) {
        console.log(error)
    }
}

// GET Obtener un solo producto
export const getProductByID = async (req: Request, res: Response) => {

    const {id} = req.params

    try {
        const product = await Product.findByPk(id, {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        if(!product){
            return res.status(404).json({
                error: 'Producto no encontrado.'
            })
        }
        res.json({data: product})
    } catch (error) {
        console.log(error)
    }
}

// POST Crear un producto
export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json({data: product})            
    } catch (error) {
        console.log(error)
    }
}

// PUT Actualizar un producto PUT
export const updateProduct = async (req: Request, res: Response) => {
    
    const {id} = req.params
    const product = await Product.findByPk(id)

    try {
        if(!product){
            return res.status(404).json({
                error: 'Producto no encontrado.'
            })
        }
        // actualizar
        await product.update(req.body)
        await product.save()

        res.json({data:product})

    } catch (error) {
        console.log(error)
    }
}

// PATCH Actualizar disponibilidad de un producto PATCH
export const updateAvailability = async (req: Request, res: Response) => {
    
    const {id} = req.params
    const product = await Product.findByPk(id)

    try {
        if(!product){
            return res.status(404).json({
                error: 'Producto no encontrado.'
            })
        }
        // actualizar
        product.availability = !product.dataValues.availability
        await product.save()

        res.json({data:product})

    } catch (error) {
        console.log(error)
    }
}

// DELETE Eliminar un producto
export const deleteProduct = async (req: Request, res: Response) => {
    
    const {id} = req.params
    const product = await Product.findByPk(id)

    try {
        if(!product){
            return res.status(404).json({
                error: 'Producto no encontrado.'
            })
        }
        // actualizar
        await product.destroy()

        res.json({data: 'Producto eliminado'})

    } catch (error) {
        console.log(error)
    }

}