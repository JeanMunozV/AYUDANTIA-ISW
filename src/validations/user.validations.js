"use strict"
import Joi from 'joi'
export const userBodyValidation = Joi.object({
    email: Joi.string().pattern(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}$/).required().messages({
        "string.empty": "El correo no puede ser vacio.",
        "any.required": "El correo es obligatorio.",
        "string.pattern.base": "Formato inválido."
    }),
    password: Joi.string().min(6).max(50).pattern(/^[a-zA-Z0-9]+$/).required().messages({
        "string.empty": "El correo no puede ser vacio.",
        "any.required": "El correo es obligatorio.",
        "string.min": "La contraseña debe tener al menos 6 caracteres.",
        "string.max": "La contraseña debe tener como máximo 50 caracteres.",
        "string.pattern.base": "La contraseña solo debe contener letras y numeros."
    })
})