/**
 * Created by Ari Porad on 8/29/15.
 */

module.exports.statusCodesToErrCodes = function statusToErrCodes(errCodes) {
  return function* statusCodesToErrCodes(next) {
    try {
      yield next;
      if (this.response.status === 404 && !this.response.body) {
        const err = new Error('Not Found');
        err.code = errCodes[`${this.response.status}`];
        throw err;
      }
    } catch (err) {
      err.code = err.code || errCodes[`${err.code}`];
      if (!err.code) {
        if (this.response.status && this.response.status !== 404) {
          err.code = `E${this.response.status}STATS`;
        } else {
          err.code = errCodes['500'] || 'EERRERROR';
        }
      }
      throw err;
    }
  };
};

module.exports.validateErrorCode = function validateErrorCodes() {
  return function* validateErrorCode(next) {
    try {
      yield next;
    } catch (err) {
      if (!(typeof err.code === 'string' && err.code.charAt(0) === 'E' && err.code.length === 9)) {
        const newErr = new Error(`Invalid Error Code: ${err.code}`);
        newErr.code = 'EBADERROR';
        throw newErr;
      } else {
        throw err;
      }
    }
  };
};
