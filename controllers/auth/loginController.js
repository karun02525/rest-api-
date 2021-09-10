import Joi from "joi";
import { RefreshToken,User } from "../../models";
import bcrypt from 'bcrypt'
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from '../../services/JwtService'
import {REFRESH_SECRET} from '../../config';


const loginController ={

   async login(req,res,next){
        //validation
        const loginSchema = Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });

        const {error} = loginSchema.validate(req.body);

        if(error){
            return next(error)
        }

        
        try {
            const user = await User.findOne({email:req.body.email});

            if(!user){
                return next(CustomErrorHandler.wrongCredentials() )
            }

             console.log(user,req.body.password);
            //comapre the password
            const match = await bcrypt.compare(req.body.password,user.password)
            if(!match){
                return next(CustomErrorHandler.wrongCredentials())
            }

            
            //token
          const  access_token=JwtService.sign({_id:user._id,role:user.role})

          const refresh_token=JwtService.sign({_id:user._id,role:user.role},'1y',REFRESH_SECRET)

           //database whitelist
           await RefreshToken.create({token:refresh_token});


          res.json({access_token,refresh_token})
 
            
        } catch ( error) {
            return next(error);
        }   
   },

   async logout(req,res,next){

      //validation
      const refreshTokenSchema = Joi.object({
        refresh_token: Joi.string().required(),
      });
  
      const { error } = refreshTokenSchema.validate(req.body);
  
      if (error) {
        return next(error);
      }

    try {
        await RefreshToken.deleteOne({token:req.body.refresh_token });
        
    } catch (error) {
        return next(new Error('someting went wrong in the database'))
    }

    res.json({status:'ok'})
   }
  
}

export default loginController;