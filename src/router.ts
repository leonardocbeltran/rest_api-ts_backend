import {Router} from 'express'
import { body, param } from 'express-validator'
import { createProduct, getProducts, getProductByID, updateProduct, updateAvailability, deleteProduct } from './handlers/product'
import { handleInputErrors } from './middleware'

const router = Router()

/**
* @swagger
* components:
*   schemas:
*       Product:
*           type: object
*           properties: 
*               id:
*                   type: integer
*                   description: The product ID
*                   example: 1
*               name: 
*                   type: string
*                   description: product name
*                   example: Monitor Curvo de 49 pulgadas
*               price: 
*                   type: number
*                   description: product price
*                   example: 2000
*               availability: 
*                   type: boolean
*                   description: product availability
*                   example: true
*/

/**
 * @swagger
 * /api/products:
 *  get:
 *      summary: Get a list of products
 *      tags: 
 *          - Products
 *      description: Return a list of products
 *      responses: 
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product'
 */

// Obtener lista de productos
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags: 
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Not found
 *          400:
 *              description: Bad request - Invalid ID
 * 
 */

// Obtener un solo producto
router.get(
        '/:id', 
        param('id').isInt().withMessage('ID no válido'),
        handleInputErrors,
        getProductByID
)

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: create a new product
 *      tags: 
 *          - Products
 *      description: return a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      type: object
 *                      properties: 
 *                          name: 
 *                              type: string
 *                              example: "monitor curvo 24 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *      responses:
 *          201:
 *              description: Product created Successfully 
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - Invalid input data
 */

// crear un nuevo producto
router.post('/',
    // validacion de los campos recibidos
    body('name')
        .notEmpty().withMessage('Nombre de producto es Obligatorio'),    
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .custom(value => value > 0).withMessage('Precio No válido')
        .notEmpty().withMessage('El precio del producto es Obligatorio'),
    handleInputErrors,
    createProduct)

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Update a product by ID
 *      tags:
 *          - Products
 *      description: Change data at product by ID
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      type: object
 *                      properties: 
 *                          name: 
 *                              type: string
 *                              example: "Monitor curvo 24 pulgadas actualizado"
 *                          price:
 *                              type: number
 *                              example: 400
 *                          availability:
 *                              type: boolean
 *                              example: false
 *      responses:
 *          200:
 *              description: Updated Successfully 
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - Invalid ID or Invalid input data
 *          404:
 *              description: Product Not found
 */

// Actualizar un producto
router.put('/:id',
    param('id').isInt().withMessage('ID no válido'),
    // validacion de los campos recibidos
    body('name')
        .notEmpty().withMessage('Nombre de producto es Obligatorio'),    
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .custom(value => value > 0).withMessage('Precio No válido')
        .notEmpty().withMessage('El precio del producto es Obligatorio'),
    body('availability')
        .isBoolean().withMessage('valor para disponibilidad No válido'),
    handleInputErrors,
    updateProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update availability
 *      tags:
 *          - Products
 *      description: Change availability, false o true
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Updated Successfully 
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Not found
 *          400:
 *              description: Bad request - Invalid ID or Invalid input data
 */

router.patch('/:id', 
    param('id').isInt().withMessage('ID no válido'), 
    handleInputErrors,
    updateAvailability
)

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Delete a product of database
 *      tags:
 *          - Products
 *      description: return message delete successfully
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response 
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: Producto eliminado
 *          404:
 *              description: Product Not found
 *          400:
 *              description: Bad request - Invalid ID or Invalid input data
 */

router.delete('/:id', 
    param('id').isInt().withMessage('ID no válido'), 
    handleInputErrors,
    deleteProduct
)

export default router