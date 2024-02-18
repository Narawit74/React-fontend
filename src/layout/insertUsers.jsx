import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';
import useAuth from '../Hooks/useAuth';

export default function insertUsers() {
    const [input, setInput] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    })

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    }

    const [error, setError] = useState('');
    const validateForm = () => {
        if (!input.username.trim() || !input.password.trim() || !input.confirmPassword.trim()) {
            setError('โปรดกรอกชื่อผู้ใช้, รหัสผ่าน, และยืนยันรหัสผ่าน');
            return false;
        }
        if (input.password !== input.confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return false;
        }
        setError('');
        return true;
    };

    const hdlSubmit = async e => {
        try {
            e.preventDefault();
            if (!validateForm()) return;

            const rs = await axios.post('http://localhost:3000/auth/register', input);
            console.log(rs);
            if (rs.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Created Successfuly',
                    text: 'สร้างบัญชีสำเร็จแล้ว!',
                    timer: 1500
                }).then(() => {
                    window.location.href = '/users';
                });
            }
        } catch (err) {
            console.log(err.message);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: 'เกิดข้อผิดพลาดระหว่างการลงทะเบียน กรุณาลองใหม่อีกครั้งในภายหลัง.'
            });
        }
    };

    return (
        <>
            <div className='flex text-3xl font-bold pt-20 justify-center bg-gray-800 text-white'>
                <h1>เพิ่มข้อมูลบัญชีผู้ใช้งาน</h1>
            </div>
            <div className='flex flex-col lg:flex-row gap-2 justify-center bg-gray-800 p-10'>
                <div className='rounded-md p-10 bg-white w-full lg:max-w-xl'>
                    <form onSubmit={hdlSubmit} className='flex flex-col items-center'>
                        <div className="w-full max-w-xs mb-4">
                            <div className="join flex items-center">
                                <label htmlFor="username" className="btn join-item"><i className="fa-solid fa-user"></i></label>
                                <input id="username" className="input input-bordered join-item w-full" placeholder="ชื่อผู้ใช้"
                                    name="username"
                                    value={input.username}
                                    onChange={hdlChange} />
                            </div>
                        </div>

                        <div className="w-full max-w-xs mb-4">
                            <div className="join flex items-center">
                                <label htmlFor="email" className="btn join-item"><i className="fa-solid fa-envelope"></i></label>
                                <input id="email" className="input input-bordered join-item w-full" required placeholder="อีเมล"
                                    name="email"
                                    value={input.email}
                                    onChange={hdlChange} />
                            </div>
                        </div>

                        <div className="w-full max-w-xs mb-4">
                            <div className="join flex items-center">
                                <label htmlFor="password" className="btn join-item"><i className="fa-solid fa-lock"></i></label>
                                <input id="password" className="input input-bordered join-item w-full" placeholder="รหัสผ่าน" type="password"
                                    name="password"
                                    value={input.password}
                                    onChange={hdlChange} />
                            </div>
                        </div>

                        <div className="w-full max-w-xs mb-4">
                            <div className="join flex items-center">
                                <label htmlFor="confirmPassword" className="btn join-item"><i className="fa-solid fa-unlock"></i></label>
                                <input id="confirmPassword" className="input input-bordered join-item w-full" placeholder="ยืนยันรหัสผ่าน" type="password"
                                    name="confirmPassword"
                                    value={input.confirmPassword}
                                    onChange={hdlChange} />
                            </div>
                        </div>

                        <div className="join flex items-center mb-4">
                            {error && <div className="text-red-500">{error}</div>}
                        </div>

                        <div className='label flex justify-center'>
                            <div className='flex gap-3'>
                                <Link to="/users" className="btn btn-outline">ยกเลิก</Link>
                                <button className="btn btn-outline btn-success">เพิ่มข้อมูล</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className='flex flex-col lg:flex-row gap-2 justify-center bg-gray-800 p-10'></div>
        </>
    )
}
