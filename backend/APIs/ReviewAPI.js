const express=require("express")
const review=express.Router()
const UserReviews=require("../models/Review")
const auth=require("../middlewares/auth")

review.get("/:productId",async(req,res)=>{
  try{
    const {productId}=req.params
    const reviews=await UserReviews.find({productId})
    if(reviews.length===0){
      return res.json({reviews:[],avgRating:0})
    }
    const avgRating=reviews.reduce((s,r)=>s+r.rating,0)/reviews.length
    res.json({reviews,avgRating:Number(avgRating.toFixed(1))})
  }catch(err){
    res.status(500).json({message:"Failed to fetch reviews"})
  }
})

review.post("/",auth,async(req,res)=>{
  try{
    const buyerId=req.user.userId
    const {productId,rating,comment}=req.body
    if(!productId||!rating){
      return res.status(400).json({message:"Missing fields"})
    }
    const exists=await UserReviews.findOne({buyerId,productId})
    if(exists){
      return res.status(409).json({message:"Review already exists"})
    }
    const newReview=await UserReviews.create({
      buyerId,
      productId,
      rating,
      comment
    })
    res.status(201).json(newReview)
  }catch(err){
    res.status(500).json({message:"Failed to add review"})
  }
})

review.put("/:id",auth,async(req,res)=>{
  try{
    const buyerId=req.user.userId
    const {rating,comment}=req.body
    const reviewDoc=await UserReviews.findById(req.params.id)
    if(!reviewDoc){
      return res.status(404).json({message:"Review not found"})
    }
    if(reviewDoc.buyerId.toString()!==buyerId){
      return res.status(403).json({message:"Not authorized"})
    }
    if(rating!==undefined) reviewDoc.rating=rating
    if(comment!==undefined) reviewDoc.comment=comment
    await reviewDoc.save()
    res.json(reviewDoc)
  }catch(err){
    res.status(500).json({message:"Failed to update review"})
  }
})

review.delete("/:id",auth,async(req,res)=>{
  try{
    const buyerId=req.user.userId
    const reviewDoc=await UserReviews.findById(req.params.id)
    if(!reviewDoc){
      return res.status(404).json({message:"Review not found"})
    }
    if(reviewDoc.buyerId.toString()!==buyerId){
      return res.status(403).json({message:"Not authorized"})
    }
    await reviewDoc.deleteOne()
    res.json({message:"Review deleted"})
  }catch(err){
    res.status(500).json({message:"Failed to delete review"})
  }
})

module.exports=review
