import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PageWrapper from '../components/common/PageWrapper';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;