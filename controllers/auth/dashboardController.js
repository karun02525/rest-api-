import { User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const dashboardController = {

    async dashboard(req,res,next){

        try {
            const user = await User.findOne({_id:req.user._id}).select('-password -__v -updatedAt')

            if(!user){
                return next(CustomErrorHandler.notFound());
            }

            res.json(user);

        } catch (error) {
            return next(error)
        }

    }

}

export default dashboardController;