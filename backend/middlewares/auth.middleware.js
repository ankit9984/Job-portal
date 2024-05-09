import jwt from 'jsonwebtoken';

// const SECRET_KEY = process.env.JWT_SECRET;

const generateToken = (paload) => {
    return jwt.sign(paload, process.env.JWT_SECRET, {expiresIn: '1h'});
};

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({error: 'Unauthorized (missing token)'});
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({error: 'Unauthorized (Invalid token)'});
    }
}

export {
    generateToken,
    verifyToken
}