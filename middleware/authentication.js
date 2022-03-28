const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
   
    // attach the user to the parcel routes
    req.user = { userId: payload.userId, name: payload.name, role:payload.role }

    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}



const adminAuth = async (req,res,next)=>{

  if(req.user.role === "admin"){
    
    next()
  }else{

     throw new UnauthenticatedError('unauthorized user')
  }
}


const userAuth = async (req,res,next)=>{

  if(req.user.role === "user"){
    
    next()
  }else{
      throw new UnauthenticatedError('unauthorized user')
  }
}



module.exports ={ auth, adminAuth, userAuth}
