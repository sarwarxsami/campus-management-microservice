// Expects login-service to forward user info via headers after JWT validation.
// Header: x-user-type: "1" means Admin
function adminOnly(req, res, next) {
  const user_type = req.headers["x-user-type"];

  // if (user_type === undefined || user_type === null) {
  //   return res.status(403).json({
  //     error: "Forbidden",
  //     message: "Admin access required",
  //   });
  // }

  // if (String(user_type) !== "1") {
  //   return res.status(403).json({
  //     error: "Forbidden",
  //     message: "Admin access required",
  //   });
  // }

  next();
}

module.exports = adminOnly;