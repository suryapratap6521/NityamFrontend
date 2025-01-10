import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import OpenRoute from "./Components/Core/Auth/OpenRoute";
import PrivateRoute from "./Components/Core/Auth/PrivateRoute";
import Home from "./pages/Home";
import Login from "./Components/Core/Auth/Login";
import Signup from "./Components/Core/Auth/Signup";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import Community from "./Components/Core/Auth/Community";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Myprofile from "./Components/Core/Dashboard/Myprofile";
import Error from "./pages/Error";
import SideBarPost from "./Components/Core/Post/SideBarPost";
import CreatePost from "./Components/Core/Post/CreatePost";
import ChatPage from "./pages/ChatPage";
import GoogleAfterDetails from "./Components/Core/Auth/GoogleAfterDetails";
import Settings from "./Components/Core/Settings";
import { LayoutLoader } from "./Components/Core/Dashboard/LayoutLoader";
import Layout from "./Layout/Layout";
import Footer from "./Layout/Footer/Footer";
import ServicePage from "./pages/ServicePage";
import "./App.css";
import CreateServicePage from "./pages/CreateServicePage";
import BusinessPage from "./pages/BusinessPage";
import ProfileDetails from "./Components/Core/Auth/ProfileDetails";
import CommunityAddress from "./Components/Core/Auth/CommunityAddress";
import Verification from "./Components/Core/Auth/Verification";
import Profession from "./Components/Core/Auth/Profession";
import Page from "./Components/Core/Page/Page";
import PageAd from "./Components/Core/Page/PageAd"
function App() {
  return (
    <div>
      {/* <ChatPage/> */}
      {/* <Navbar/> */}
      {/* <Suspense fallback={<LayoutLoader />}> */}
      <Routes>
        {/* route set for home page */}
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="/profiledetails"
          element={
            <PrivateRoute>
              <ProfileDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/communityaddress"
          element={
            <PrivateRoute>
              <CommunityAddress />
            </PrivateRoute>
          }
        />
        <Route
          path="/community"
          element={
            <PrivateRoute>
              <Community />
            </PrivateRoute>
          }
        />
        <Route
          path="/verification"
          element={
            <PrivateRoute>
              <Verification />
            </PrivateRoute>
          }
        />

        <Route
          path="/profession"
          element={
            <PrivateRoute>
              <Profession />
            </PrivateRoute>
          }
        />

        <Route
          path="/details"
          element={
            <OpenRoute>
              <GoogleAfterDetails />
            </OpenRoute>
          }
        />

        <Route
          path="/verifyemail"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          path="/forgotpassword"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        <Route
          path="/business"
          element={
            <OpenRoute>
              <BusinessPage />
            </OpenRoute>
          }
        />

        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <OpenRoute>
                <Home />
              </OpenRoute>
            }
          >
            {/* <Footer /> */}
          </Route>
          <Route
            path="/dashboard/addservice"
            element={
              <PrivateRoute>
                <CreateServicePage />
              </PrivateRoute>
            }
          ></Route>

          <Route
            path="/dashboard/services"
            element={
              <PrivateRoute>
                <ServicePage />
              </PrivateRoute>
            }
          ></Route>

          {/* route set for dashboard */}
          <Route
            path="/dashboard/chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          ></Route>

          <Route
            path="/dashboard/createpost"
            element={
              <PrivateRoute>
                <SideBarPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/myprofile"
            element={
              <PrivateRoute>
                <Myprofile />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/page"
            element={
              <PrivateRoute>
                <Page />
              </PrivateRoute>
            }
          />
           <Route
            path="/dashboard/page/ad"
            element={
              <PrivateRoute>
                <PageAd />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            {/* <Route path='/dashboard/settings' element={<Settings />}/> */}

            <Route path="*" element={<Error />} />
          </Route>
        </Route>
      </Routes>
      {/* </Suspense> */}

      {/* <Footer/> */}
    </div>
  );
}

export default App;
