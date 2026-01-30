const exp=require("express")
const review=exp.Router();
const UserReviews=require("../models/Review")

review.get("/:productId",async (req,res) => {
    try{
        let {productId}=req.params
        const reviews=await UserReviews.find({productId});
        if(reviews.length===0){
            return res.send({
                message:"No reviews yet",
                payload:{
                    reviews:[],
                    avgRating:0
                }
            })
        }
        const avgRating=
        reviews.reduce((sum,r)=>sum+r.rating,0)/reviews.length
        res.send({
            message:"Reviews fetched",
            payload:{
                reviews,
                avgRating:avgRating.toFixed(1)
            }
        })
    }catch(err){
        res.status(500).send({message:"Failed to fetch reviews"})
    }
})

review.post("/",async (req,res) => {
    try{
        let {buyerId,productId,rating,comment}=req.body
        if(!buyerId||!productId||!rating){
            return res.send({message:"Provide required fields"})
        }
        const existing=await UserReviews.findOne({buyerId,productId})
        if(existing){
            return res.send({message:"Review already exists"})
        }
        let newReview=new UserReviews({
            buyerId,
            productId,
            rating,
            comment
        })
        await newReview.save()
        res.send({message:"Review added",payload:newReview})
    }catch(err){
        res.status(500).send({message:"Failed to add review"})
    }
})

review.put("/:id",async (req,res) => {
    try{
        let {id}=req.params
        let {buyerId,rating,comment}=req.body
        const reviewDoc=await UserReviews.findById(id)
        if(!reviewDoc){
            return res.status(404).send({message:"Review not found"})
        }
        if(reviewDoc.buyerId.toString()!==buyerId){
            return res.status(403).send({message:"Not authorized"})
        }
        if(rating) reviewDoc.rating=rating
        if(comment) reviewDoc.comment=comment
        await reviewDoc.save()
        res.send({message:"Review updated",payload:reviewDoc})
    }catch(err){
        res.status(500).send({message:"Failed to update review"})
    }
})
review.delete("/:id",async (req,res) => {
    try{
        let {id}=req.params;
        let {buyerId,rating,comment}=req.body
        const reviewDoc=await UserReviews.findById(id)
        if(!reviewDoc){
            return reviewDoc.status(404).send({message:"Review not found"})
        }
        if(user.buyerId.toString() !== buyerId) {
            return reviewDoc.status(403).send({ message: "Not authorized" });
        }
        await UserReviews.findByIdAndDelete(id);
        res.send({ message: "Review deleted successfully" });
    }catch(err){
        res.status(500).send({message:"Failed to delete review"})
    }
})
module.exports=review
