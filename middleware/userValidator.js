const { check, validationResult } = require('express-validator');

class Validate {
  //--------------
  #validationTemplates = {
    //--------------
    isEmail: check('email', 'Email field is incorrect').isEmail(),
    //--------------
    isPasswordEmpty: check('password', 'Password field is incorrect')
      .trim()
      .not()
      .isEmpty(),
    //--------------
    isPasswordStopSymbol: check(
      'password',
      'The password contains invalid characters',
    )
      // .not()
      // psosible symbol @ $ # ! ?
      .matches(/^[a-zA-Z0-9@$#!?]+$/gm),
    //--------------
    passwordLength: check(
      'password',
      'The password must be a minimum of 5 and a maximum of 20 characters',
    )
      .trim()
      .isLength({ min: 5, max: 20 }),
  };

  validateLogin = () => {
    const validationRules = [
      this.#validationTemplates.isEmail,
      this.#validationTemplates.isPasswordEmpty,
      this.#validationTemplates.isPasswordStopSymbol,
      this.#validationTemplates.passwordLength,
    ];

    return async (req, res, next) => {
      for (let validation of validationRules) {
        const result = await validation.run(req);

        // first or all errors validate
        // if (result.errors.length) break;
      }

      const result = validationResult(req);

      const errorData = result
        .formatWith(({ msg, value }) => {
          return { value, msg };
        })
        // To get only the fields set in the function formatWith()
        .array();

      if (result.isEmpty()) {
        return next();
      }

      res.status(400).json({ errors: errorData });
    };
  };
}

module.exports = new Validate();
