import React, { useState } from 'react';
import './ChangePasswordScreen.css';
import InputForm from '../../../components/mobileComponents/Login/InputForm';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

const ChangePasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  return (
    <div>
      <FiArrowLeft
        onClick={() => history.goBack()}
        className="loginBackArrow"
      />
    </div>
  );
};

export default ChangePasswordScreen;
