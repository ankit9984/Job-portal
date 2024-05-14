import Student from "../models/student.model.js";
import StudentPost from "../models/student.post.model.js";

const createNewPost = async (req, res) => {
    try {
        const {userId} = req.user;
        const {author, content} = req.body;

        const student = await Student.findById(userId);
        if(!student){
            return res.status(404).json({error: 'Student not found'})
        };

        const newPost = new StudentPost({
            author: userId,
            content
        });

        const savePost = await newPost.save();

        const updateStudent = await Student.findByIdAndUpdate(userId, {$push: {posts: newPost._id}}, {new: true});
        await updateStudent.save();

        res.status(200).json({message: 'Post created successfully', savePost})
    } catch (error) {
        console.error('Error in createNewPost controller: ', error);
        res.status(500).json({message: 'Internal server error', error: error.message})
    }
};

const deletePost = async (req, res) => {
    try {
        const {userId} = req.user;
        const {postId} = req.params;

        const student = await Student.findById(userId);
        if(!student){
            return res.status(404).json({error: 'Student not found'})
        }

        const post = await StudentPost.findById(postId);
        if(!post){
            return res.status(404).json({error: 'post not found'})
        }
        
        if(post.author.toString() !== userId){
            console.log(post.author, userId);
            return res.status(404).json({error: 'You are not authorized for delete this post'})
        };

        await StudentPost.findByIdAndDelete(postId);
        await Student.findByIdAndUpdate(userId, {$pull: {posts: postId}}, {new: true});

        res.status(200).json({message: 'Post removed successfully'})
    } catch (error) {
        console.error('Error in deletePost controller: ', error);
        res.status(500).json({message: 'Internal server error', error: error.message})
    }
}

const getAllPost = async (req, res) => {
    try {
        const posts = await StudentPost.find().sort({datePosted: -1});
        res.status(200).json({message: 'Posts retrieved successfully', posts})
    } catch (error) {
        console.error('Error in getAllPost controller: ', error);
        res.status(500).json({message: 'Internal server error', error: error.message})
    }
}

export {
    createNewPost,
    deletePost,
    getAllPost
}