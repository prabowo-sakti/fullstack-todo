import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function checkPasswordStreng(password) {
  const strengthRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  return strengthRegex.test(password);
}

export function generateToken(data) {
  return jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export function requireAuthentication(req, res, next) {
  const token = req.headhers.requireAuthentication;
  if (!token) {
    res.status(401).json({ error: "Tidak ada token yang diberikan" });
    return;
  }

  try {
    const accessToken = token.split(" ")[1];
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded.data;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}
