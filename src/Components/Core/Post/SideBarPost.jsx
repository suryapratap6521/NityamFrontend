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
  const navigate = useNavigate();
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
            <div className="w-full bg-white flex items-center gap-2 p-2 pl-4 border border-gray-300 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 10.5V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H7.5V3.75H3.75V14.25H14.25V10.5H15.75Z" fill="black" />
                <path d="M15.75 5.25H12.75V2.25H11.25V5.25H8.25V6.75H11.25V9.75H12.75V6.75H15.75V5.25Z" fill="black" />
              </svg>

              <textarea
                placeholder="Write Something about your post..."
                value={currentPost.title}
                onChange={(e) => setCurrentPost((prev) => ({ ...prev, title: e.target.value }))}
                className="w-11/12 text-base h-[30px] focus:outline-none"
              />
            </div>
            {currentPost.mediaPreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {currentPost.mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt="Uploaded media" className="w-full h-24 object-cover rounded" />
                    <button
                      onClick={() => removeMediaItem(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-0 h-0 flex items-center justify-center shadow-md"
                    >
                      X
                    </button>

                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center">
              <label for="files" className="flex bg-white items-center gap-2 p-2 pr-3 border border-gray-300 rounded-full mb-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.025 9.23001H19.515C19.0783 8.05467 18.3813 7.01601 17.424 6.11401C16.4673 5.21267 15.376 4.60801 14.15 4.30001L11.658 8.59601C11.5707 8.73734 11.5703 8.87834 11.657 9.01901C11.7437 9.16034 11.8663 9.23101 12.025 9.23101M8.848 10.596C8.93467 10.7373 9.057 10.808 9.215 10.808C9.373 10.808 9.49567 10.7373 9.583 10.596L13.369 4.10301C13.1857 4.06767 12.9577 4.04167 12.685 4.02501C12.4123 4.00834 12.184 4.00001 12 4.00001C10.9 4.00001 9.875 4.20834 8.925 4.62501C7.975 5.04167 7.13333 5.60001 6.4 6.30001L8.848 10.596ZM4.25 14H9.19C9.344 14 9.46667 13.9293 9.558 13.788C9.64933 13.6467 9.65133 13.5057 9.564 13.365L5.854 6.90801C5.26933 7.62934 4.81433 8.41667 4.489 9.27001C4.163 10.124 4 11.034 4 12C4 12.35 4.021 12.6877 4.063 13.013C4.105 13.3383 4.16733 13.6673 4.25 14ZM9.889 19.7L12.375 15.404C12.4617 15.2627 12.4597 15.1217 12.369 14.981C12.2783 14.8403 12.156 14.7697 12.002 14.769H4.484C4.92133 15.945 5.625 16.984 6.595 17.886C7.565 18.788 8.66333 19.3927 9.89 19.7M12 20C13.1 20 14.125 19.7917 15.075 19.375C16.025 18.9583 16.8667 18.4 17.6 17.7L15.152 13.404C15.0653 13.2627 14.943 13.192 14.785 13.192C14.627 13.192 14.5043 13.2627 14.417 13.404L10.669 19.862C10.8523 19.908 11.07 19.9427 11.322 19.966C11.574 19.9893 11.8 20.0007 12 20ZM18.146 17.092C18.6793 16.4087 19.1217 15.6227 19.473 14.734C19.8243 13.8453 20 12.934 20 12C20 11.65 19.9793 11.3127 19.938 10.988C19.8967 10.6633 19.834 10.334 19.75 10H14.81C14.656 10 14.5333 10.0707 14.442 10.212C14.3507 10.3533 14.3487 10.4943 14.436 10.635L18.146 17.092ZM11.994 21C10.7593 21 9.59567 20.7643 8.503 20.293C7.41033 19.8217 6.45567 19.1773 5.639 18.36C4.82233 17.5427 4.17833 16.588 3.707 15.496C3.23567 14.404 3 13.2407 3 12.006C3 10.7567 3.23667 9.58634 3.71 8.49501C4.184 7.40367 4.82733 6.45201 5.64 5.64001C6.45267 4.82801 7.40667 4.18467 8.502 3.71001C9.59733 3.23534 10.7613 2.99867 11.994 3.00001C13.2407 3.00001 14.4103 3.23667 15.503 3.71001C16.5963 4.18401 17.549 4.82734 18.361 5.64001C19.173 6.45267 19.816 7.40434 20.29 8.49501C20.764 9.58567 21.0007 10.756 21 12.006C21 13.2407 20.7633 14.4053 20.29 15.5C19.816 16.5947 19.1727 17.548 18.36 18.36C17.5473 19.172 16.5957 19.8153 15.505 20.29C14.4143 20.7647 13.244 21.0013 11.994 21Z" fill="black" />
                </svg>

                <input id="files" type="file" multiple onChange={handleMediaUpload} accept="image/*,video/*" placeholder='' className='hidden' />
                <span className='text-sm'>Add Media</span>
              </label>
              <button onClick={handleSubmit} className="bg-gradient text-white px-8 m-0 py-2 rounded-full text-base">
                Publish
              </button>
            </div>
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
              className="w-full p-2 border border-gray-300 rounded-full pl-4"
            />
            {currentPoll.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updatePollOption(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-full pl-4"
                />
                {currentPoll.options.length > 2 && (
                  <button onClick={() => removePollOption(index)} className="bg-[#fff] border border-gray-300 m-0 p-1 rounded-full">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.687 6.21298L6.8 18.976C6.89665 19.5603 7.19759 20.0913 7.6492 20.4744C8.10081 20.8575 8.67377 21.0679 9.266 21.068H12.614M19.312 6.21298L17.2 18.976C17.1033 19.5603 16.8024 20.0913 16.3508 20.4744C15.8992 20.8575 15.3262 21.0679 14.734 21.068H11.386M10.022 11.116V16.165M13.978 11.116V16.165M2.75 6.21298H21.25M14.777 6.21298V4.43298C14.777 4.03516 14.619 3.65363 14.3377 3.37232C14.0564 3.09102 13.6748 2.93298 13.277 2.93298H10.723C10.3252 2.93298 9.94364 3.09102 9.66234 3.37232C9.38104 3.65363 9.223 4.03516 9.223 4.43298V6.21298H14.777Z" stroke="#D10709" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>


                  </button>
                )}
              </div>
            ))}
            <button onClick={addPollOption} className="w-full p-2 text-[#4A00E0] text-base rounded-md bg-[#4A00E020]">
              + Add option
            </button>
            <div className="w-full flex ">
              <button onClick={handleSubmit} className="bg-gradient text-white px-8 m-0 py-2 rounded-full text-base ml-auto">
                Submit Poll
              </button>
            </div>
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
              className="w-full p-2 border border-gray-300 rounded-full pl-4"
            />
            <input
              type="text"
              placeholder="Location"
              value={currentEvent.location}
              onChange={(e) => setCurrentEvent((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-full pl-4"
            />
            <input
              type="text"
              placeholder="Hosted By"
              value={currentEvent.hostedBy}
              onChange={(e) => setCurrentEvent((prev) => ({ ...prev, hostedBy: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-full pl-4"
            />
            <input
              type="text"
              placeholder="Venue"
              value={currentEvent.venue}
              onChange={(e) => setCurrentEvent((prev) => ({ ...prev, venue: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-full pl-4"
            />
            <textarea
              placeholder="Event Description"
              value={currentEvent.description}
              onChange={(e) => setCurrentEvent((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md pl-4"
            />
            <input
              type="datetime-local"
              value={currentEvent.startDate}
              onChange={(e) => setCurrentEvent((prev) => ({ ...prev, startDate: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-full pl-4"
            />
            <input
              type="datetime-local"
              value={currentEvent.endDate}
              onChange={(e) => setCurrentEvent((prev) => ({ ...prev, endDate: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-full pl-4"
            />
            <div className="flex justify-between items-center">
              <label for="files" className="flex bg-white items-center gap-2 p-2 pr-3 border border-gray-300 rounded-full mb-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.025 9.23001H19.515C19.0783 8.05467 18.3813 7.01601 17.424 6.11401C16.4673 5.21267 15.376 4.60801 14.15 4.30001L11.658 8.59601C11.5707 8.73734 11.5703 8.87834 11.657 9.01901C11.7437 9.16034 11.8663 9.23101 12.025 9.23101M8.848 10.596C8.93467 10.7373 9.057 10.808 9.215 10.808C9.373 10.808 9.49567 10.7373 9.583 10.596L13.369 4.10301C13.1857 4.06767 12.9577 4.04167 12.685 4.02501C12.4123 4.00834 12.184 4.00001 12 4.00001C10.9 4.00001 9.875 4.20834 8.925 4.62501C7.975 5.04167 7.13333 5.60001 6.4 6.30001L8.848 10.596ZM4.25 14H9.19C9.344 14 9.46667 13.9293 9.558 13.788C9.64933 13.6467 9.65133 13.5057 9.564 13.365L5.854 6.90801C5.26933 7.62934 4.81433 8.41667 4.489 9.27001C4.163 10.124 4 11.034 4 12C4 12.35 4.021 12.6877 4.063 13.013C4.105 13.3383 4.16733 13.6673 4.25 14ZM9.889 19.7L12.375 15.404C12.4617 15.2627 12.4597 15.1217 12.369 14.981C12.2783 14.8403 12.156 14.7697 12.002 14.769H4.484C4.92133 15.945 5.625 16.984 6.595 17.886C7.565 18.788 8.66333 19.3927 9.89 19.7M12 20C13.1 20 14.125 19.7917 15.075 19.375C16.025 18.9583 16.8667 18.4 17.6 17.7L15.152 13.404C15.0653 13.2627 14.943 13.192 14.785 13.192C14.627 13.192 14.5043 13.2627 14.417 13.404L10.669 19.862C10.8523 19.908 11.07 19.9427 11.322 19.966C11.574 19.9893 11.8 20.0007 12 20ZM18.146 17.092C18.6793 16.4087 19.1217 15.6227 19.473 14.734C19.8243 13.8453 20 12.934 20 12C20 11.65 19.9793 11.3127 19.938 10.988C19.8967 10.6633 19.834 10.334 19.75 10H14.81C14.656 10 14.5333 10.0707 14.442 10.212C14.3507 10.3533 14.3487 10.4943 14.436 10.635L18.146 17.092ZM11.994 21C10.7593 21 9.59567 20.7643 8.503 20.293C7.41033 19.8217 6.45567 19.1773 5.639 18.36C4.82233 17.5427 4.17833 16.588 3.707 15.496C3.23567 14.404 3 13.2407 3 12.006C3 10.7567 3.23667 9.58634 3.71 8.49501C4.184 7.40367 4.82733 6.45201 5.64 5.64001C6.45267 4.82801 7.40667 4.18467 8.502 3.71001C9.59733 3.23534 10.7613 2.99867 11.994 3.00001C13.2407 3.00001 14.4103 3.23667 15.503 3.71001C16.5963 4.18401 17.549 4.82734 18.361 5.64001C19.173 6.45267 19.816 7.40434 20.29 8.49501C20.764 9.58567 21.0007 10.756 21 12.006C21 13.2407 20.7633 14.4053 20.29 15.5C19.816 16.5947 19.1727 17.548 18.36 18.36C17.5473 19.172 16.5957 19.8153 15.505 20.29C14.4143 20.7647 13.244 21.0013 11.994 21Z" fill="black" />
                </svg>

                <input id="files" type="file" multiple onChange={handleEventMediaUpload} accept="image/*,video/*" placeholder='' className='hidden' />
                <span className='text-sm'>Add Media</span>
              </label>
              {/* <input type="file" onChange={handleEventMediaUpload} className="mb-4" accept="image/*,video/*" /> */}
              <button onClick={handleSubmit} className="bg-gradient text-white px-8 m-0 py-2 rounded-full text-base ml-auto">
                Create Event
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>

      <div className="flex items-center justify-center z-50 mb-4">
        <div className="bg-[#fafafa] w-full max-w-3xl mx-auto rounded-lg border-2  border-gray-200 ">
          {/* <div className="flex justify-between">
            <h2 className="text-2xl font-bold">Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <button onClick={closeModal} className="text-red-500">X</button>
          </div> */}
          <div className="flex">
            <button onClick={() => setActiveTab('post')} className={`flex items-center gap-1 m-0 px-10 py-4 text-base text-gray-600 rounded-tl-md rounded-none ${activeTab === 'post' ? 'bg-[#EBEBEB]' : 'bg-transparent'}`} style={{ borderWidth: activeTab === 'post' ? '2px' : '0px 2px 0px 0px', borderStyle: 'solid', borderColor: activeTab === 'post' ? 'black' : 'rgb(187, 187, 187)', }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.116 20C4.65533 20 4.271 19.846 3.963 19.538C3.655 19.23 3.50067 18.8453 3.5 18.384V5.616C3.5 5.15533 3.65433 4.771 3.963 4.463C4.27167 4.155 4.65567 4.00067 5.115 4H14.423V5H5.116C4.962 5 4.82067 5.064 4.692 5.192C4.56333 5.32 4.49933 5.46133 4.5 5.616V18.385C4.5 18.5383 4.564 18.6793 4.692 18.808C4.82 18.9367 4.961 19.0007 5.115 19H17.885C18.0383 19 18.1793 18.936 18.308 18.808C18.4367 18.68 18.5007 18.539 18.5 18.385V9.077H19.5V18.385C19.5 18.845 19.346 19.2293 19.038 19.538C18.73 19.8467 18.3453 20.0007 17.884 20H5.116ZM8 16.5V15.5H15V16.5H8ZM8 13.5V12.5H15V13.5H8ZM8 10.5V9.5H15V10.5H8ZM17.5 8V6H15.5V5H17.5V3H18.5V5H20.5V6H18.5V8H17.5Z" fill="black" />
            </svg>
              Post</button>
            <button onClick={() => setActiveTab('poll')} className={`flex items-center gap-1 m-0 px-10 py-4 text-base text-gray-600 rounded-none ${activeTab === 'poll' ? 'bg-[#EBEBEB]' : 'bg-transparent'}`} style={{ borderWidth: activeTab === 'poll' ? '2px' : '0px 2px 0px 0px', borderStyle: 'solid', borderColor: activeTab === 'poll' ? 'black' : 'rgb(187, 187, 187)', }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5673 4C12.1564 4 12.7214 4.23401 13.1379 4.65056C13.5544 5.06711 13.7885 5.63207 13.7885 6.22115V18.2788C13.7885 18.5705 13.731 18.8594 13.6194 19.1288C13.5078 19.3983 13.3442 19.6432 13.1379 19.8494C12.9316 20.0557 12.6868 20.2193 12.4173 20.3309C12.1478 20.4425 11.859 20.5 11.5673 20.5C11.2756 20.5 10.9868 20.4425 10.7173 20.3309C10.4478 20.2193 10.203 20.0557 9.99671 19.8494C9.79046 19.6432 9.62685 19.3983 9.51523 19.1288C9.40361 18.8594 9.34615 18.5705 9.34615 18.2788V6.22115C9.34615 5.63207 9.58017 5.06711 9.99671 4.65056C10.4133 4.23401 10.9782 4 11.5673 4ZM11.5673 4.63462C11.1465 4.63462 10.743 4.80177 10.4455 5.0993C10.1479 5.39684 9.98077 5.80038 9.98077 6.22115V18.2788C9.98077 18.6996 10.1479 19.1032 10.4455 19.4007C10.743 19.6982 11.1465 19.8654 11.5673 19.8654C11.9881 19.8654 12.3916 19.6982 12.6892 19.4007C12.9867 19.1032 13.1538 18.6996 13.1538 18.2788V6.22115C13.1538 5.80038 12.9867 5.39684 12.6892 5.0993C12.3916 4.80177 11.9881 4.63462 11.5673 4.63462ZM20.1346 10.0288V18.2788C20.1346 18.5705 20.0772 18.8594 19.9655 19.1288C19.8539 19.3983 19.6903 19.6432 19.4841 19.8494C19.2778 20.0557 19.0329 20.2193 18.7635 20.3309C18.494 20.4425 18.2051 20.5 17.9135 20.5C17.6218 20.5 17.3329 20.4425 17.0635 20.3309C16.794 20.2193 16.5491 20.0557 16.3429 19.8494C16.1366 19.6432 15.973 19.3983 15.8614 19.1288C15.7498 18.8594 15.6923 18.5705 15.6923 18.2788V10.0288C15.6923 9.73716 15.7498 9.44833 15.8614 9.17885C15.973 8.90936 16.1366 8.66451 16.3429 8.45825C16.5491 8.252 16.794 8.08839 17.0635 7.97677C17.3329 7.86514 17.6218 7.80769 17.9135 7.80769C18.2051 7.80769 18.494 7.86514 18.7635 7.97677C19.0329 8.08839 19.2778 8.252 19.4841 8.45825C19.6903 8.66451 19.8539 8.90936 19.9655 9.17885C20.0772 9.44833 20.1346 9.73716 20.1346 10.0288ZM17.9135 8.44231C17.4927 8.44231 17.0891 8.60946 16.7916 8.90699C16.4941 9.20453 16.3269 9.60807 16.3269 10.0288V18.2788C16.3269 18.6996 16.4941 19.1032 16.7916 19.4007C17.0891 19.6982 17.4927 19.8654 17.9135 19.8654C18.3342 19.8654 18.7378 19.6982 19.0353 19.4007C19.3328 19.1032 19.5 18.6996 19.5 18.2788V10.0288C19.5 9.60807 19.3328 9.20453 19.0353 8.90699C18.7378 8.60946 18.3342 8.44231 17.9135 8.44231ZM7.44231 18.2788V13.8365C7.44231 13.5449 7.38486 13.256 7.27323 12.9865C7.16161 12.7171 6.998 12.4722 6.79175 12.2659C6.58549 12.0597 6.34064 11.8961 6.07115 11.7845C5.80167 11.6728 5.51284 11.6154 5.22115 11.6154C4.92947 11.6154 4.64064 11.6728 4.37115 11.7845C4.10167 11.8961 3.85681 12.0597 3.65056 12.2659C3.44431 12.4722 3.2807 12.7171 3.16908 12.9865C3.05745 13.256 3 13.5449 3 13.8365V18.2788C3 18.5705 3.05745 18.8594 3.16908 19.1288C3.2807 19.3983 3.44431 19.6432 3.65056 19.8494C3.85681 20.0557 4.10167 20.2193 4.37115 20.3309C4.64064 20.4425 4.92947 20.5 5.22115 20.5C5.51284 20.5 5.80167 20.4425 6.07115 20.3309C6.34064 20.2193 6.58549 20.0557 6.79175 19.8494C6.998 19.6432 7.16161 19.3983 7.27323 19.1288C7.38486 18.8594 7.44231 18.5705 7.44231 18.2788ZM3.63462 13.8365C3.63462 13.4158 3.80177 13.0122 4.0993 12.7147C4.39684 12.4172 4.80038 12.25 5.22115 12.25C5.64193 12.25 6.04547 12.4172 6.34301 12.7147C6.64054 13.0122 6.80769 13.4158 6.80769 13.8365V18.2788C6.80769 18.6996 6.64054 19.1032 6.34301 19.4007C6.04547 19.6982 5.64193 19.8654 5.22115 19.8654C4.80038 19.8654 4.39684 19.6982 4.0993 19.4007C3.80177 19.1032 3.63462 18.6996 3.63462 18.2788V13.8365Z" fill="black" fill-opacity="0.66" stroke="black" stroke-opacity="0.66" stroke-width="0.4" />
            </svg>
              Poll</button>
            <button onClick={() => setActiveTab('event')} className={`flex items-center gap-1 m-0 px-10 py-4 text-base text-gray-600 rounded-none ${activeTab === 'event' ? 'bg-[#EBEBEB]' : 'bg-transparent'}`} style={{ borderWidth: activeTab === 'event' ? '2px' : '0px 2px 0px 0px', borderStyle: 'solid', borderColor: activeTab === 'event' ? 'black' : 'rgb(187, 187, 187)', }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.885 18C14.3003 18 13.8017 17.7933 13.389 17.38C12.9763 16.9667 12.7697 16.4683 12.769 15.885C12.7683 15.3017 12.975 14.8027 13.389 14.388C13.803 13.9733 14.3017 13.767 14.885 13.769C15.4683 13.771 15.967 13.9777 16.381 14.389C16.795 14.8003 17.0013 15.299 17 15.885C16.9987 16.471 16.792 16.9697 16.38 17.381C15.968 17.7923 15.4697 17.9987 14.885 18ZM4 21V5H7.385V2.77H8.462V5H15.616V2.77H16.616V5H20V21H4ZM5 20H19V10.616H5V20ZM5 9.615H19V6H5V9.615Z" fill="black" fill-opacity="0.66" />
            </svg>
              Event</button>
            <div className='w-full bg-[#EBEBEB] h-[60px]'></div>
          </div>

          <div className="px-6 my-6">
            <h2 className="text-base font-semibold mb-2 text-gray-600">Create New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            {renderTabContent()}
          </div>
        </div>
      </div>

    </>
  );
};

export default SideBarPost;
