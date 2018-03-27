const _ = require('lodash');

module.exports = function (ctx, done) {
  switch(ctx.body.command) {
    case '/referral-app-add': 
      return appAdd(ctx, done);
    case '/referral-app-list': 
      return appList(ctx, done);
  }
  
  return done(null, generateErrorResponse("Unknown command."));
};

function appList(ctx, done) {
  ctx.storage.get(function (error, data) {
    data = data || { applications: [] };
    const applications = ctx.body.text ? _.filter(data.applications, function(app) {
      return app.name.toLowerCase().includes(ctx.body.text.toLowerCase());
    }) : data.applications;
    
    if (!applications.length) {
      return done(null, generateSuccessResponse("There are no applications yet. Use */referral-app-add* to add an application."));
    }
    
    const response = { attachments: applications.map(function(app) {
      return {
        "fallback": app.name,
        "color": "good",
        "text": app.name
      };
    })};
    
    return done(null, response);
  });
}

function appAdd(ctx,done) {
  if (!ctx.body.text) {
    return done(null, generateErrorResponse("Application name is required."));
  }
  
  const name = ctx.body.text;
  
  ctx.storage.get(function (error, data) {
    data = data || { applications: [] };
    
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
}

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
