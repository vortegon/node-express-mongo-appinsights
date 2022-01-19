import { Router } from 'express';

const healthRouter = Router();

healthRouter.route('/').get(function health(req, res) {
  res.send('Healthy');
});

export default healthRouter;
