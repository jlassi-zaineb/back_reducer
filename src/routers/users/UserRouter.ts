import { NextFunction, Request, Response, Router } from 'express';
import * as userController from '../../controllers/UserController';
import { User , create, findOne, findAll, update, deleteOne } from '../../model/user/UserModel';
import { UserCreateRequest } from '../../dto/user/UserCreateRequest';
import { UserUpdateRequest } from '../../dto/user/UserUpdateRequest';

class UserRouter {
  private _router = Router();
  private _controller = userController;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  private _configure() {
    this._router.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.status(200).json("🦆");
    });

    /********************** */
    /**** ROUTE : CREATE  **** */
    /********************* */
    this._router.post('/create', async (req: Request<{}, {}, UserCreateRequest>, res: Response) => {
      const request: UserCreateRequest = req.body;

      await this._controller.create(request).then((result) => {
        // Status : 201 CREATED

        return res.status(201).json({ "message": `Created at index ${result}` });
      }).catch((error) => {
        // Status : 500 INTERNAL_SERVER_ERROR (Request Error)

        return res.status(error.httpCode).json({ "message": `${error.message}` });
      });
    });

    /********************** */
    /**** ROUTE : FIND ONE ** */
    /********************* */
    this._router.get('/find-one/:id', async (req: Request, res: Response) => {
      const id: number = Number(req.params.id);

      await this._controller.findOne(id).then((result: User) => {
        // Status : 200 OK (Returned)
        return res.status(200).json({ "user": result });

      }).catch((error) => {
        // Status : 400 BAD_REQUEST (Not found) / 500 INTERNAL_SERVER_ERROR (Request Error)

        return res.status(error.httpCode).json({ "error": `${error.name}`, "message": `${error.message}` });
      });
    });

    /********************** */
    /**** ROUTE : FIND ALL ** */
    /********************* */
    this._router.get('/find-all', async (req: Request, res: Response) => {

      await this._controller.findAll().then((result: User[]) => {
        // Status : 200 OK (Returned)
        return res.status(200).json({ "user": result })

      }).catch((err) => {
        // Status : 500 INTERNAL_SERVER_ERROR (RequestError)

        return res.status(500).json({ "message": `${err.message}` });
      });
    });

    /********************** */
    /**** ROUTE : UPDATE ** */
    /********************* */
    this._router.put('/update', async (req: Request, res: Response) => {

      const request: UserUpdateRequest = req.body;

      this._controller.update(request).then((result: number) => {
        // Status : 200 OK (Updated)

        return res.status(200).json({ "message": `${result} rows updated.` })
      }).catch((error) => {
        // Status : 400 BAD_REQUEST (Not found) / 500 INTERNAL_SERVER_ERROR (Request Error)

        return res.status(error.httpCode).json({ "error": `${error.name}`, "message": `${error.message}` });
      });
    });

    /********************** */
    /**** ROUTE : DELETE** */
    /********************* */
    this._router.delete('/delete/:id', async (req: Request, res: Response) => {
      const id: number = Number(req.params.id);

      await this._controller.deleteOne(id).then((result: number) => {
        // Status : 200 OK (Deleted)

        return res.status(200).json({ "message": `${result} rows affected.` })
      }).catch((error) => {
        // Status : 500 INTERNAL_SERVER_ERROR (Request Error)

        return res.status(error.httpCode).json({ "error": `${error.name}`, "message": `${error.message}` });
      });
    });
  }
}

export = new UserRouter().router;