import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../../services/operations/postApi";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faSmile, faHashtag, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const CreatePostModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", postImage: null });
  const navigate=useNavigate();

    // Add missing handler functions
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setForm((prevState) => ({
        ...prevState,
        postImage: file,
      }));
    };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { 
      y: "0", 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: { y: "100vh", opacity: 0 }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
     
    const toastId = toast.loading("Creating Your Post...")

    const { title, postImage } = form;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("postImage", postImage);
      console.log(formData);
      await createPost(formData, token);
      setLoading(false);

      toast.success("SuccessFully created the post");
      navigate('/');
    } catch (error) {
      setLoading(false);
      console.log("Error creating post:", error);
    }
    toast.dismiss(toastId);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="bg-white rounded-lg w-full max-w-2xl p-6 relative"
          variants={modalVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Create Post</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>

          <div className="flex items-start gap-4 mb-4">
            <img 
              src={user.image} 
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <textarea
              name="title"
              placeholder="What's on your mind?"
              value={form.title}
              onChange={handleChange}
              className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {form.postImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 relative"
            >
              <img 
                src={URL.createObjectURL(form.postImage)} 
                alt="Preview" 
                className="rounded-lg max-h-96 object-cover w-full"
              />
              <button
                onClick={() => setForm(prev => ({...prev, postImage: null}))}
                className="absolute top-2 right-2 bg-white p-2 rounded-full hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </motion.div>
          )}

          <div className="flex justify-between items-center border-t pt-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                <FontAwesomeIcon icon={faImage} className="text-blue-500" />
                <span className="hidden md:inline">Photo/Video</span>
                <input
                  type="file"
                  name="postImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faSmile} className="text-yellow-500" />
                <span className="hidden md:inline">Feeling</span>
              </button>
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faHashtag} className="text-green-500" />
                <span className="hidden md:inline">Tag</span>
              </button>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !form.title}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreatePostModal;