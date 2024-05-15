import Student from "../models/student.model.js";
import StudentPost from "../models/student.post.model.js";
import StudentComment from "../models/student.postComment.model.js";

const createComment = async (req, res) => {
    try {
        const {userId} = req.user;
        const {postId} = req.params;
        const {content} = req.body;

        const student = await Student.findById(userId);
        if(!student){
            return res.status(404).json({error: 'Student not found'})
        };

        const post = await StudentPost.findById(postId);
        if(!post){
            return res.status(404).json({error: 'Post not found'});
        };

        const newComment = new StudentComment({
            author: userId,
            post: postId,
            content
        });

        if(content == ''){
            return res.status(404).json({error: 'Please provide content'})
        }

        const saveComment = await newComment.save();

        const updatePost = await StudentPost.findByIdAndUpdate(postId, {$push: {comments: newComment._id}}, {new: true});
        await updatePost.save();

        const updateStudent = await Student.findByIdAndUpdate(userId, {$push: {comments: newComment._id}}, {new: true});
        await updateStudent.save();

        res.status(200).json({message: 'Comment created successfully', saveComment})
    } catch (error) {
        console.error('Error in createComment controller: ', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const updateComment = async (req, res) => {
    try {
        const {userId} = req.user;
        const {commentId} = req.params;
        const {content} = req.body;

        const comment = await StudentComment.findById(commentId);
        if(!comment){
            return res.status(404).json({error: 'Comment not found'})
        };

        if(comment.author.toString() !== userId){
            return res.status(404).json({error: 'You are not authorized to update this comment'})
        };

        comment.content = content || comment.content;

        const updateComment = await comment.save();

        res.status(200).json({message: 'Comment updated successfully', updateComment})
    } catch (error) {
        console.error('Error in updateComment controller: ', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const deleteComment = async (req, res) => {
    try {
        const {userId} = req.user;
        const {commentId} = req.params;

        const comment = await StudentComment.findById(commentId);
        if(!comment){
            return res.status(404).json({error: 'Comment not found'});
        }

        if(comment.author.toString() !== userId){
            return res.status(403).json({error: 'You are not authorized to delete'})
        };


        await StudentPost.findByIdAndUpdate(comment.post, {$pull: {comments: commentId}});
        await Student.findByIdAndUpdate(userId, {$pull: {comments: commentId}}, {new: true});

        await StudentComment.findByIdAndDelete(commentId);

        res.status(200).json({message: 'Comment deleted successfully'})
    } catch (error) {
        console.error('Error in deleteComment controller: ', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const getCommentsByPost = async (req, res) => {
    try {
        const {postId} = req.params;

        const comments = await StudentComment.find({post: postId}).sort({createdAt: -1});

        if(comments === 0){
            return res.status(200).json({message: 'No comments found'})
        };

        res.status(200).json({message: 'Comments retrieved successfully', comments})
    } catch (error) {
        console.error('Error in getCommentsByPost controller: ', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export {
    createComment,
    updateComment,
    deleteComment,
    getCommentsByPost
}