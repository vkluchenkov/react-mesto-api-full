const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');

const { NODE_ENV, JWT_SECRET } = process.env;

const modelToDto = ({ _doc }) => {
  const { password, __v, ...rest } = _doc;
  return { ...rest };
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (users) {
      const dtoUsers = users.map((user) => modelToDto(user));
      res.send(dtoUsers);
    } else throw new NotFoundError('Пользователей не найдено');
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) res.send(modelToDto(user));
    else throw new NotFoundError('Пользователь не найден');
  } catch (err) {
    next(err);
  }
};

module.exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) res.send(modelToDto(user));
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) throw new UnauthorizedError('Неправильный email или пароль');
    else {
      const match = await bcrypt.compare(password, user.password);

      if (!match) throw new UnauthorizedError('Неправильный email или пароль');
      else {
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        );

        res
          .cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          })
          .send(modelToDto(user))
          .end();
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hashed,
    });
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );

    res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
      .send(modelToDto(user))
      .end();
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные'));
    } else next(err);
  }
};

module.exports.updateMe = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (user) res.send(modelToDto(user));
    else throw new NotFoundError('Пользователь не найден');
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные'));
    } else next(err);
  }
};

module.exports.updateMeAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (user) res.send(modelToDto(user));
    else throw new NotFoundError('Пользователь не найден');
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные'));
    } else next(err);
  }
};
