import { NextFunction, Request, Response } from "express";

export function loggerGblobal(req:Request,res:Response,next:NextFunction){
    const {method,url}=req
    const dateTime=new Date()
    const date=dateTime.toLocaleDateString()
    const time=dateTime.toLocaleTimeString()

    console.log(`Ejecutando metodo: ${method}, en ruta: ${url}, en fecha: ${date} en hora: ${time} `)
    next();
}