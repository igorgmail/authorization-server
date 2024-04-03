require('dotenv').config();

function authChecker(req, res, next) {
  if (req.session?.user) {
    next();
  } else {
    // If there is no user, then redirect to the login page
    res.status(302).redirect(process.env.FRONT_BASE_URL + '/user/auth');
  }
}

module.exports = authChecker;
