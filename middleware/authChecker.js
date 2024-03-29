require('dotenv').config();

function authChecker(req, res, next) {
  if (req.session?.user) {
    next();
  } else {
    res.status(308).redirect(process.env.FRONT_BASE_URL + '/auth');
  }
}

module.exports = authChecker;
