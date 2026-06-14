import User from "../models/User.js";
import Post from "../models/Post.js";

export const toggleWishlist = async (req, res) => {
   try {
      const {postId}= req.params;
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
        success: false,
        message: "User not found",
        });
       }

       const post = await Post.findById(postId);

       if (!post) {
        return res.status(404).json({
        success: false,
        message: "Post not found",
        });
       }
       
       if(post.createdBy.toString()=== user._id.toString()){
         return res.status(400).json({
            success:false,
            message:"you cannot wishlist your own post",
         });
       }

       const alreadySaved = user.wishlist.some(
        (id)=>id.toString()==postId
       );

       if(alreadySaved){
         user.wishlist.pull(postId);
         await user.save();

        return res.status(200).json({
        success: true,
        saved: false,
        message: "Removed from wishlist",
        });
       }

       user.wishlist.push(postId);
       await user.save();

       return res.status(200).json({
        success:true,
        saved:true,
        message:"Added to wishlist",
       });
   } catch(error) {
     return res.status(500).json({
        success:false,
        message:"Server Error",
        error:error.message,
     });
   }
};