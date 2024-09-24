// import { Injectable, NestMiddleware } from "@nestjs/common";
// import { NextFunction, Request, Response } from "express";

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
   
//     use(req: Request, res: Response, next: NextFunction) {
//         console.log(`Estás ejecutando un método ${req.method} en la ruta ${req.url}`,      
//         );
//     }
// }

import { Request, Response, NextFunction } from 'express';

export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
  const now = new Date().toISOString(); // Fecha y hora en formato ISO
  console.log(`[${now}] Estás ejecutando un método ${req.method} en la ruta ${req.url}`);
  next();
}