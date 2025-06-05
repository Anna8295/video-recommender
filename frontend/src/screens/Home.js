import React, {useState} from "react";

import Sidebar from "../components/SideBar";
import Main from "../components/Main";
import Movies from '../components/Movies'
import Series from '../components/Series'
import Bookmark from '../components/Bookmark'

import './Home.css';

const Home = () => {
    const [activeContent, setActiveContent] = useState('main');

    const handleSidebarClick = (content) => {
        setActiveContent(content);
      };

  return (
    <div className="home-container">
        < Sidebar onLinkClick={handleSidebarClick} activeContent={activeContent}/>
        <div className="main-content">
            {activeContent === 'main' && <Main />}
            {activeContent === 'movies' && <Movies />}
            {activeContent === 'series' && <Series />}
            {activeContent === 'bookmark' && <Bookmark />}
        </div>
    </div>
  );
};

export default Home;
