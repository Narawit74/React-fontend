import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import useAuth from '../Hooks/useAuth';
import Swal from 'sweetalert2';

function AdminUsers() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user.role !== 99) {
            Swal.fire({
                icon: 'error',
                title: 'Login role failed',
                text: 'หน้าเพจนี้เฉพาะเจ้าหน้าที่เท่านั้น',
                timer: 2000
            });
            navigate('/');
        }
    }, [user, navigate]);

    const [User, setUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const url = searchText.length !== 0
                ? `http://localhost:3000/user/search?text=${searchText}`
                : "http://localhost:3000/user/users";

            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching Users:", error);
            }
        };

        fetchData();
    }, [searchText]);

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            const allIds = User.map(User => User.id);
            setSelectedItems(allIds);
        } else {
            setSelectedItems([]);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            await axios.delete("http://localhost:3000/user/delete", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                data: {
                    selectedItems: selectedItems
                }
            });
            // ลบข้อมูลเรียบร้อยแล้ว อัพเดทผู้ใช้ที่แสดง
            const updatedUsers = User.filter(user => !selectedItems.includes(user.id));
            setUsers(updatedUsers);
            // ล้างรายการที่เลือก
            setSelectedItems([]);
            Swal.fire({
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
                text: 'ลบบัญชีที่เลือกเรียบร้อยแล้ว',
                timer: 2000
            });
        } catch (error) {
            console.error("Error deleting selected users:", error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาดในการลบลบบัญชี',
                text: 'โปรดลองอีกครั้งภายหลัง',
                timer: 2000
            });
        }
    };    

    const handleDeleteItem = async (id) => {
        // สร้างกล่องข้อความยืนยันการลบ
        const confirmDelete = await Swal.fire({
            icon: 'warning',
            title: 'ยืนยันการลบลบบัญชี',
            text: 'คุณแน่ใจหรือไม่ที่ต้องการลบลบบัญชีนี้?',
            showCancelButton: true,
            confirmButtonText: 'ใช่, ลบ!',
            cancelButtonText: 'ยกเลิก'
        });
    
        // ถ้าผู้ใช้ยืนยันการลบ
        if (confirmDelete.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3000/user/delete/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                // ลบข้อมูลเรียบร้อยแล้ว
                Swal.fire({
                    icon: 'success',
                    title: 'ลบข้อมูลสำเร็จ',
                    text: 'ลบบัญชีเรียบร้อยแล้ว',
                    timer: 2000
                });
                // รีโหลดหน้าเว็บหลังจากลบข้อมูล
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                console.error(`Error deleting user with ID ${id}:`, error);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาดในการลบข้อมูล',
                    text: 'โปรดลองอีกครั้งภายหลัง',
                    timer: 2000
                });
            }
        }
    };    

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    return (
        <>
            <div className="navbar bg-base-300 flex justify-end gap-4">
                <div>
                    <input
                        type="text"
                        className="input w-full md:w-72 border border-gray-300 rounded-md p-2 bg-red-200"
                        placeholder="ค้นหา..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <Link to="/created" className="btn btn-success">เพิ่มบัญชี</Link>
                <button className="btn bg-red-300" onClick={handleDeleteSelected}>ลบบัญชีที่เลือก</button>
                {/* <button className="btn" onClick={handleDeleteSelected}>ลบข้อมูลที่เลือก</button> */}
            </div>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                <label className='flex items-center justify-center gap-1'>
                                    <input type="checkbox" className="checkbox" checked={selectAll} onChange={handleSelectAll} />
                                    <p>เลือกทั้งหมด</p>
                                </label>
                            </th>
                            <th>ไอดี</th>
                            <th>ชื่อบัญชี</th>
                            <th>วันสร้างบัญชี</th>
                            <th>อีเมล</th>
                            <th>บทบาท</th>
                            <th>แก้ใขข้อมูล / ลบข้อมูล</th>
                        </tr>
                    </thead>
                    <tbody>
                        {User.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <p className="text-center italic">ไม่มีข้อมูลในรายการ</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                             User.map(User => (
                                <tr key={User.id}>
                                    <td className='flex justify-center'>
                                        <label>
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                checked={selectedItems.includes(User.id)}
                                                onChange={() => handleSelectItem(User.id)}
                                            />
                                        </label>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={User.avatar} alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-center items-center font-bold">ID: {User.id}</div>
                                                <div className="flex justify-center items-center text-sm opacity-50"><i className="fa-solid fa-user"></i>{User.Username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='font-bold'>{User.display}</td>
                                    <td>{new Date(User.createdAt).toLocaleDateString()}</td>
                                    <td className=' font-bold'>{User.Email}</td>
                                    <td>
                                        <button className="btn btn-ghost btn-xs text-green-500">{User.role}</button>
                                    </td>

                                    <td className='flex gap-3'>
                                        <Link to={`/edituser?id=${User.id}`} className="btn btn-outlin bg-red-300">แก้ใขบัญชี</Link>
                                        <button className="btn btn-outline btn-error" onClick={() => handleDeleteItem(User.id)}>ลบบัญชี</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AdminUsers