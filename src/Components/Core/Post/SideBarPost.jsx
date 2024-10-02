import React, { useState } from 'react';
import { X, Smile, Image, Calendar, Plus, Clock, PenTool, BarChart2, Trash2, MapPin, Video, Users } from 'lucide-react';

const SideBarPost = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('post');
  const [posts, setPosts] = useState([]);
  const [polls, setPolls] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentPost, setCurrentPost] = useState({ content: '', mediaItems: [] });
  const [currentPoll, setCurrentPoll] = useState({ question: '', options: ['', ''] });
  const [currentEvent, setCurrentEvent] = useState({
    name: '',
    date: '',
    description: '',
    type: 'in-person',
    startTime: '12:00',
    endTime: '23:00',
    location: '',
    media: null,
    hostedBy: ''
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setCurrentPost({ content: '', mediaItems: [] });
    setCurrentPoll({ question: '', options: ['', ''] });
    setCurrentEvent({ name: '', date: '', description: '' });
    setActiveTab('post');
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setCurrentPost(prev => ({
      ...prev,
      mediaItems: [...prev.mediaItems, ...files.map(file => URL.createObjectURL(file))]
    }));
  };

  const removeMediaItem = (index) => {
    setCurrentPost(prev => ({
      ...prev,
      mediaItems: prev.mediaItems.filter((_, i) => i !== index)
    }));
  };

  // Post CRUD operations
  const addPost = () => {
    setPosts([...posts, { ...currentPost, id: Date.now() }]);
    setCurrentPost({ content: '', mediaItems: [] });
    closeModal();
  };

  const updatePost = (id) => {
    setPosts(posts.map(post => post.id === id ? currentPost : post));
    setCurrentPost({ content: '', mediaItems: [] });
    closeModal();
  };

  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  // Poll CRUD operations
  const addPoll = () => {
    setPolls([...polls, { ...currentPoll, id: Date.now() }]);
    setCurrentPoll({ question: '', options: ['', ''] });
    closeModal();
  };

  const updatePoll = (id) => {
    setPolls(polls.map(poll => poll.id === id ? currentPoll : poll));
    setCurrentPoll({ question: '', options: ['', ''] });
    closeModal();
  };

  const deletePoll = (id) => {
    setPolls(polls.filter(poll => poll.id !== id));
  };

  const addPollOption = () => {
    setCurrentPoll(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const updatePollOption = (index, value) => {
    setCurrentPoll(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
  };

  const removePollOption = (index) => {
    setCurrentPoll(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  // Event CRUD operations
  const addEvent = () => {
    setEvents([...events, { ...currentEvent, id: Date.now() }]);
    setCurrentEvent({ name: '', date: '', description: '' });
    closeModal();
  };

  const updateEvent = (id) => {
    setEvents(events.map(event => event.id === id ? currentEvent : event));
    setCurrentEvent({ name: '', date: '', description: '' });
    closeModal();
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleEventMediaUpload = (e) => {
    const file = e.target.files[0];
    setCurrentEvent(prev => ({
      ...prev,
      media: file ? URL.createObjectURL(file) : null
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'post':
        return (
          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-2 rounded-md resize-none focus:outline-none"
              placeholder="What do you want to talk about?"
              value={currentPost.content}
              onChange={(e) => setCurrentPost(prev => ({ ...prev, content: e.target.value }))}
            ></textarea>
            {currentPost.mediaItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-gray-400 bg-transparent hover:bg-transparent hover:text-gray-600">
                {currentPost.mediaItems.map((item, index) => (
                  <div key={index} className="relative group">
                    <img src={item} alt="Uploaded media" className="w-full h-24 object-cover rounded text-gray-400 bg-transparent hover:bg-transparent hover:text-gray-600" />
                    <button
                      onClick={() => removeMediaItem(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent hover:bg-transparent hover:text-gray-600"
                    >
                      <Trash2 size={16} className='bg-transparent hover:bg-transparent "text-gray-400 bg-transparent hover:bg-transparent hover:text-gray-600' />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'poll':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ask a question..."
              value={currentPoll.question}
              onChange={(e) => setCurrentPoll(prev => ({ ...prev, question: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {currentPoll.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updatePollOption(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => removePollOption(index)}
                  className="text-red-500 hover:text-red-700  bg-transparent hover:bg-transparent"
                >
                  <Trash2 size={20} className='text-blue-600 bg-transparent hover:bg-transparent border-blue-600  hover:bg-blue-50' />
                </button>
              </div>
            ))}
            <button
              onClick={addPollOption}
              className="w-full p-2 text-blue-600 border bg-transparent hover:bg-transparent border-blue-600 rounded-md hover:bg-blue-50"
            >
              <Plus size={20} className="inline mr-2" /> Add option
            </button>
          </div>
        );
      case 'event':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Event name"
              value={currentEvent.name}
              onChange={(e) => setCurrentEvent(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-[#C7872A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E8D44]"
            />
            <div className="flex space-x-2">
              <select
                value={currentEvent.type}
                onChange={(e) => setCurrentEvent(prev => ({ ...prev, type: e.target.value }))}
                className="flex-1 p-2 border border-[#C7872A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E8D44]"
              >
                <option value="in-person">In Person</option>
                <option value="online">Online</option>
              </select>
              <input
                type="date"
                value={currentEvent.date}
                onChange={(e) => setCurrentEvent(prev => ({ ...prev, date: e.target.value }))}
                className="flex-1 p-2 border border-[#C7872A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E8D44]"
              />
            </div>
            <div className="flex space-x-2">
              <input
                type="time"
                placeholder='Start Time'
                value={currentEvent.startTime}
                onChange={(e) => setCurrentEvent(prev => ({ ...prev, startTime: e.target.value }))}
                className="flex-1 p-2 border border-[#C7872A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E8D44]"
              />
              <input
                type="time"
                placeholder='End Time'
                value={currentEvent.endTime}
                onChange={(e) => setCurrentEvent(prev => ({ ...prev, endTime: e.target.value }))}
                className="flex-1 p-2 border border-[#C7872A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E8D44]"
              />
            </div>
            <input
              type="text"
              placeholder="Location"
              value={currentEvent.location}
              onChange={(e) => setCurrentEvent(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-2 border border-[#C7872A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E8D44]"
            />
            <input
              type="text"
              placeholder="Hosted by (optional)"
              value={currentEvent.hostedBy}
              onChange={(e) => setCurrentEvent(prev => ({ ...prev, hostedBy: e.target.value }))}
              className="w-full p-2 border border-[#C7872A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E8D44]"
            />
            <textarea
              placeholder="Event description"
              value={currentEvent.description}
              onChange={(e) => setCurrentEvent(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-32 p-2 border border-[#C7872A] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#1E8D44]"
            ></textarea>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer text-[#1E8D44] hover:text-[#C7872A]">
                <input type="file" className="hidden" onChange={handleEventMediaUpload} accept="image/*,video/*" multiple />
                <Image size={24} />
                <span>Upload Photo/Video</span>
              </label>
              {currentEvent.media && (
                <button
                  onClick={() => setCurrentEvent(prev => ({ ...prev, media: null }))}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
            {currentEvent.media && (
              <div className="mt-2">
                {currentEvent.media.startsWith('data:video') ? (
                  <video src={currentEvent.media} className="w-full h-40 object-cover rounded" controls />
                ) : (
                  <img src={currentEvent.media} alt="Event media" className="w-full h-40 object-cover rounded" />
                )}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-8">
      <button
        onClick={openModal}
        className="bg-[#1E8D44] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#C7872A] transition-colors"
      >
        Create Post
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#C7872A]">
              <div className="flex items-center space-x-3">
                <img src="/api/placeholder/50/50" alt="User" className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-semibold text-lg text-[#1E8D44]">Shivam Kumar</h3>
                </div>
              </div>
              <button onClick={closeModal} className="text-[#C7872A] bg-transparent hover:bg-transparent hover:text-[#1E8D44]">
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex space-x-2 mb-4">
                <button
                  className={`px-3 py-1 rounded-full ${activeTab === 'post' ? 'bg-[#1E8D44] text-white' : 'text-[#C7872A]'}`}
                  onClick={() => setActiveTab('post')}
                >
                  <PenTool size={16} className="inline mr-1" /> Post
                </button>
                <button
                  className={`px-3 py-1 rounded-full ${activeTab === 'poll' ? 'bg-[#1E8D44] text-white' : 'text-[#C7872A]'}`}
                  onClick={() => setActiveTab('poll')}
                >
                  <BarChart2 size={16} className="inline mr-1" /> Poll
                </button>
                <button
                  className={`px-3 py-1 rounded-full ${activeTab === 'event' ? 'bg-[#1E8D44] text-white' : 'text-[#C7872A]'}`}
                  onClick={() => setActiveTab('event')}
                >
                  <Calendar size={16} className="inline mr-1" /> Event
                </button>
              </div>
              {renderTabContent()}
            </div>

            <div className="p-4 border-t border-[#C7872A] mt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <label className="cursor-pointer">
                  <input type="file" className="hidden" onChange={handleMediaUpload} multiple />
                  <Image size={24} className="text-[#C7872A] hover:text-[#1E8D44]" />
                </label>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={activeTab === 'post' ? addPost : (activeTab === 'poll' ? addPoll : addEvent)}
                  className="bg-[#1E8D44] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#C7872A] transition-colors"
                >
                  {activeTab === 'post' ? 'Post' : (activeTab === 'poll' ? 'Create Poll' : 'Create Event')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-[#1E8D44]">Posts</h2>
        {posts.map(post => (
          <div key={post.id} className="bg-white shadow rounded-lg p-4 mb-4 border border-[#C7872A]">
            <p className="text-[#1E8D44]">{post.content}</p>
            {post.mediaItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                {post.mediaItems.map((item, index) => (
                  <img key={index} src={item} alt="Post media" className="w-full h-24 object-cover rounded" />
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setCurrentPost(post);
                  setActiveTab('post');
                  openModal();
                }}
                className="text-[#1E8D44] hover:text-[#C7872A]"
              >
                Edit
              </button>
              <button
                onClick={() => deletePost(post.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-[#1E8D44]">Polls</h2>
        {polls.map(poll => (
          <div key={poll.id} className="bg-white shadow rounded-lg p-4 mb-4 border border-[#C7872A]">
            <h3 className="text-lg font-semibold mb-2 text-[#1E8D44]">{poll.question}</h3>
            <ul className="space-y-2">
              {poll.options.map((option, index) => (
                <li key={index} className="bg-[#F9ED25] p-2 rounded text-[#C7872A]">{option}</li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setCurrentPoll(poll);
                  setActiveTab('poll');
                  openModal();
                }}
                className="text-[#1E8D44] hover:text-[#C7872A]"
              >
                Edit
              </button>
              <button
                onClick={() => deletePoll(poll.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-[#1E8D44]">Events</h2>
        {events.map(event => (
          <div key={event.id} className="bg-white shadow rounded-lg p-4 mb-4 border border-[#C7872A]">
            <h3 className="text-lg font-semibold mb-2 text-[#1E8D44]">{event.name}</h3>
            <p className="text-[#C7872A] mb-2">
              <Calendar size={16} className="inline mr-1" />
              {new Date(event.date).toLocaleDateString()} {event.startTime} - {event.endTime}
            </p>
            <p className="text-[#C7872A] mb-2">
              <MapPin size={16} className="inline mr-1" />
              {event.location}
            </p>
            {event.type === 'online' && (
              <p className="text-[#C7872A] mb-2">
                <Video size={16} className="inline mr-1" />
                Online Event
              </p>
            )}
            {event.hostedBy && (
              <p className="text-[#C7872A] mb-2">
                <Users size={16} className="inline mr-1" />
                Hosted by: {event.hostedBy}
              </p>
            )}
            <p className="text-[#1E8D44]">{event.description}</p>
            {event.media && (
              <div className="mt-2">
                {event.media.startsWith('data:video') ? (
                  <video src={event.media} className="w-full h-40 object-cover rounded" controls />
                ) : (
                  <img src={event.media} alt="Event media" className="w-full h-40 object-cover rounded" />
                )}
              </div>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setCurrentEvent(event);
                  setActiveTab('event');
                  openModal();
                }}
                className="text-[#1E8D44] hover:text-[#C7872A] bg-transparent hover:bg-transparent"
              >
                Edit
              </button>
              <button
                onClick={() => deleteEvent(event.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBarPost;