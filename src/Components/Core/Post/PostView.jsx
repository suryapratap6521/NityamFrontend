// Components/Core/Post/PostView.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPostById } from '../../../services/operations/postApi';
import SinglePost from './SinglePost';

const PostView = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { post } = useSelector((state) => state.post);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        await getPostById(postId, token, dispatch);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    
    fetchPost();
  }, [postId, token, dispatch]);

  if (!post) {
    return <div>Loading post...</div>;
  }

  return (
    <div className="post-view-container">
      <SinglePost post={post} />
    </div>
  );
};

export default PostView;