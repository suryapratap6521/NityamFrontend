import React, { useState, useRef } from 'react';
import { createPost } from '../../../services/operations/postApi';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faPencilAlt, 
  faChartBar, 
  faCalendarAlt,
  faPhotoVideo,
  faFile,
  faSmile,
  faUserCircle,
  faPlus,
  faTrashAlt,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';

const SideBarPost = ({closeModal}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('post');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  
  // Post states
  const [currentPost, setCurrentPost] = useState({ 
    title: '', 
    postType: 'post', 
    mediaFiles: [], 
    mediaPreviews: [] 
  });
  
  const [currentPoll, setCurrentPoll] = useState({ 
    title: '', 
    postType: 'poll', 
    options: ['', ''] 
  });
  
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
  
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const {user}=useSelector((state)=>state.profile);

  // Emoji Picker Handler
  const handleEmojiClick = (emojiData) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    
    const newValue = 
      value.substring(0, start) + 
      emojiData.emoji + 
      value.substring(end);
    
    setCurrentPost(prev => ({
      ...prev,
      title: newValue
    }));
    
    // Move cursor position
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emojiData.emoji.length;
    }, 0);
    
    setShowEmojiPicker(false);
  };

  // Media Handling
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setCurrentPost(prev => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...files],
      mediaPreviews: [...prev.mediaPreviews, ...previews],
    }));
  };

  const removeMediaItem = (index) => {
    setCurrentPost(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index),
      mediaPreviews: prev.mediaPreviews.filter((_, i) => i !== index),
    }));
  };

  // Poll Handlers
  const addPollOption = () => {
    setCurrentPoll(prev => ({ ...prev, options: [...prev.options, ''] }));
  };

  const updatePollOption = (index, value) => {
    setCurrentPoll(prev => ({
      ...prev,
      options: prev.options.map((option, i) => (i === index ? value : option)),
    }));
  };

  const removePollOption = (index) => {
    setCurrentPoll(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  // Event Media Handling
  const handleEventMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setCurrentEvent(prev => ({ 
        ...prev, 
        media: file,
        mediaPreview: preview 
      }));
    }
  };

  const removeEventMedia = () => {
    setCurrentEvent(prev => ({
      ...prev,
      media: null,
      mediaPreview: null
    }));
  };

  // Submit Handler
 
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


  // Modal Controls
  

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

  return (
    <div className="flex items-center justify-center z-50 mb-4">
      <div className="bg-[#fafafa] w-full max-w-3xl mx-auto rounded-lg border-2  border-gray-200 ">
        {/* Header */}
    
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
          {user?.image ? (
    <img
      src={user.image}
      alt="User Avatar"
      className="w-10 h-10 rounded-full object-cover"
    />
  ) : (
    <FontAwesomeIcon 
      icon={faUserCircle} 
      className="w-10 h-10 text-gray-400"
    />
  )}
            <div>
              <h3 className="font-semibold">{user?.firstName || 'User'}</h3>
              <div className="flex space-x-2">
                {['post', 'poll', 'event'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-full flex items-center space-x-2 transition-colors ${
                      activeTab === tab ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FontAwesomeIcon icon={
                      tab === 'post' ? faPencilAlt :
                      tab === 'poll' ? faChartBar :
                      faCalendarAlt
                    } />
                    <span className="capitalize">{tab}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button 
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Post Tab */}
          {activeTab === 'post' && (
            <div className="space-y-4">
              <textarea
                ref={textareaRef}
                placeholder="What do you want to talk about?"
                value={currentPost.title}
                onChange={(e) => setCurrentPost(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-4 text-lg border-none focus:ring-0 resize-none min-h-[120px] placeholder-gray-500"
              />
              {currentPost.mediaPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {currentPost.mediaPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={preview} 
                        alt="Upload preview" 
                        className="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105" 
                      />
                      <button
                        onClick={() => removeMediaItem(index)}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Poll Tab */}
          {activeTab === 'poll' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ask a question..."
                value={currentPoll.title}
                onChange={(e) => setCurrentPoll(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-4 text-lg border-none focus:ring-0 placeholder-gray-500"
              />
              <div className="space-y-3">
                {currentPoll.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {currentPoll.options.length > 2 && (
                      <button 
                        onClick={() => removePollOption(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  onClick={addPollOption}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add option</span>
                </button>
              </div>
            </div>
          )}

          {/* Event Tab */}
          {activeTab === 'event' && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Event title"
        value={currentEvent.title}
        onChange={(e) => setCurrentEvent(prev => ({ ...prev, title: e.target.value }))}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faUserCircle} className="text-gray-500" />
        <input
          type="text"
          placeholder="Hosted by"
          value={currentEvent.hostedBy}
          onChange={(e) => setCurrentEvent(prev => ({ ...prev, hostedBy: e.target.value }))}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />
        <input
          type="text"
          placeholder="Venue"
          value={currentEvent.venue}
          onChange={(e) => setCurrentEvent(prev => ({ ...prev, venue: e.target.value }))}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />
        <input
          type="text"
          placeholder="Location"
          value={currentEvent.location}
          onChange={(e) => setCurrentEvent(prev => ({ ...prev, location: e.target.value }))}
          className="w-full p-2 border rounded-lg"
        />
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
        <input
          type="datetime-local"
          value={currentEvent.startDate}
          onChange={(e) => setCurrentEvent(prev => ({ ...prev, startDate: e.target.value }))}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
        <input
          type="datetime-local"
          value={currentEvent.endDate}
          onChange={(e) => setCurrentEvent(prev => ({ ...prev, endDate: e.target.value }))}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <textarea
        placeholder="Event description"
        value={currentEvent.description}
        onChange={(e) => setCurrentEvent(prev => ({ ...prev, description: e.target.value }))}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
      />
    </div>
    {currentEvent.mediaPreview && (
            <div className="relative group mt-2">
              <img 
                src={currentEvent.mediaPreview} 
                alt="Event preview" 
                className="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105" 
              />
              <button
                onClick={removeEventMedia}
                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
              >
                <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
              </button>
            </div>
          )}
            
  </div>
)}

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-4">
              <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FontAwesomeIcon icon={faPhotoVideo} className="text-green-600 w-5 h-5" />
                <input 
                  type="file" 
                  multiple 
                  onChange={activeTab === 'event' ? handleEventMediaUpload : handleMediaUpload}
                  className="hidden" 
                  accept="image/*,video/*" 
                />
              </label>
             
              <div className="relative">
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FontAwesomeIcon icon={faSmile} className="text-yellow-500 w-5 h-5" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 z-10">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      previewConfig={{ showPreview: false }}
                      skinTonesDisabled
                      searchDisabled
                      height={350}
                      width={300}
                    />
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarPost;

