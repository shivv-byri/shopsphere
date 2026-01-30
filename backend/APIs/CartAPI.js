const exp=require("express")
const cart=exp.Router()
const UserCart=require("../models/Cart")

cart.get("/:userId",async (req,res) => {
    let {userId}=req.params
    let user=await UserCart.findOne({userId})
    if(!user){
        return res.send({message:"No items in cart",payload:[]})
    }
    res.send({message:"Items fetched",payload:user.items})
})

cart.post("/add",async (req,res) => {
    let {userId,productId,sellerId,price,quantity}=req.body
    if(!userId||!productId||!sellerId||!price){
        return res.send({message:"Missing required fields"})
    }
    let user=await UserCart.findOne({userId})
    if(!user){
        let newCart=new UserCart({
            userId,
            items:[{
                productId,
                sellerId,
                price,
                quantity:quantity||1
            }]
        })
        await newCart.save()
        return res.send({message:"Cart created and item added",payload:newCart.items})
    }
    const itemIndex=user.items.findIndex(
        item=>item.productId.toString()===productId
    )
    if(itemIndex>-1){
        user.items[itemIndex].quantity+=quantity||1
    }else{
        user.items.push({
            productId,
            sellerId,
            price,
            quantity:quantity||1
        })
    }
    await user.save()
    res.send({message:"Item added to cart",payload:user.items})
})

cart.put("/update",async (req,res) => {
    try{
        let {userId,productId,quantity}=req.body
        const user=await UserCart.findOne({userId})
        if(!user){
            return res.status(404).send({message:"Cart not found"})
        }
        const itemIndex=user.items.findIndex(
            item=>item.productId.toString()===productId
        )
        if(itemIndex===-1){
            return res.status(404).send({message:"Product not found"})
        }
        if(quantity<=0){
            user.items.splice(itemIndex,1)
        }else{
            user.items[itemIndex].quantity=quantity
        }
        await user.save()
        res.send({message:"Cart updated",payload:user.items})
    }catch(err){
        res.status(500).send({message:"Failed to update cart"})
    }
})

cart.delete("/remove",async (req,res) => {
    try{
        let {userId,productId}=req.body
        const user=await UserCart.findOne({userId})
        if(!user){
            return res.status(404).send({message:"Cart not found"})
        }
        const itemIndex=user.items.findIndex(
            item=>item.productId.toString()===productId
        )
        if(itemIndex===-1){
            return res.status(404).send({message:"Product not found"})
        }
        user.items.splice(itemIndex,1)
        await user.save()
        res.send({message:"Cart removed",payload:user.items})
    }catch(err){
        res.status(500).send({message:"Failed to remove cart"})
    }
})

module.exports=cart
