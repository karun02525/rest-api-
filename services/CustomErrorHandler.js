class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.msg = msg;
  }

  static alreadyExist(message) {
    return new CustomErrorHandler(409, message);
  }

  static notFound(message='404 not found') {
    return new CustomErrorHandler(404, message);
  }

  static wrongCredentials(message='username or password is wrong!') {
    return new CustomErrorHandler(400, message);
  }

  static unAuthorized(message='unAuthorized') {
    return new CustomErrorHandler(401, message);
  }

}

export default CustomErrorHandler;
