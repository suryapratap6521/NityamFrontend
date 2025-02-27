import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageData } from "../slices/pageSlice";
import AddIcon from '@mui/icons-material/Add';
import { fetchPagesByUser } from "../services/operations/pageApi";
import { Link } from 'react-router-dom';
import Advertisements from '../Components/Core/Dashboard/Advertisement'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
const Pages = () => {
    const [step, setStep] = useState(1);
    const [id, setId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const pageData = useSelector((state) => state.page.userPage || []);
    const loading = useSelector((state) => state.page.loading || false);
    const token = useSelector((state) => state.auth.token);
    const { user } = useSelector((state) => state.profile);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        console.log("hit")
        const fetchData = async () => {
            try {
                if (!loading) {
                   
                    await fetchPagesByUser(user._id, token, dispatch);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handlePageClick = (page) => {
        dispatch(setPageData(page)); // Set the clicked page's data
    };


    return (
        <div className="h-screen md:mb-0 mb-14 bg-white flex justify-around w-full">

            <div className="w-full md:w-9/12 md:py-4 md:px-16 md:pl-24 p-4 md:mt-5 mt-2">
                <div className="w-full mb-4 flex md:flex-row flex-col justify-between md:items-end">
                    <div>
                        <h1 className="md:text-3xl text-xl text-left font-semibold mb-1 text-[#8E2DE2]">
                            Pages
                        </h1>
                        <p className="text-gray-400 leading-4 text-sm ">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
                    </div>
                    <Link to="/dashboard/page/create"
                        onClick={() => handlePageClick({})}
                        className="flex justify-center items-center hover:bg-gray-200 p-2 px-6 rounded-lg cursor-pointer transition-all duration-300 bg-[#8E2DE220] w-fit mt-1 md:mt-0">
                        <div className="flex justify-center items-center">

                            <h3 className="md:text-base text-sm font-medium text-center text-[#8E2DE2] ">Add New Page</h3>
                            <AddIcon style={{ fontSize: "24px", fill: "#8E2DE2" }} />



                        </div>
                    </Link>
                </div>
                <div className="grid md:grid-cols-4 grid-cols-2 mt-10 items-center gap-3">

                    {pageData && pageData.length !== 0 &&
                        pageData.map((page, index) => (
                            <Link to="/dashboard/page/view"
                                onClick={() => handlePageClick(page)}
                                className="flex justify-center items-center md:items-start hover:bg-gray-200 p-2 rounded-md cursor-pointer transition-all duration-300 w-full bg-[#FAFAFA] border border-[#00000020]">
                                <div className="flex flex-col justify-center">
                                    <div className="w-36 h-36">
                                        <img src={page.businessProfilePicture} alt="Post Media" class="w-full h-full rounded-full m-auto object-cover cursor-pointer" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-medium mt-2 mb-1 text-center">{page.businessName}</h3>
                                        <p className="text-base mb-1 text-[#4A00E0] font-semibold text-center">{page.businessCategory}</p>
                                        <p className="text-base mb-1 text-gray-600 text-center">{page.businessDescription}</p>
                                    </div>
                                </div>
                            </Link>
                        ))

                    }


                </div>



            </div>
            {!isSmallScreen && (
                <div className="w-3/12 bg-white p-4 hidden md:block">
                    <Advertisements />
                </div>
            )}
        </div>
    );
};

export default Pages;
