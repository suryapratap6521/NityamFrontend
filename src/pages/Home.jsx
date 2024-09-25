import React from "react";
import HomeContact from '../Components/Core/Landingpage/HomeComponents/HomeContact/HomeContact';
import HomeBanner from '../Components/Core/Landingpage/HomeComponents/HomeBanner/HomeBanner';
import HomeBusiness from '../Components/Core/Landingpage/HomeComponents/HomeBusiness/HomeBusiness';
import HomeBenefits from '../Components/Core/Landingpage/HomeComponents/HomeBenefits/HomeBenefits';
import HomeService from '../Components/Core/Landingpage/HomeComponents/HomeService/HomeService';
import HomeAbout from "../Components/Core/Landingpage/HomeComponents/HomeAbout/HomeAbout";

const Home = () => {
  return (
    <>
      <HomeBanner />
      <HomeBenefits/>
      <HomeAbout />
      <HomeService/>
      <HomeBusiness/>
      <HomeContact />
    </>
  );
};

export default Home;
