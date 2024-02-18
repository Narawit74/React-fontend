import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';
import Swal from 'sweetalert2';

const guestNav = [
  { to: '/', text: 'เข้าสู่ระบบ' },
  { to: '/register', text: 'สมัครสมาชิก' },
];

const userNav = [
  { to: '/', text: 'หน้าหลัก' },
  { to: '/rentbook', text: 'รายการหนังสือที่ยืม' },
  { to: '/profile', text: 'โปรไฟล์' },
];

const adminNav = [
  { to: '/users', text: 'รายการบัญชีทั้งหมด' },
  { to: '/rentbookAdmin', text: 'รายการหนังสือทั้งหมด' },
  { to: '/profile', text: 'โปรไฟล์' },
];

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 99;
  const finalNav = isAdmin ? adminNav : user?.id ? userNav : guestNav;
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hdlLogout = () => {
    Swal.fire({
      title: 'Warning!',
      text: 'คุณแน่ใจที่จะออกจากระบบ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ออกจากระบบ'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: 'Success',
          text: 'ออกจากระบบสำเร็จ',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        }).then(() => {
          window.location.href = '/';
        });
      }
    });
  };  

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {finalNav.map(el => (
              <li key={el.to}>
                <Link to={el.to} className="block px-4 py-2 text-sm text-gray-800 hover:bg-blue-200">{el.text}</Link>
              </li>
            ))}
            {user?.id && (
              <li>
                <button onClick={hdlLogout} className="block px-4 py-2 text-sm text-gray-800 hover:bg-red-200">ออกจากระบบ</button>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">
          {user?.id ? `ยินดีต้อนรับ, ${user.display}` : <span className="font-bold text-1xl flex gap-2"><img src="https://media.discordapp.net/attachments/1130676495296254035/1130679074046627940/6.png?ex=65dd40f2&is=65cacbf2&hm=a6c79c8735544fc6ec4d1d34510ca6cff7f4f6e6783b036091c93f5cd8e76bbd&=&format=webp&quality=lossless&width=281&height=281" alt="" width="30" height="24" />วิทยาลัยเทคนิคขอนแก่น</span>}
        </a>
      </div>
      <div className="navbar-end">
        {user?.id ? (
          <Link to="/profile" tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User avatar" src={user.avatar} />
            </div>
          </Link>
        ) : (
            <div  className="flex justify-center items-center gap-1 font-bold"><i className="fa-regular fa-clock"></i>{currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds()}</div >
        )}
      </div>
    </div>
  );
}
