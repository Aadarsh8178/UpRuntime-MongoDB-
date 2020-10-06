/*
 * Request handlers
 */
//Dependencies
var _data = require("./data");
var helpers = require("./helpers");
var config = require("./config");
var mongoose = require("mongoose");
var User = require("../models/users");
var Checks = require("../models/checks");
//define handlers
var handlers = {};

/**
 * HTML Handlers
 */

//Index handler
handlers.index = async (data, callback) => {
  //Reject any request that isn't a GET
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Uptime Monitoring - Made Simple",
      "head.description":
        "We offer free,simple uptime monitoring for HTTP/HTTPS site of all kinds. When your site goes down, we'll send you a text to let you know",
      "body.class": "index",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("index", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Create Account Handler
handlers.accountCreate = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Create an Account",
      "head.description": "Signup is easy and only takes a few seconds",
      "body.class": "accountCreate",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("accountCreate", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Create a session (login)
handlers.sessionCreate = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Login to your Account",
      "head.description":
        "Please enter your phone number and password to access your account",
      "body.class": "sessionCreate",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("sessionCreate", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Delete a Session (logout)
handlers.sessionDeleted = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Logged out",
      "head.description": "You have been Logged out",
      "body.class": "sessionDeleted",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("sessionDeleted", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Edit Account
handlers.accountEdit = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Account Settings",
      "body.class": "accountEdit",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("accountEdit", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Account has been deleted
handlers.accountDeleted = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Account Deleted",
      "head.description": "Your account has been deleted",
      "body.class": "accountDeleted",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("accountDeleted", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Creating a new check
handlers.checksCreate = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Create a New Check",
      "body.class": "checksCreate",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("checksCreate", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Dashboard (view all checks)
handlers.checksList = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Dashboard",
      "body.class": "checksList",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("checksList", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Edit a check
handlers.checksEdit = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Check Details",
      "body.class": "checksEdit",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("checksEdit", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//favicon
handlers.favicon = async (data, callback) => {
  if (data.method === "get") {
    //Read the favicon'data
    try {
      var data = await helpers.getStaticAsset("favicon.ico");
      callback(200, data, "favicon");
    } catch (e) {
      callback(500);
    }
  } else {
    callback(405);
  }
};

//Public assests
handlers.public = async (data, callback) => {
  if (data.method === "get") {
    var trimmedAssetName = data.trimmedPath.replace("public/", "").trim();
    try {
      if (trimmedAssetName.length <= 0) {
        throw Error;
      }
      var data = await helpers.getStaticAsset(trimmedAssetName);
      //Determin the content type (default to plain text)

      let contentType = "plain";
      if (trimmedAssetName.indexOf(".css" > -1)) {
        contentType = "css";
      }
      if (trimmedAssetName.indexOf(".png") > -1) {
        contentType = "png";
      }
      if (trimmedAssetName.indexOf(".jpg") > -1) {
        contentType = "jpg";
      }
      if (trimmedAssetName.indexOf(".ico") > -1) {
        contentType = "favicon";
      }
      callback(200, data, contentType);
    } catch (e) {
      console.log(e);
      callback(404);
    }
  }
};

/*
 * JSON API Handlers
 */

//Ping handler
handlers.ping = (data, callback) => {
  callback(200);
};

//Users
handlers.users = (data, callback) => {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.includes(data.method)) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};
//Container for the user submethods
handlers._users = {};

//Users - post
handlers._users.post = async (data, callback) => {
  var userObject = {
    firstName: data.payload.firstName,
    lastName: data.payload.lastName,
    phone: data.payload.phone,
    password: data.payload.password,
    tosAgreement: data.payload.tosAgreement,
  };
  try {
    var user = new User(userObject);
    await user.save();
    callback(200, user.toJSON());
  } catch (e) {
    console.log(e);
    if (e.keyValue && e.keyValue.phone) {
      callback(400, { Error: "User already exist" });
    } else if (e.errors.password && e.errors.password.message)
      callback(400, { Error: e.errors.password.message });
    else {
      callback(400, { Error: "Missing required fields" });
    }
  }
};
//Users - get
handlers._users.get = async (data, callback) => {
  var phone = data.headers.phone;
  var token = data.headers.token;
  if (phone && token) {
    try {
      var user = await User.findOne({ phone: phone, tokens: token });
      callback(200, user.toJSON());
    } catch (e) {
      callback(404);
    }
  } else {
    callback(403);
  }
};
//Users - put
handlers._users.put = async (data, callback) => {
  var phone = data.payload.phone;
  phone =
    typeof phone === "string" && phone.trim().length === 10 ? phone : false;
  var firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;

  var lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;

  var password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone) {
    var token =
      typeof data.headers.token === "string" ? data.headers.token : false;
    if (firstName || lastName || password) {
      try {
        var user = await User.findOne({ phone: phone, tokens: token });
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        if (password) {
          user.password = password;
        }
        try {
          await user.save();
          callback(200);
        } catch (e) {
          if (e.errors.password && e.errors.password.message)
            callback(400, { Error: e.errors.password.message });
          else callback(500, { Error: e.errors.password.message });
        }
      } catch (e) {
        callback(400, { Error: "the specified user does not exist" });
      }
    } else {
      callback(404, { Error: "Missing fields to update" });
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};
//Users - delete
handlers._users.delete = async (data, callback) => {
  var phone = data.headers.phone;
  var token = data.headers.token;
  if (phone && token) {
    try {
      var user = await User.findOne({ phone: phone, tokens: token });
      if (!user) throw Error;
      try {
        await user.remove();
        callback(200);
      } catch (e) {
        console.log(e);
        callback(500, { Error: "Could not delete the user" });
      }
    } catch (e) {
      callback(403);
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Tokens
handlers.tokens = (data, callback) => {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.includes(data.method)) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the tokens methods
handlers._tokens = {};

//Token - post
handlers._tokens.post = async (data, callback) => {
  var phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;

  var password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  if (phone && password) {
    //Look the user who matches that phone number
    try {
      var user = await User.findbyCredentials(phone, password);
      //Create a new token with a random name.Set expiration date 1 hour
      try {
        var token = await user.generateAuthToken();
        callback(200, { token });
      } catch (e) {
        callback(500, { Error: "Could not create token" });
      }
    } catch (e) {
      callback(400, { Error: "Invalid phone or password" });
    }
  } else {
    callback(400, { Error: "Missing required field(s)" });
  }
};

//Token - get
//No need as no timer involves
// handlers._tokens.get = async (data, callback) => {
//   var id = data.queryStringObject.id;
//   id = typeof id === "string" && id.trim().length === 20 ? id : false;
//   if (id) {
//     //Lookup the user
//     try {
//       var token = await _data.read("tokens", id);
//       callback(200, token);
//     } catch (e) {
//       callback(404);
//     }
//   } else {
//     callback(400, { Error: "Missing required field" });
//   }
// };

//Token - put
//only extending token time allowed
// handlers._tokens.put = async (data, callback) => {
//   var id = data.payload.id;
//   id = typeof id === "string" && id.trim().length === 20 ? id : false;
//   var extend = data.payload.extend === true;
//   try {
//     if (!id || !extend) throw Error();

//     var token = await _data.read("tokens", id);
//     if (token.expires <= Date.now()) throw Error();

//     token.expires = Date.now() + 1000 * 60 * 60;
//     try {
//       await _data.update("tokens", id, token);
//       callback(200);
//     } catch (e) {
//       callback(500, { Error: "Could not update token" });
//     }
//   } catch (e) {
//     callback(400, {
//       Error: "Missing require field(s) or field(s) are invalid",
//     });
//   }
// };

//Token - delete
//Need to change this to a better approach
handlers._tokens.delete = async (data, callback) => {
  var id = data.queryStringObject.id;
  var phone = data.headers.phone;
  id = typeof id === "string" && id.trim().length === 20 ? id : false;
  if (id && phone) {
    try {
      const user = await User.findOne({ phone: phone });
      user.tokens.pull(id);
      await user.save();
      callback(200);
    } catch (e) {
      callback(400, { Error: "the specified token does not exist" });
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Verify if a given token is currently valid for the given user
// handlers._tokens.verifyToken = async (id, phone) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       var token = await _data.read("tokens", id);
//       if (token.phone === phone && token.expires > Date.now()) {
//         resolve(token);
//       } else {
//         throw Error;
//       }
//     } catch (e) {
//       reject();
//     }
//   });
// };

//Checks
handlers.checks = (data, callback) => {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.includes(data.method)) {
    handlers._checks[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the Checks methods
handlers._checks = {};

//Checks - post
handlers._checks.post = async (data, callback) => {
  var phone = data.headers.phone;
  var checkObject = {
    protocol: data.payload.protocol,
    url: data.payload.url,
    method: data.payload.method,
    successCodes: data.payload.successCodes,
    timeoutSeconds: data.payload.timeoutSeconds,
    userPhone: phone,
  };

  if (
    checkObject.protocol &&
    checkObject.url &&
    checkObject.method &&
    checkObject.successCodes &&
    checkObject.timeoutSeconds
  ) {
    try {
      var token =
        typeof data.headers.token === "string" ? data.headers.token : false;
      var user = await User.findOne({ phone: phone, tokens: token });
      if (user.checksCount < process.env.maxChecks) {
        try {
          //Save the Object
          checkObject.owner = user.id;
          var check = new Checks(checkObject);
          user.checksCount++;

          //Increasing number of check made by user
          await user.save();
          check.save();
          callback(200, checkObject);
        } catch (e) {
          console.log(e);
          callback(500, { Error: "Could not create the new check" });
        }
      } else {
        callback(400, {
          Error: `The user already has max number of checks ${process.env.maxChecks}`,
        });
      }
    } catch (e) {
      callback(403);
    }
  } else {
    callback(400, { Error: "Missing required filed(s)" });
  }
};

//Checks - get
handlers._checks.get = async (data, callback) => {
  //Check that the id provided is valid
  var phone = data.headers.phone;
  var token = data.headers.token;
  if (data.trimmedPath === "api/checks/all") {
    try {
      var user = await User.findOne({ phone: phone, tokens: token });
      var checks = await Checks.find({ owner: user.id });
      callback(200, checks);
    } catch (e) {
      console.log(e);
      callback(403);
    }
  } else {
    var id = data.queryStringObject.id;
    try {
      //Look up the check
      var user = await User.findOne({ phone: phone, tokens: token });
      var check = await Checks.findOne({ owner: user.id, _id: id });
      callback(200, check);
    } catch (e) {
      console.log(e);
      callback(403);
    }
  }
};

//Get All Checks
handlers._checks;
//Checks - put
handlers._checks.put = async (data, callback) => {
  //var phone = data.payload.phone;
  var id = data.payload.id;
  var phone = data.headers.phone;
  var token = data.headers.token;
  if (id && phone && token) {
    //Looking the check
    try {
      var user = await User.findOne({ phone: phone, tokens: token });
      var check = await Checks.findOne({ owner: user.id, _id: id });

      check.protocol = data.payload.protocol || check.protocol;
      check.url = data.payload.url || check.url;
      check.method = data.payload.method || check.method;
      check.successCodes = data.payload.successCodes || check.successCodes;
      check.timeoutSeconds =
        data.payload.timeoutSeconds || check.timeoutSeconds;
      try {
        await check.save();
        callback(200);
      } catch (e) {
        callback(400, { Error: "Invalid value of one or more update" });
      }
    } catch (e) {
      callback(403);
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Check - delete
handlers._checks.delete = async (data, callback) => {
  var id = data.queryStringObject.id;
  var phone = data.headers.phone;
  if (id && phone) {
    try {
      //Get the token from the header
      var token =
        typeof data.headers.token === "string" ? data.headers.token : false;
      var user = await User.findOne({ phone: phone, tokens: token });
      var check = await Checks.findOne({ _id: id, owner: user.id });
      user.checksCount--;
      check.remove();
      user.save();
      callback(200);
    } catch (e) {
      callback(403);
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};
//No unhandler
handlers.notFound = (data, callback) => {
  callback(404);
};

//Export handlers
module.exports = handlers;
