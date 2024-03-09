import React from 'react';
import './Dashboard.css';
import '../Maincss.css';
import PageTitle from '../components/PageTitle';
import MyCustomer from '../components/Dashboard/MyCustomer';
import Product from '../components/Dashboard/Product';
import Notice from '../components/Dashboard/Notice';
import Branch from '../components/Dashboard/Branch';
import Footer from '../components/Footer';
import useMyInfo from '../hooks/useMyInfo';

// Mock data
import user from '../virtualDB/user';

const Dashboard = () => {
  const { info } = useMyInfo();

  // Mock data
  const currentUser = user;

  return (
    <div>
      <div className="Dashboard">
        <div className="partnersMainPartContainer">
          <div className="partnersMainPart">
            <PageTitle title={info.name} subtitle="님 환영합니다." />
            <MyCustomer currentUser={currentUser} />
            <div className="partnersProductAndNotice">
              <Product />
              <Notice currentUser={currentUser} />
            </div>
            <Branch />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
