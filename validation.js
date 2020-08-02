// validation

const Joi= require('@hapi/joi')


//signup validation
const signupValidation = data => {
const schema = {
    mail: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
};

return schema.validate(data, schema)
};

const loginValidation= data => {
    const schema = {
        mail: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    };
    
    return schema.validate(data, schema)
    };

module.exports.signupValidation = signupValidation;
module.exports.loginValidation= loginValidation;
