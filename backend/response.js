const success = (res, response, code) => {
  res.status(code || 200).json({
    error: false,
    code: code || 200,
    response,
  });
};

const successList = (res, response, page, limit, total, code) => {
  res.status(code || 200).json({
    error: false,
    code: code || 200,
    response: {
      data: response,
      page: page,
      limit: limit,
      total: total,
      totalPage: parseInt(Math.ceil(total / limit), 10),
    },
  });
};

const error = (res, errorString, code) => {
  res.status(code || 500).json({
    error: true,
    code: code || 500,
    message: errorString,
  });
};

module.exports = {
  success,
  successList,
  error,
};