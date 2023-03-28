import './App.css';
import Home from './pages/home';
import RequirePermission from '../src/components/RequirePermission';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Users from './components/Users';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import Register from './pages/register';
import Login from './pages/login';
import Listappointments from './components/Listappointment';
import Treatment from './pages/treatments';
import Calender from './components/calender';
import List from './components/List';
import Blocked from './pages/blocked';
import Reviews from './pages/reviews';
import Logout from './pages/logout';
import Requirenotlogged from './components/requirenotlogged';
import Otp from './pages/otp';
import Recover from './pages/recover';
function App() {
  const [treatmentelement, setTreatmentelement] = useState([]);
  let gettreatment = async () => {
    let { data } = await axios.get('https://mern-ul6g.onrender.com/treatment');
    setTreatmentelement(data);
  };
  useEffect(() => {
    gettreatment();
  }, []);
  const [recipient_email, setRecipient_email] = useState('');
  const [OTP, setOTP] = useState();

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/blocked" element={<Blocked />} />
          <Route element={<Requirenotlogged />}>
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<RequirePermission />}>
            <Route path="/" element={<Home />} />
            <Route path="/treatments" element={<Treatment />} />
            <Route path="/reviews" element={<Reviews />} />
            //<Route path="/book" element={<Calender />} />
            <Route
              path="/otp"
              element={<Otp recipient_email={recipient_email} OTP={OTP} />}
            />
            <Route
              path="/recover"
              element={<Recover recipient_email={recipient_email} />}
            />
            <Route
              path="/login"
              element={
                <Login
                  setRecipient_email={setRecipient_email}
                  setOTP={setOTP}
                />
              }
            />
            <Route path="/users" element={<Home />} />
            <Route path="/logout" element={<Logout />} />
          </Route>

          <Route element={<RequireAuth allowedRole={'admin'} />}>
            <Route path="/all" element={<Listappointments />} />
            <Route path="/allusers" element={<Users />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
