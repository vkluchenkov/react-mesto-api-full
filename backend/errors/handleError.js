module.exports.handleError = ({ err, res }) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'На сервере произошла ошибка';
  res.status(statusCode).send({ message });
};
