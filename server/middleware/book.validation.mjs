export const validateCreatBookData = (req,res,next) => {
    if(!req.body.title || (typeof req.body.title === 'string' && req.body.title.trim() === '')){
        return res.status(400).json({message: "Please enter the title."})
    }
    if(!req.body.category || (typeof req.body.category === 'string' && req.body.category.trim() === '')){
        return res.status(400).json({message: "Please enter the category."})
    }
    
    next();
};

