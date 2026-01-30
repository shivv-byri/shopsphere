const express=require("express")
const sellerRoute=express.Router()
const Seller=require("../models/Seller")

sellerRoute.get("/:userId",async (req,res) => {
    try{
        let {userId}=req.params
        const sellerData=await Seller.findOne({userId})
        if(!sellerData){
            return res.send({message:"Seller not found"})
        }
        res.send({message:"Fetched data",payload:sellerData})
    }catch(err){
        res.status(500).send({message:"Failed to fetch seller"})
    }
})

sellerRoute.post("/",async (req,res) => {
    try{
        let {userId,storeName,rating,isVerified}=req.body
        if(!userId||!storeName||rating===undefined||isVerified===undefined){
            return res.send({message:"All fields required"})
        }
        const sellerData=await Seller.findOne({userId})
        if(sellerData){
            return res.send({message:"Seller already exists"})
        }
        const seller=new Seller({
            userId,
            storeName,
            rating,
            isVerified
        })
        await seller.save()
        res.send({message:"Seller created",payload:seller})
    }catch(err){
        res.status(500).send({message:"Failed to create seller"})
    }
})

sellerRoute.put("/",async (req,res) => {
    try{
        let {userId,storeName,rating,isVerified}=req.body
        if(!userId){
            return res.send({message:"userId required"})
        }
        const sellerData=await Seller.findOne({userId})
        if(!sellerData){
            return res.send({message:"Seller not found"})
        }
        if(storeName!==undefined) sellerData.storeName=storeName
        if(rating!==undefined) sellerData.rating=rating
        if(isVerified!==undefined) sellerData.isVerified=isVerified
        await sellerData.save()
        res.send({message:"Seller updated",payload:sellerData})
    }catch(err){
        res.send({message:"Failed to update seller"})
    }
})

sellerRoute.delete("/:userId",async (req,res) => {
    try{
        let {userId}=req.params
        const sellerData=await Seller.findOne({userId})
        if(!sellerData){
            return res.send({message:"Seller not found"})
        }
        await Seller.deleteOne({userId})
        res.send({message:"Seller deleted"})
    }catch(err){
        res.status(500).send({message:"Failed to delete seller"})
    }
})

module.exports=sellerRoute
