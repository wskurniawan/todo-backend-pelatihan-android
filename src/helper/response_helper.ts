import { Response } from "express";

export function validation_error(res: Response, message: string){
   res.status(400).send({
      success: false,
      data: {},
      error: {
         name: 'validation_error',
         message: message
      }
   })
}

export function internal_server_error(res: Response, message: string){
   res.status(500).send({
      success: false,
      data: {},
      error: {
         name: 'internal_server_error',
         message: message
      }
   })
}

export function success(res: Response, data?: any){
   res.send({
      success: true,
      data: data,
      error: {}
   });
}

export function unauthorized(res: Response, message: string){
   res.status(401).send({
      success: false,
      data: {},
      error: {
         name: 'unauthorized',
         message: message
      }
   });
}

export function forbidden(res: Response, message: string){
   res.status(403).send({
      success: false,
      data: {},
      error: {
         name: 'forbidden',
         message: message
      }
   });
}

export default {
   validation_error,
   internal_server_error,
   success,
   unauthorized,
   forbidden
}