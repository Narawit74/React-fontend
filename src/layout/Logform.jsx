import React, { useState } from 'react'
import axios from 'axios'
import useAuth from '../Hooks/useAuth'
import { Link, redirect } from 'react-router-dom'
import Swal from 'sweetalert2';

export default function Logform() {
    const { setUser } = useAuth()
    const [input, setInput] = useState({
        username: '',
        password: ''
    })

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    }

    const [error, setError] = useState('');
    const validateForm = () => {
        if (!input.username.trim() || !input.password.trim()) {
            setError('โปรดกรอกชื่อผู้ใช้และรหัสผ่าน');
            return false;
        }
        setError('');
        return true;
    };

    const hdlSubmit = async e => {
        try {
            e.preventDefault();
            if (!validateForm()) return;

            const rs = await axios.post("http://localhost:3000/auth/login", input);
            localStorage.setItem("token", rs.data.token);

            const localtoken = localStorage.getItem("token");
            const rs1 = await axios.get("http://localhost:3000/auth/me", {
                headers: { Authorization: `Bearer ${localtoken}` }
            });
            delete rs1.data.Password;
            setUser(rs1.data);
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'คุณเข้าสู่ระบบสำเร็จแล้ว!',
                timer: 1500,
                showConfirmButton: false
            }).then(()=> {
                if(rs1.data.role === 99){
                    console.log('role 99 success')
                    window.location = "/rentBookAdmin"
                }});
                
        } catch (err) {
            console.log(err.message);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'เกิดข้อผิดพลาดขณะเข้าสู่ระบบ โปรดลองอีกครั้งในภายหลัง'
            });
        }
    };

    return (
        <>
            <div className='flex text-3xl font-bold pt-20 justify-center bg-gray-800 text-white'>
                <h1>เข้าสู่ระบบ</h1>
            </div>
            <div className='flex flex-col lg:flex-row gap-2 justify-center bg-gray-800 p-10'>
                <div className='rounded-md p-10 bg-white'>
                    <form onSubmit={hdlSubmit} className='flex justify-center'>
                        <label className="form-control w-full max-w-xs">
                            <div className="label pl-20">
                            </div>

                            <div className="join flex items-center">
                                <label className="btn join-item"><i className="fa-solid fa-user"></i></label>
                                <input className="input input-bordered join-item" placeholder="ชื่อผู้ใช้"
                                    name="username"
                                    value={input.username}
                                    onChange={hdlChange} />
                            </div>

                            <div className="label">
                            </div>

                            <div className="join flex items-center">
                                <label className="btn join-item"><i className="fa-solid fa-lock"></i></label>
                                <input className="input input-bordered join-item" placeholder="รหัสผ่าน" type="password"
                                    name="password"
                                    value={input.password}
                                    onChange={hdlChange} />
                            </div>

                            <div className="join flex items-center">
                                {error && <div className="text-red-500">{error}</div>}
                            </div>

                            <div className='label flex justify-center'>
                                <div className='flex gap-3'>
                                    <Link to="/register">คุณต้องการสมัครบัญชี</Link>
                                    <button className="btn" onChange={hdlSubmit}>เข้าสู่ระบบ</button>
                                </div>
                            </div>
                        </label>
                    </form>
                </div>
                <div className='rounded-md p-10 bg-white'>
                    <p className='font-bold'>การนำเข้าข้อมูล รูปภาพ หรือ สื่อต่างๆ</p>
                    <label className='text-red-500 font-bold'>ที่นำเสนอแนวทางยั่วยุในกามอารมณ์ ลามกอนาจาร
                        <p>สร้างความเดือดร้อนให้แก่ผู้อื่น สังคม ประเทศ ละเมิดลิขสิทธ์ของผู้อื่น</p>
                        <p>หรือสิ่งหนึ่งสิ่งใดก็แล้วแต่ในลักษณะเดียวกัน</p></label>
                    <p>มีความผิดตามกฏหมาย <label className='font-bold'>ทีมงานจะระงับใช้ ID ของท่านโดยไม่มีการแจ้งให้ทราบล่วงหน้า</label></p>
                </div>
            </div>
            <div className='flex flex-col lg:flex-row gap-2 justify-center bg-gray-800 p-10'></div>
        </>
    )
}
