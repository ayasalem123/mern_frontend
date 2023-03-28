import { useSelector, useDispatch } from 'react-redux';
import { blockuser, unblockuser } from '../redux/slices/AdminReducer.js';
import Navbaradmin from './navbaradmin.js';
export default function Users() {
  const dispatch = useDispatch();
  const handleclick = (id) => {
    dispatch(blockuser({ id }));
  };
  const handleclick2 = (id) => {
    dispatch(unblockuser({ id }));
  };
  const { Allusers } = useSelector((state) => state.admin);
  return (
    <center>
      <Navbaradmin />
      {Allusers?.map((el) => {
        return (
          <center style={{ backgroundColor: '#005A9C', width: '50%' }}>
            <div style={{ fontSize: '25px' }}>{el.email}</div>
            <button
              onClick={(event) => {
                event.preventDefault();
                handleclick(el._id);
              }}
            >
              block
            </button>
            <button
              onClick={(event) => {
                event.preventDefault();
                handleclick2(el._id);
              }}
            >
              unblock
            </button>
          </center>
        );
      })}
    </center>
  );
}
