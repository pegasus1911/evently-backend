// const jwt = require('jsonwebtoken');

// function verifyToken(req, res, next) {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     req.user = decoded.payload;
    
//     next();
//   } catch (err) {
//     res.status(401).json({ err: 'Invalid token.' });
//   }
// }

// module.exports = verifyToken;
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
    if (!token) return res.status(401).json({ err: 'No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;               // <-- was decoded.payload
    next();
  } catch (err) {
    res.status(401).json({ err: 'Invalid token.' });
  }
}

module.exports = verifyToken;
