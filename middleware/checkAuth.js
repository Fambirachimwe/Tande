import "dotenv/config"
import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {

    const token = req.headers['x-auth-token'];

    if (!token) {
        return res.sendStatus(401)
    } else {
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {

                if (err) return res.sendStatus(403);

                req.user = decoded;
                next()
            }
        )

    }
    // console.log('AUTH_TOKEN', token)

}


export default checkAuth;