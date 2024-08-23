// allowedRoles: e.g. only ['admin', 'editor'] could do this
// req.roles: e.g. if request send a 'user' role => reject
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if(!req?.roles) return res.sendStatus(401); // Unauthorized
    const rolesArray = [...allowedRoles];
    const result = req.roles.map(role => rolesArray.includes(role)) // ['user', 'admin'] => [false, true]
      .find(val => val === true); // if one of request's roles flags is "true" => allowing
    if (!result) return res.sendStatus(401); // Unauthorized
    next();
  }
}

module.exports = verifyRoles;