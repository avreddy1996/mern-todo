const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = '';

    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if (Validator.isEmpty(data.name)) {
        errors += "Name field is required\n";
    }

    if (Validator.isEmpty(data.email)) {
        errors += "Email field is required\n";
    } else if (!Validator.isEmail(data.email)) {
        errors += "Email is invalid\n";
    }

    if (Validator.isEmpty(data.password)) {
        errors += "Password field is required\n";
    }

    if (Validator.isEmpty(data.password2)) {
        errors += "Confirm password field is required\n";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors += "Password must be at least 6 characters\n";
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors += "Passwords must match\n";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};