const mongoose = require("mongoose");
const Token = require("../models/token");
	

module.exports = {};
	

// find user by token
module.exports.tokenUser = async (string) => {
	const token = await Token.findOne({ token: string});
	if(token){
	    return token.userId;
	} else {
	    return false;
	}
	}
	// find token by user
module.exports.checkToken = async (userId) => {
	try {
	    const user = await Token.findOne( {userId: userId} )
	    return user.token;
	} catch (e) {
	    throw e;
	}
}
class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
	

