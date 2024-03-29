const bcrypt = require('bcrypt');

const userService = require('../service/userService');

class UserController {
  async login(req, res) {
    try {
      let { email, password } = req.body;

      email = email.trim().toLowerCase();
      password = password.trim();

      const user = await userService.findUserFromEmail(email);

      if (!user) {
        res.status(401).json({ message: 'User and/or password not found' });
        return;
      }

      const isTrue = await bcrypt.compare(password, user.password);

      if (!isTrue) {
        res.status(401).json({ message: 'User and/or password not found' });
        return;
      }

      req.session.user = {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userRole: user.role,
        isConfirmed: user.isConfirmed,
      };
      req.session.save(() => {
        res.status(200).json({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          isConfirmed: user.isConfirmed,
        });
      });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  }

  async registration(req, res) {
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
        res.status(200).json({ msg: 'This email is already in use' });
        return;
      }

      req.session.user = {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userRole: user.role,
        isConfirmed: user.isConfirmed,
      };
      req.session.save(() => {
        res.status(200).json({
          userId: user.id,
          userEmail: user.email,
          isConfirmed: user.isConfirmed,
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  async auth(req, res) {
    try {
      if (req.session.user) {
        const data = {
          userId: req.session.user.userId,
          userName: req.session.user.userName,
          userEmail: req.session.user.userEmail,
        };
        res.status(200).json(data);
      } else {
        res.status(201).json({ msg: 'User is not authorized' });
      }
    } catch (error) {
      res.status(500).json({ msg: 'Server error during authorization' });
    }
  }

  async logOut(req, res) {
    console.log('PROCESS-', process.env.FRONT_BASE_URL);
    try {
      req.session.destroy((err) => {
        if (err) {
          console.log(err.message);
          res.status(401).json({ msg: 'Failed to log out' });
        } else {
          res.status(200).json({ msg: 'You have successfully logged out' });
        }
      });
      res.clearCookie('jwt_auth');
    } catch (error) {
      console.log('Error --> ', error.message);
      res.status(500).json({ msg: 'Server error during deauthentication' });
    }
  }
}

module.exports = new UserController();
