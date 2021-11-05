import { Router } from "express";
import TopicRouter from "./projects/TopicRouter";
import UserRouter from "./users/UserRouter";

class MasterRouter {
    private _router = Router();
    private _subrouterTopic = TopicRouter;
    private _subrouterUser = UserRouter;
  
    get router() {
        return this._router;
    }
    private _configure() {
        this._router.use('/topic', this._subrouterTopic)
        this._router.use('/user', this._subrouterUser)
        
        this._router.post('/log', function(req,res) {
            console.log(req.body)
            res.send({success : true})
          });
    }
   

    constructor() {
        this._configure();
    }
}

export = new MasterRouter().router;