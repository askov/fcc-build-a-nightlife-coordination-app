module.exports = {
  validateRegistrationData: function(data) {
    const name = data.displayName.trim();
    const password = data.password.trim();
    const email = data.email.trim();

    if (name.length < 3 || name.length > 20) {
      return false;
    }
    if (password.length < 6 || password.length > 32) {
      return false;
    }
    if (stringContainsWhiteSpace(password)) {
      return false;
    }
    if (email.length < 8 || email.length > 32) {
      return false;
    }
    if (stringContainsWhiteSpace(email)) {
      return false;
    }
    return true;
  },
  validateLocationParams: function(query) {
    const params = JSON.stringify(query);
    return /{"lat":"-?(\d){1,3}\.(\d){1,6}","lon":"-?(\d){1,3}\.(\d){1,6}"}$/g.test(params);
  }
};

function stringContainsWhiteSpace(str) {
  return /\s/g.test(str);
}
