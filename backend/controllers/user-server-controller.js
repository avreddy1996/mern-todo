const mongoose = require("mongoose");
const Data = require("./../model/user-server-model");
userController = {
    getUserData : function (req, res, next) {
        Data.find((err, data) => {
            if (err) return res.json({success: false, error: err});
            return res.json({success: true, data: data});
        });
    },
    saveUserData : function (req,res,next) {
        let data = new Data();
        const { message } = req.body;
        if (!message) {
            return res.json({
                success: false,
                error: "INVALID INPUTS"
            });
        }
        data.message = message;
        data.save(err => {
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true });
        });
    },
    deleteData : function (req, res){
    const { id } = req.body;
    Data.findOneAndDelete({"_id":mongoose.Types.ObjectId(id)}, err => {
        if (err) return res.send(err);
        return res.json({ success: true });
    });
}
};
module.exports = userController;