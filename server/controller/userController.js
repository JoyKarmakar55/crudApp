import User from "../model/usermodel.js";



//create user api
export const create = async (req,res)=>{
    try {

        const userData = new User(req.body);
        if (!userData){
            return res.status(404).json({msg:"Employee not found"});
        }

        const savedData = await userData.save();
        res.status(200).json({msg:"Employee succesfully added",savedData});
        
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create Employee' });
            }
}

//get all user api

export const getAll = async (req,res)=>{
    try {
        const userData = await User.find();
        if(!userData){
            return res.status(404).json({msg:"Employee data not found"});
        }
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to load Employee data' });
    }
}

//get a particular user by id

export const getone = async (req,res)=>{
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({msg:"Employee not found"});

        }
        res.status(200).json(userExist);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to load Employee data' });
    }
}


//update user

export const update = async (req,res)=>{
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({msg:"Employee not found"});

        }
        const updatedData = await User.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json({msg:"Employee Updated Succesfully",updatedData})
    } catch (error) {
        console.error('Error Creating Employee:', error);
        res.status(500).json({ error: 'Failed to update Employee' });
    }
}


//delete user
export const deleteUser = async (req,res)=>{
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({msg:"Employee not found"});

        }
        await User.findByIdAndDelete(id);
        res.status(200).json({msg:"Employee successfully deleted"})
    } catch (error) {
        console.error('Error creating Employee:', error);
        res.status(500).json({ error: 'Failed to update Employee data' });
    }
}
