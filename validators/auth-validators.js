import { body } from 'express-validator'

export const registerValidator = [
  body('name', 'имя должно быть не менее 3 символов').isLength({ min: 3 }),
  body('email', 'не верно указана почта').isEmail(),
  body('password', 'пароль должен имень не менее 5 символов').isLength({
    min: 5,
  }),
]

export const loginValidator = [
  body('email', 'не верно указана почта').isEmail(),
  body('password', 'не верный формат пароля').isString(),
]
