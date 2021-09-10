import Joi from "joi";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";
import {REFRESH_SECRET} from '../../config';


const refreshTokenController = {
  async refreshToken(req, res, next) {
    //validation
    const refreshTokenSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshTokenSchema.validate(req.body);

    if (error) {
      return next(error);
    }


    //database 
    let refreshtoken;
    try {
        
        refreshtoken= await RefreshToken.findOne({token:req.body.refresh_token});

        if(!refreshtoken){
            return next(CustomErrorHandler.unAuthorized('Invalid refesh token'));
        }


        let userId;
        try {
            const {_id} = await JwtService.verify(refreshtoken.token,REFRESH_SECRET)
            userId=_id
        } catch (error) {
            return next(CustomErrorHandler.unAuthorized('Invalid refesh token'));
        }

        const user =await User.findOne({_id:userId});
        if(!user){
            return next(CustomErrorHandler.notFound('No user found'));
        }


           //token
           const  access_token=JwtService.sign({_id:user._id,role:user.role})

           const refresh_token=JwtService.sign({_id:user._id,role:user.role},'1y',REFRESH_SECRET)
 
            //database whitelist
            await RefreshToken.create({token:refresh_token});
 
 
           res.json({access_token,refresh_token})



    } catch (error) {
        return next(new Error('something went wrong '+ error.message));
    }

  },
};

export default refreshTokenController;
