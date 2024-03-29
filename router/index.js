const Router = require('express').Router;
const router = new Router();

const authChecker = require('../middleware/authChecker');
const validate = require('../middleware/userValidator');

const userController = require('../controllers/userController');

router.post('/login', validate.validateLogin(), userController.login);

router.post(
  '/registration',
  validate.validateLogin(),
  userController.registration,
);
router.get('/logout', authChecker, userController.logOut);

router.post('/auth', userController.auth);
router.get('/activate/:link');
// router.get('/refresh');

module.exports = router;
