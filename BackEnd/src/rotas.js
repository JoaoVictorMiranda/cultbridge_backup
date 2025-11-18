import loginController from './controller/loginController.js'
import postController from './controller/postController.js'
import perfilController from './controller/perfilController.js'
import favoritosController from './controller/favoritosController.js'
import comunidadesController from './controller/comunidadesController.js'


import express from 'express'

export default function adicionarRotas(api) {
    api.use(loginController)
    api.use(postController)
    api.use(perfilController)
    api.use(favoritosController)
    api.use(comunidadesController)



    api.use('/public/storage', express.static('public/storage'))
}