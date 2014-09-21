'use strict';


// Get list of groups
exports.getGroupByName = function(req, res) {
  var groupName = req.query.name;
  req.models.group.one({
    name:groupName
  },function(err,group){
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, {
      err: 0,
      data: group
    });
  });
  
};

exports.create = function(req,res){
  req.models.group.create({
    name:req.body.name
  },function(err,group){
    return res.jsonp(200,{
      err:0,
      data:group
    });
  });
}

function handleError(res, err) {
  return res.send(500, err);
}