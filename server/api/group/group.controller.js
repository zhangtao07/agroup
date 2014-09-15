'use strict';


// Get list of groups
exports.index = function(req, res) {
  req.models.group.one(function(err, group) {
    console.info(group);
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