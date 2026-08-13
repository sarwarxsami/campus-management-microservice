// Expects login-service to forward user info via headers after JWT validation.
// Header: x-user-type: "1" means Admin
function adminOnly(req, res, next) {
  const userType = req.headers["x-user-type"];

  if (userType === undefined || userType === null) {
    return res.status(403).json({
      error: "Forbidden",
      message: "Admin access required",
    });
  }

  if (String(userType) !== "1") {
    return res.status(403).json({
      error: "Forbidden",
      message: "Admin access required",
    });
  }

  next();
}

module.exports = adminOnly;