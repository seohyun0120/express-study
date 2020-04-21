import { Request, Response, NextFunction } from "express";
import fileService from "./file.service";

const getFile = async (req: Request, res: Response, next: NextFunction) => {
  const { filename } = req.params;

  try {
    return await fileService.getFile(filename, req, res);
  } catch (exceptions) {
    return next(exceptions);
  }
}

export default { getFile }