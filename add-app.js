const _ = require('lodash');

function generateErrorResponse(text) {
  return {
        "attachments": [
            {
                "fallback": text,
                "color": "danger",
                "text": text
            }
        ]
    }
}

function generateSuccessResponse(text) {
  return {
    "attachments": [
      {
        "fallback": text,
        "color": "good",
        "text": text
      }
    ]
  };
}

module.exports = function (ctx, done) {
  if (!ctx.body.text) {
    return done(null, generateErrorResponse("Application name is required."));
  }
  
  const name = ctx.body.text;
  
  ctx.storage.get(function (error, data) {
    if (error) return cb(error);
    data = data || { applications: [] };
    
    console.log(data, name, _.find(data.applications, app => app.name === name));
    
    if (_.find(data.applications, app => app.name === name)) {
      return done(null, generateErrorResponse("Application with given name already exists."));
    }
    
    data.applications.push({
      name,
      codes: []
    });
  
    ctx.storage.set(data, function (error) {
      if (error) {
        if (error.code === 409) {
          return done(null, generateErrorResponse("Data conflict"));
        } else {
          console.log(error);
          return done(null, generateErrorResponse("Error"));
        }
      }
      
      return done(null, generateSuccessResponse(`Application "${name}" was added.`));
    });
  });
};
