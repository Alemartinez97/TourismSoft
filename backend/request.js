const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const getPagination = req => {
  var page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) {
    page = DEFAULT_PAGE;
  }
  var limit = parseInt(req.query.limit, 10);
  if (isNaN(limit) || limit < 1) {
    limit = DEFAULT_LIMIT;
  }
  var offset = (page - 1) * limit;
  return {
    page,
    limit,
    offset,
  };
};

const getUserId = req => {
  return req.get('AUTH_USER_ID');
};

module.exports = {
  getPagination,
  getUserId,
};
