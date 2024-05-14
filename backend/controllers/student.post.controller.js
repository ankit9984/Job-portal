import Student from "../models/student.model.js";
import StudentPost from "../models/student.post.model.js";

const createNewPost = async (req, res) => {
    try {
        const {userId} = req.user;
        const {author, content, isPublic} = req.body;

        const student = await Student.findById(userId);
        if(!student){
            return res.status(404).json({error: 'Student not found'})
        };

        const isPublicOrPrivate = isPublic || true;

        const newPost = new StudentPost({
            author: userId,
            content,
            isPublic: isPublicOrPrivate
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

const updatePost = async (req, res) => {
    try {
        const {userId} = req.user;
        const {postId} = req.params;
        const {content, isPublic} = req.body;
        
        const post = await StudentPost.findById(postId);
        if(!post){
            return res.status(404).json({error: 'Post not found'})
        }
        
        if(post.author.toString() !== userId){
            return res.status(403).json({error: 'You are not authorized to update this post'})
        }

        post.content = content || post.content;
        post.isPublic = isPublic || post.isPublic;

        const updatePost = await post.save();

        res.status(200).json({message: 'Post updated successfully', updatePost})
    } catch (error) {
        console.error('Error in updatePost controller: ', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

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

const getHisAllPublicPost = async (req, res) => {
    try {
        const {userId} = req.user;
        const hisPublicPost = await StudentPost.find({author: userId, isPublic: true}).sort({datePosted: -1});
        res.status(200).json({message: 'Personal public post retrieved successfully', hisPublicPost});
    } catch (error) {
        console.error('Error in getHisPublicPost controller: ', error);
        res.status(500).json({message: 'Internal server error', error: error.message})
    }
}

const getHisAllPrivatePost = async (req, res) => {
    try {
        const {userId} = req.user;
        const hisPrivatePost = await StudentPost.find({author: userId, isPublic: false}).sort({datePosted: -1});
        res.status(200).json({message: 'Personal private post retrieved successfully', hisPrivatePost});
    } catch (error) {
        console.error('Error in hisPrivatePost controller: ', error);
        res.status(500).json({message: 'Internal server error', error: error.message})
    }
}

const getAllPost = async (req, res) => {
    try {
        const posts = await StudentPost.find({isPublic: true}).sort({datePosted: -1});
        res.status(200).json({message: 'Posts retrieved successfully', posts});
    } catch (error) {
        console.error('Error in getAllPost controller: ', error);
        res.status(500).json({message: 'Internal server error', error: error.message})
    }
}

export {
    createNewPost,
    updatePost,
    deletePost,
    getAllPost,
    getHisAllPublicPost,
    getHisAllPrivatePost
}