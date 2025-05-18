import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PageWrapper from '../components/common/PageWrapper';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <PageWrapper>
            <Outlet />
          </PageWrapper>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;