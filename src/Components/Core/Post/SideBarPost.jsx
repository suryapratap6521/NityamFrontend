import React, { useState } from 'react';
import { createPost } from '../../../services/operations/postApi'; // Ensure correct API path
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Loader from "../../Common/Loader";
const SideBarPost = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('post');
  
  // Unified state for all types of posts
  const [currentPost, setCurrentPost] = useState({ title: '', postType: 'post', mediaFiles: [], mediaPreviews: [] });
  const [currentPoll, setCurrentPoll] = useState({ title: '', postType: 'poll', options: ['', ''] });
  const [currentEvent, setCurrentEvent] = useState({
    title: '',
    postType: 'event',
    location: '',
    startDate: '',
    endDate: '',
    hostedBy: '',
    venue: '',
    description: '',
    media: null,
  });
  const navigate=useNavigate();
  const { token } = useSelector((state) => state.auth);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    // setIsOpen(false);
    navigate('/dashboard')
    resetForms();
    setActiveTab('post');
  };

  const resetForms = () => {
    setCurrentPost({ title: '', postType: 'post', mediaFiles: [], mediaPreviews: [] });
    setCurrentPoll({ title: '', postType: 'poll', options: ['', ''] });
    setCurrentEvent({
      title: '',
      postType: 'event',
      location: '',
      startDate: '',
      endDate: '',
      hostedBy: '',
      venue: '',
      description: '',
      media: null,
    });
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setCurrentPost((prev) => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...files],
      mediaPreviews: [...prev.mediaPreviews, ...previews],
    }));
  };

  const removeMediaItem = (index) => {
    setCurrentPost((prev) => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index),
      mediaPreviews: prev.mediaPreviews.filter((_, i) => i !== index),
    }));
  };

  const handleEventMediaUpload = (e) => {
    const file = e.target.files[0]; // Ensure you're getting the first file correctly
    if (file) {
      setCurrentEvent((prev) => ({
        ...prev,
        media: file,
      }));
    } else {
      console.error("No file selected");
    }
  };

  const addPollOption = () => {
    setCurrentPoll((prev) => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const updatePollOption = (index, value) => {
    setCurrentPoll((prev) => ({
      ...prev,
      options: prev.options.map((option, i) => (i === index ? value : option)),
    }));
  };

  const removePollOption = (index) => {
    setCurrentPoll((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      if (activeTab === 'post') {
        if (!currentPost.title && currentPost.mediaFiles.length === 0) {
          alert('Either title or media is required for a post.');
          return;
        }
        formData.append('title', currentPost.title);
        formData.append('postType', 'post');
        currentPost.mediaFiles.forEach((file) => {
          formData.append('media', file);
        });
      } else if (activeTab === 'poll') {
        if (!currentPoll.title.trim()) {
          alert('Poll title is required.');
          return;
        }

        const validOptions = currentPoll.options.filter((option) => option.trim());
        if (validOptions.length < 2) {
          alert('At least two poll options are required.');
          return;
        }

        formData.append('title', currentPoll.title);
        formData.append('postType', 'poll');
        validOptions.forEach((option) => formData.append('pollOptions', option));
      } else if (activeTab === 'event') {
        if (!currentEvent.title || !currentEvent.startDate || !currentEvent.endDate || !currentEvent.hostedBy || !currentEvent.venue) {
          alert('Event title, date, hosted by, and venue are required.');
          return;
        }

        formData.append('title', currentEvent.title);
        formData.append('postType', 'event');
        formData.append('location', currentEvent.location);
        formData.append('startDate', currentEvent.startDate);
        formData.append('endDate', currentEvent.endDate);
        formData.append('hostedBy', currentEvent.hostedBy);
        formData.append('venue', currentEvent.venue);
        formData.append('description', currentEvent.description);

        if (currentEvent.media) {
          formData.append('media', currentEvent.media);
        }
      }

      await createPost(formData, token);
      closeModal();
    } catch (error) {
      console.error('Error creating post:', error);
    }
    navigate("/dashboard");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'post':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Post Title"
              value={currentPost.title}
              onChange={(e) => setCurrentPost((prev) => ({ ...prev, title: e.target.value }))} 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {currentPost.mediaPreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {currentPost.mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt="Uploaded media" className="w-full h-24 object-cover rounded" />
                    <button
                      onClick={() => removeMediaItem(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input type="file" multiple onChange={handleMediaUpload} accept="image/*,video/*" />
            <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded-md">
              Post
            </button>
          </div>


        );
      case 'poll':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Poll Title (This will be treated as the question)"
              value={currentPoll.title}
              onChange={(e) => setCurrentPoll((prev) => ({ ...prev, title: e.target.value }))} 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {currentPoll.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updatePollOption(index, e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {currentPoll.options.length > 2 && (
                  <button onClick={() => removePollOption(index)} className="text-red-500">
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button onClick={addPollOption} className="w-full p-2 text-blue-600 border border-blue-600 rounded-md">
              Add option
            </button>
            <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded-md">
              Submit Poll
            </button>
          </div>
        );
      case 'event':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Event Title (This will be treated as the event name)"
              value={currentEvent.title}
              onChange={(e) => setCurrentEvent((prev) => ({ ...prev, title: e.target.value }))} 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Location"
              value={currentEvent.location}
              onChange={(e) => setCurrentEvent((prev) => ({ ...prev, location: e.target.value }))} 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Hosted By"
              value={currentEvent.hostedBy}
              onChange={(e) => setCurrentEvent((prev) => ({ ...prev, hostedBy: e.target.value }))} 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Venue"
              value={currentEvent.venue}
              onChange={(e) => setCurrentEvent((prev) => ({ ...prev, venue: e.target.value }))} 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Event Description"
              value={currentEvent.description}
              onChange={(e) => setCurrentEvent((prev) => ({ ...prev, description: e.target.value }))} 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="datetime-local"
              value={currentEvent.startDate}
              onChange={(e) => setCurrentEvent((prev) => ({ ...prev, startDate: e.target.value }))} 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="datetime-local"
              value={currentEvent.endDate}
              onChange={(e) => setCurrentEvent((prev) => ({ ...prev, endDate: e.target.value }))} 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input type="file" onChange={handleEventMediaUpload}  className="mb-4" accept="image/*,video/*" />
            <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded-md">
              Create Event
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-6">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold">Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <button onClick={closeModal} className="text-red-500">X</button>
            </div>
            <div className="flex justify-between space-x-2">
              <button onClick={() => setActiveTab('post')} className={`px-4 py-2 rounded ${activeTab === 'post' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Post</button>
              <button onClick={() => setActiveTab('poll')} className={`px-4 py-2 rounded ${activeTab === 'poll' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Poll</button>
              <button onClick={() => setActiveTab('event')} className={`px-4 py-2 rounded ${activeTab === 'event' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Event</button>
            </div>

            <div className="mt-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBarPost;
