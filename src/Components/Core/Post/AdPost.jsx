import React from 'react';
import { FaRegHeart, FaRegComment } from 'react-icons/fa';
import { FiShare } from 'react-icons/fi';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';

const AdPosts = ({ ad }) => {
    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm px-6 py-3 mb-6 border border-gray-300">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <AccountCircleIcon
                        className="text-[#bdbdbd]"
                        style={{ fontSize: '42px', color: '#bdbdbd' }}
                    />
                    <div>
                        <h4 className="font-semibold text-gray-800">
                            {'Dummy Text'}
                        </h4>
                        <p className="text-sm text-gray-500">Sponsored</p>
                    </div>
                </div>
            </div>
            <h2 className="text-xl font-normal text-black mt-3">{ad.title}</h2>
            <p className="text-gray-400 leading-4 text-sm">{ad.description}</p>
            <img
                className="bg-gray-400 w-full h-56 rounded-md"
                src={ad.imageUrl}
                alt="Ad"
            />

            <a
                href={ad.buttonLabel?.value || '#'}
                target="_blank"
                rel="noopener noreferrer"
            >
                <button className="w-fit mt-2 p-2 text-[#4A00E0] text-sm px-8 rounded-md bg-[#4A00E020]">
                    {ad.buttonLabel?.type || 'Learn More'}
                </button>
            </a>
            <div className="flex items-center justify-between mt-4 px-4 py-2 border-t border-b border-gray-100">
                <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">
                        {ad.like?.length || 0} likes
                    </span>
                </div>
                <div className="flex space-x-4">
                    <IconButton>
                        <FaRegHeart className="text-gray-600" />
                    </IconButton>
                    <IconButton>
                        <FaRegComment className="text-gray-600" />
                    </IconButton>
                    <IconButton>
                        <FiShare className="text-gray-600" />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default AdPosts;
