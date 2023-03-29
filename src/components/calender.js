import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import List from './List';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAppointments } from '../redux/slices/UserReducer';
import moment from 'moment';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Navbarbook from './Navbarbook';

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
const amount = '30';
const currency = 'USD';
const style = { layout: 'vertical' };
function Calender() {
  const [currentDate, setCurrentDate] = useState([]);

  const dispatch = useDispatch();
  const [dates, setDates] = useState([]);
  const { oldappoitments } = useSelector((state) => state.userAuth);
  //console.log(oldappoitments);
  const [selectedDate, setSelectedDate] = useState(null);
  const [paid, setPaid] = useState(false);
  let getdates = async () => {
    let { data } = await axios.get('https://mern-ul6g.onrender.com/book');
    const datearray = data.map((el) => new Date(el.date));
    const newdatearray = datearray.map((el) => {
      dates.push(el);
    });
  };
  useEffect(() => {
    getdates();
  }, []);
  const { userAuth } = useSelector((state) => state);
  const loggeduser = userAuth?.loggeduser.signeduser;
  const addappointment = async () => {
    console.log(selectedDate);
    const beforedate = await new Date(
      bookedValue.year,
      bookedValue.month ,
      bookedValue.day,
      bookedValue.hour
    ).toLocaleString();
    const datetochange = moment(beforedate, 'DD/MM/YYYY HH:mm:ss').toDate();
    const sentdate = await datetochange.toISOString();
    console.log({
      date: sentdate,
      paid: paid,
      userid: loggeduser._id,
    });
    console.log(loggeduser._id);
    const addedappoitment = await axios.post('https://mern-ul6g.onrender.com/book', {
      date: sentdate,
      paid: paid,
      userid: loggeduser._id,
    });
  };

  const handleclick2 = (event) => {
    event.preventDefault();
    dispatch(getAppointments());
  };
  const handleclick = (event) => {
    event.preventDefault();
    addappointment();
  };
  const onPageLoadingDatetime = () => {
    setDatetimeInvalid(dates);
  };
  const [datetimeLabels, setDatetimeLabels] = React.useState([]);
  const [datetimeInvalid, setDatetimeInvalid] = React.useState([]);

  const [invalidTime, setInvalidTime] = React.useState([]);
  const [bookedValue, setBookedValue] = useState(null);
  const handleChange = (date) => {
    console.log(dates);
    const unavailable = dates.filter(
      (el) =>
        el.getFullYear() == date.getFullYear() &&
        el.getMonth() == date.getMonth() &&
        el.getDate() == date.getDate()
    );
    setBookedValue({
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
    });
    const newinvalidTime = unavailable.map((el) => el.getHours());
    setInvalidTime(newinvalidTime);
    console.log(invalidTime);
  };
  const [activeIndex, setActiveIndex] = useState(null);

  const handleTimeClick = (index, time) => {
    setActiveIndex(index);
    setBookedValue({ ...bookedValue, hour: time });
    //  '2022-04-01 12:30:00'
    setSelectedDate(
      `${bookedValue.year}-${bookedValue.month}-${bookedValue.day} ${bookedValue.hour}:00:00`
    );
  };

  if (!loggeduser) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" />;
  }
  return (
    <center>
      <div style={{ boxShadow: '5px 5px 25px' }}>
        <Calendar onChange={(date) => handleChange(date)} />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridGap: '10px',
          width: '300px',
        }}
      >
        {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((time, index) => (
          <a
            key={time}
            style={
              invalidTime.includes(time)
                ? { cursor: 'not-allowed', color: 'grey', height: '50px' }
                : {
                    cursor: 'pointer',
                    height: '50px',
                    backgroundColor:
                      activeIndex === index ? '#006edc' : 'white',
                  }
            }
            onClick={() => handleTimeClick(index, time)}
          >
            {`${time <= 12 ? time : time - 12} :00 ${time <= 12 ? 'AM' : 'PM'}`}
          </a>
        ))}
      </div>
      <button onClick={handleclick}>book</button>
      <button onClick={handleclick2}>show old appointments</button>
      {oldappoitments?.map((el) => (
        <div>{el.date}</div>
      ))}
      <PayPalScriptProvider options={{ 'client-id': 'test' }}>
        <PayPalButtons
          forceReRender={[amount, currency, style]}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                  },
                ],
              })
              .then((orderId) => {
                // Your code here after create the order
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function () {
              setPaid(true);
            });
          }}
        />
      </PayPalScriptProvider>
    </center>
  );
}
export default Calender;
