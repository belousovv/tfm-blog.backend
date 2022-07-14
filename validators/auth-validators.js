import { body } from 'express-validator'

export const registerValidator = [
  body('name', 'Имя должно быть не менее 3 символов').isLength({ min: 3 }),
  body('email', 'Почта указана не корректно').isEmail(),
  body('password', 'Пароль должен имень не менее 5 символов').isLength({
    min: 5,
  }),
]

export const loginValidator = [
  body('email', 'Почта указана не корректно').isEmail(),
  body('password', 'Не верный формат пароля').isString(),
]
