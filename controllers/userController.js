const bcrypt = require('bcrypt');

const userService = require('../service/userService');
const CustomError = require('../utils/AppError');

class UserController {
  // asyncErrorHandler = (fn) => {
  //   return(req,res,next) => {
  //     fn(req,res,next).catch()
  //   }
  // }

  async login(req, res, next) {
    try {
      let { email, password } = req.body;

      email = email.trim().toLowerCase();
      password = password.trim();

      const user = await userService.findUserFromEmail(email);

      if (!user) {
        next(new CustomError('User and/or password not found', 401));
        return;
      }

      const isTrue = await bcrypt.compare(password, user.password);

      if (!isTrue) {
        next(new CustomError('User and/or password not found', 401));
        return;
      }

      req.session.user = { ...user };

      const userData = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        isConfirmed: user.isConfirmed,
      };
      req.session.save(() => {
        res.status(200).json({
          status: 'success',
          msg: 'Successful login',
          data: userData,
        });
      });
    } catch (error) {
      console.log('▶ ⇛ error:', error);
      next(new CustomError('Server Error', 500));
    }
  }

  async registration(req, res, next) {
    try {
      let { email, password } = req.body;

      email = email.trim().toLowerCase();

      password = password.trim();

      const passwordHash = await bcrypt.hash(password, 10);

      const [user, isCreated] = await userService.findOrCreate(
        email,
        passwordHash,
      );

      if (!isCreated) {
        res
          .status(201)
          .json({ status: 'fail', msg: 'This email is already in use' });
        return;
      }

      req.session.user = { ...user };

      const userData = {
        userId: user.id,
        userEmail: user.email,
        isConfirmed: user.isConfirmed,
      };

      req.session.save(() => {
        res.status(200).json({
          status: 'success',
          msg: 'Successful registration',
          data: userData,
        });
      });
    } catch (error) {
      console.log('▶ ⇛ error:', error);
      next(new CustomError('Server Error', 500));
    }
  }

  async auth(req, res) {
    try {
      if (req.session.user) {
        const userData = {
          userId: req.session.user.id,
          userName: req.session.user.name,
          userEmail: req.session.user.email,
        };

        res.status(200).json({
          status: 'success',
          msg: 'User is authorized',
          data: userData,
        });
      } else {
        res.status(201).json({ status: 'fail', msg: 'User is not authorized' });
      }
    } catch (error) {
      console.log('▶ ⇛ error:', error);
      next(new CustomError('Server error during authorization', 500));
    }
  }

  async logOut(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          next(new CustomError('Failed to log out', 503));
        } else {
          res.status(200).json({
            status: 'success',
            msg: 'You have successfully logged out',
          });
        }
      });
      res.clearCookie(process.env.SESSION_NAME);
    } catch (error) {
      console.log('▶ ⇛ error:', error);
      next(new CustomError('Server error during deauthentication', 500));
    }
  }
}

module.exports = new UserController();
