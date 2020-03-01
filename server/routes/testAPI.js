var express = require('express');
var router = express.Router();

router.post('/test', async function(req, res, next) {
    console.log("zzzzz");
    if(req.body.id==1){
        return res.json({
            msg:"Welcome"
        });
    }
    else{
        return res.json({
            msg:"Error"
        });
    }
});

module.exports = router;