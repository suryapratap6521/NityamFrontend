import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageData } from "../slices/pageSlice";
import AddIcon from '@mui/icons-material/Add';
import { fetchPagesByUser } from "../services/operations/pageApi";
import { Link } from 'react-router-dom';
const Pages = () => {
    const [step, setStep] = useState(1);
    const [id, setId] = useState("678611ced44199055cb22c60");
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const pageData = useSelector((state) => state.page.userPage || []);
    const loading = useSelector((state) => state.page.loading || false);
    const token = useSelector((state) => state.auth.token);
    const { user } = useSelector((state) => state.profile);

    //console.log("678611ced44199055cb22c60");
    useEffect(() => {
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
        <div className="container items-start border-t-0 flex flex-row mx-auto p-6">

            <div className="w-full">
                <h1 className="text-3xl text-left font-bold mb-4">
                    My Pages
                </h1>

                <div className="grid grid-cols-4 mt-10 items-center">

                    {pageData && pageData.length !== 0 &&
                        pageData.map((page, index) => (
                            <Link to="/dashboard/page/view"
                                onClick={() => handlePageClick(page)}
                                className="flex justify-center items-center md:items-start md:mb-10 hover:bg-gray-200 p-2 rounded-lg cursor-pointer transition-all duration-300 w-full">
                                <div className="flex flex-col justify-center">
                                    <img src={page.businessProfilePicture} alt="Post Media" class="w-64 h-64 rounded-full m-auto object-cover cursor-pointer" />
                                    <div>
                                        <h3 className="text-xl font-bold mt-3 mb-2 text-center">{page.businessName}</h3>
                                        <p className="text-base mb-1 text-gray-600 text-center">{page.businessDescription}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    }
                    <Link to="/dashboard/page/create"
                        onClick={() => handlePageClick({})}
                        className="flex justify-center items-center md:items-start md:mb-10 hover:bg-gray-200 p-2 rounded-lg cursor-pointer transition-all duration-300 w-full">
                        <div className="flex flex-col justify-center w-64 h-64 items-center">


                            <AddIcon style={{ fontSize: "50px", fill: "#1a8e44" }} />
                            <h3 className="text-xl font-bold mt-3 mb-2 text-center">Create New Page</h3>


                        </div>
                    </Link>
                </div>



            </div>

        </div>
    );
};

export default Pages;
