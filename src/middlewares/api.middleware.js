const { verifyToken } = require("../utils/jwt");

module.exports = async (req, res, next) => {
    try {
        const token = req.get("authorization").split(" ")[1];
        console.log(token);
        
        if(!token){
            return res.status(403).json({
                message: "Token not ok",
            })
        };
        const decode = await verifyToken(token);
        console.log(decode);
        
        if(!decode){
            return res.status(401).json({
                message: "Not unthori",
            })
        }
       req.id = decode.id,
       next();
    } catch (error) {
        return res.json({
            message: "Ban khong co token"
        })
    }
}