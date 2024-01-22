import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const vendorAuthenticate = (req, res, next) => {
  try {
    const authorizationHeader = req.headers['authorization'];
    
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Access token is missing' });
    }

    const [bearer, accessToken] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !accessToken) {
      return res.status(401).json({ message: 'Invalid Authorization header format' });
    }

    const accessTokenSecretVendor = process.env.VENDOR_JWT_SECRET;

    // Verify the access token
    jwt.verify(accessToken, accessTokenSecretVendor, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid access token' });
      }

      // Set user information in the request for further use in route handlers
      req.vendorId = user.id;
      req.role = user.role;

      next(); // Continue to the next middleware or route handler
    });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { vendorAuthenticate };
