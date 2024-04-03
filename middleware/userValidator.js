const { check, body, validationResult } = require('express-validator');
const CustomError = require('../utils/AppError');

class Validate {
  //--------------
  #validationTemplates = {
    //--------------
    emailFirstCharacter: body('email').custom((value) => {
      if (!/^[a-zA-Z0-9]+$/gm.test(value[0])) {
        throw new Error('Invalid first character');
      }
      return true;
    }),
    isEmail: check('email', 'Email field is incorrect').isEmail(),
    //--------------
    isEmailStopSymbol: check('email', 'The email contains invalid characters')
      // .not()
      // psosible symbol @ $ # ! ? - _ .
      .matches(/^[a-zA-Z0-9@$#!?-_.]+$/gm),
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
      this.#validationTemplates.emailFirstCharacter,
      this.#validationTemplates.isEmail,
      this.#validationTemplates.isEmailStopSymbol,

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

      if (result.isEmpty()) {
        return next();
      }

      const errorsArray = result
        .formatWith(({ msg, value }) => {
          return { value, msg };
        })
        // To get only the fields set in the function formatWith()
        .array();
      const errorData = {
        status: 'fail',
        msg: errorsArray[0]?.msg,
        validatorErrors: errorsArray,
      };

      next(new CustomError(errorData.msg, 403, errorsArray));
      // res.status(400).json({ errors: errorData });
    };
  };
}

module.exports = new Validate();
