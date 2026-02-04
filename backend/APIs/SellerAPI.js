const express=require("express")
const sellerRoute=express.Router()
const Seller=require("../models/Seller")
const auth=require("../middlewares/auth")

sellerRoute.get("/:sellerId",async(req,res)=>{
  try{
    const seller=await Seller.findById(req.params.sellerId)
    if(!seller){
      return res.status(404).json({message:"Seller not found"})
    }
    res.json(seller)
  }catch(err){
    res.status(500).json({message:"Failed to fetch seller"})
  }
})

sellerRoute.post("/",auth,async(req,res)=>{
  try{
    const userId=req.user.userId
    const {storeName}=req.body
    if(!storeName){
      return res.status(400).json({message:"Store name required"})
    }
    const exists=await Seller.findOne({userId})
    if(exists){
      return res.status(409).json({message:"Seller already exists"})
    }
    const seller=await Seller.create({
      userId,
      storeName,
      rating:0,
      isVerified:true
    })
    res.status(201).json(seller)
  }catch(err){
    res.status(500).json({message:"Failed to create seller"})
  }
})

sellerRoute.put("/",auth,async(req,res)=>{
  try{
    const userId=req.user.userId
    const {storeName}=req.body
    const seller=await Seller.findOne({userId})
    if(!seller){
      return res.status(404).json({message:"Seller not found"})
    }
    if(storeName!==undefined) seller.storeName=storeName
    await seller.save()
    res.json(seller)
  }catch(err){
    res.status(500).json({message:"Failed to update seller"})
  }
})

sellerRoute.delete("/",auth,async(req,res)=>{
  try{
    const userId=req.user.userId
    const seller=await Seller.findOne({userId})
    if(!seller){
      return res.status(404).json({message:"Seller not found"})
    }
    await seller.deleteOne()
    res.json({message:"Seller deleted"})
  }catch(err){
    res.status(500).json({message:"Failed to delete seller"})
  }
})

module.exports=sellerRoute
