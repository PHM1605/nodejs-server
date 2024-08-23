const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../model/User');
const User = require('../model/User');

const handleLogin = async (req, res) => {
  const {user, pwd} = req.body;
  if (!user || !pwd) return res.status(400).json({"message": "Username and password are required."});
  const foundUser = await User.findOne({username: user}).exec();
  if (!foundUser) return res.sendStatus(401); // Unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    // create JWTs
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
          "roles": roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '120s' }
    );
    const refreshToken = jwt.sign(
      {"username": foundUser.username},
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);
    console.log(roles);
    // NOTE: because of bug of Thunderclient, when set "secure: true" we won't see cookie locally => unauthorized. But turn this on in other cases or in prd
    //res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24*60*60*1000, sameSite: 'None', secure: true});
    res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24*60*60*1000, sameSite: 'None'});
    res.json({accessToken});
  } else {
    res.sendStatus(401); // Unauthorized
  }
}

module.exports = {handleLogin};