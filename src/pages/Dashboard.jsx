import React from 'react';
import { useSelector } from 'react-redux';
import Loader from '../Components/Common/Loader';
import Sidebar from '../Components/Core/Dashboard/Sidebar';
import Posts from '../Components/Core/Post/Posts';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Advertisements from '../Components/Core/Dashboard/Advertisement'


const Dashboard = () => {
  const { loading: profileLoading } = useSelector((state) => state.auth);
  const { loading: authLoading } = useSelector((state) => state.profile);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const ad = [{ head: 'Book Your House Today!', subtitle: 'Lorem ipsum dolor sit' }, { head: 'Book Your House Today!', subtitle: 'Lorem ipsum dolor sit ' }]
  const noti = [{ head: 'Anubhav Singh', subtitle: 'liked your post' }, { head: 'Anubhav Singh', subtitle: 'liked your post' }]
  if (profileLoading || authLoading) {
    return <Loader />;
  }

  return (
    <div className="h-screen md:mb-0 mb-14 bg-white">

      <div className="w-full flex justify-between">
        {!isSmallScreen && (

          <div className="w-3/12 bg-white p-4  hidden md:flex  flex-col items-center">
            <div className="bg-[#fafafa] w-full px-4 py-4 rounded-lg border-2  border-gray-200 max-w-[350px] ">
              <h1 className='text-lg font-semibold text-gray-600'>My Pages</h1>
              {ad.map((ad, index) => (<>
                <div className="w-full mt-4 flex items-center justify-between gap-2">
                  <div className="w-9 h-9">
                    <img className='bg-gray-400 w-full h-full rounded-full' />
                  </div>
                  <div className="w-10/12 flex justify-between items-center">
                    <div className="w-10/12">
                      <h2 className="text-base font-normal text-black">{ad.head} </h2>
                      <p className="text-gray-400 leading-4 text-sm ">{ad.subtitle}</p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 4C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V14C4 14.5304 4.21071 15.0391 4.58579 15.4142C4.96086 15.7893 5.46957 16 6 16H14C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14V11.5C16 11.3674 16.0527 11.2402 16.1464 11.1464C16.2402 11.0527 16.3674 11 16.5 11C16.6326 11 16.7598 11.0527 16.8536 11.1464C16.9473 11.2402 17 11.3674 17 11.5V14C17 14.7956 16.6839 15.5587 16.1213 16.1213C15.5587 16.6839 14.7956 17 14 17H6C5.20435 17 4.44129 16.6839 3.87868 16.1213C3.31607 15.5587 3 14.7956 3 14V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H8.5C8.63261 3 8.75979 3.05268 8.85355 3.14645C8.94732 3.24021 9 3.36739 9 3.5C9 3.63261 8.94732 3.75979 8.85355 3.85355C8.75979 3.94732 8.63261 4 8.5 4H6ZM11 3.5C11 3.36739 11.0527 3.24021 11.1464 3.14645C11.2402 3.05268 11.3674 3 11.5 3H16.5C16.6326 3 16.7598 3.05268 16.8536 3.14645C16.9473 3.24021 17 3.36739 17 3.5V8.5C17 8.63261 16.9473 8.75979 16.8536 8.85355C16.7598 8.94732 16.6326 9 16.5 9C16.3674 9 16.2402 8.94732 16.1464 8.85355C16.0527 8.75979 16 8.63261 16 8.5V4.707L11.854 8.854C11.7601 8.94789 11.6328 9.00063 11.5 9.00063C11.3672 9.00063 11.2399 8.94789 11.146 8.854C11.0521 8.76011 10.9994 8.63278 10.9994 8.5C10.9994 8.36722 11.0521 8.23989 11.146 8.146L15.293 4H11.5C11.3674 4 11.2402 3.94732 11.1464 3.85355C11.0527 3.75979 11 3.63261 11 3.5Z" fill="black" />
                    </svg>

                  </div>
                </div>
              </>))}
            </div>

            <div className="bg-[#fafafa] w-full px-4 py-4 rounded-lg border-2  border-gray-200 max-w-[350px] mt-4 ">
              <h1 className='text-lg font-semibold text-gray-600'>My Notifications</h1>
              {noti.map((ad, index) => (<>
                <div className="w-full mt-4 flex items-center justify-between gap-2">
                  <div className="w-9 h-9">
                    <img className='bg-gray-400 w-full h-full rounded-full' />
                  </div>
                  <div className="w-10/12 flex justify-between items-center">
                    <div className="w-10/12">
                      <h2 className="text-base font-normal text-black">{ad.head} </h2>
                      <p className="text-gray-400 leading-4 text-sm ">{ad.subtitle}</p>
                    </div>
                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.4685 2.20887C15.0854 1.82562 14.6306 1.5216 14.13 1.31418C13.6294 1.10676 13.0928 1 12.551 1C12.0091 1 11.4725 1.10676 10.972 1.31418C10.4714 1.5216 10.0165 1.82562 9.63347 2.20887L8.83847 3.00387L8.04347 2.20887C7.2697 1.4351 6.22024 1.0004 5.12597 1.0004C4.03169 1.0004 2.98224 1.4351 2.20847 2.20887C1.4347 2.98264 1 4.03209 1 5.12637C1 6.22064 1.4347 7.2701 2.20847 8.04387L3.00347 8.83887L8.83847 14.6739L14.6735 8.83887L15.4685 8.04387C15.8517 7.6608 16.1557 7.20598 16.3632 6.70539C16.5706 6.20479 16.6773 5.66823 16.6773 5.12637C16.6773 4.5845 16.5706 4.04795 16.3632 3.54735C16.1557 3.04676 15.8517 2.59194 15.4685 2.20887Z" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>


                  </div>
                </div>
              </>))}
            </div>
            {/* Ads*/}
          </div>
        )}
        <div className="w-6/12 overflow-y-auto p-4">
          <Posts />
        </div>
        {!isSmallScreen && (
          <div className="w-3/12 bg-white p-4 hidden md:block">
            <Advertisements />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
