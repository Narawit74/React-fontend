import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../Hooks/useAuth';
import axios from 'axios';

function AdminRentBookEdit() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rentdata, setRentData] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const searchParams = new URLSearchParams(window.location.search);

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

        const fetchBook = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/rentbook/edit/${searchParams.get('id')}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log(response.data);
                setRentData(response.data);
            } catch (error) {
                console.error("Error fetching Book:", error);
            }
        };

        fetchBook();
    }, [user, navigate]);

    const fetchBook = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/rentbook/edit/${searchParams.get('id')}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            setRentData(response.data);
        } catch (error) {
            console.error("Error fetching Book:", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', formData.title);
            formData.append('img', selectedImage); // เพิ่มรูปภาพที่เลือกเข้ากับ FormData
            formData.append('duedate', formData.duedate);
            formData.append('status', formData.status);

            const response = await axios.patch(
                `http://localhost:3000/rentbook/edit/${searchParams.get('id')}`,
                formData, // ส่ง FormData ที่มีข้อมูลและไฟล์รูปภาพไปยังเซิร์ฟเวอร์
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // กำหนดเป็น multipart/form-data
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            console.log(response.data);

            // ส่ง Stage ใหม่
            fetchBook(); // เรียกใช้ฟังก์ชัน fetchBook เพื่อโหลดข้อมูล Stage ใหม่
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };    

    return (
        <div className="container mx-auto px-4 pb-10">
            <div className="md:flex md:justify-center">
                <div className="md:w-1/2">
                    <h3 className="text-lg font-semibold mb-4">แก้ใขข้อมูลรายการหนังสือ</h3>
                    {Object.entries(rentdata).map(([key, value]) => (
                        <form key={key} className='space-y-4' onSubmit={handleSubmit}>
                            <div className="space-y-1">
                                <label htmlFor="id" className="block text-sm text-gray-700 font-bold">ไอดีหนังสือ :</label>
                                <input type="text" id="id" className="input w-full border border-gray-300 rounded-md" placeholder="ไอดีหนังสือ" name="id" defaultValue={value.id} disabled />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="title" className="block text-sm text-gray-700 font-bold">ชื่อหนังสือ :</label>
                                <input type="text" id="title" className="input w-full border border-gray-300 rounded-md" placeholder="ชื่อหนังสือ" name="title" defaultValue={value.Title} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {selectedImage ? (
                                            <img src={URL.createObjectURL(selectedImage)} alt="Uploaded" className="w-40 h-40 mb-4" />
                                        ) : (
                                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0-3-3v3z" />
                                            </svg>
                                        )}
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} />
                                    </label>
                                </div>
                                <div>
                                    <div className='flex gap-3 items-center'>
                                        <label htmlFor="createAt" className="block text-sm font-bold text-gray-700 md:w-1/3 text-right">วันที่ยืม:</label>
                                        <input type="date" id="createAt" className="input w-full md:w-3/4 border border-gray-300 rounded-md p-2" name="createAt" defaultValue={value.createdAt.substring(0, 10)} required />
                                    </div><br />
                                    <div className='flex gap-3 items-center'>
                                        <label htmlFor="duedate" className="block text-sm font-bold text-gray-700 md:w-1/3 text-right">วันที่ส่งคืน:</label>
                                        <input type="date" id="duedate" className="input w-full md:w-3/4 border border-gray-300 rounded-md p-2" name="duedate" defaultValue={value.Duedate.substring(0, 10)} required />
                                    </div><br />
                                    <div className='flex gap-3 items-center'>
                                        <label htmlFor="status" className="block text-sm font-bold text-gray-700 md:w-1/3 text-right">สถานะ :</label>
                                        <select id="status" className="input border border-gray-300 rounded-md w-full md:w-3/4" name="status" required>
                                            <option value="">เลือกสถานะ</option>
                                            <option value="PENDING">PENDING</option>
                                            <option value="DOING">DOING</option>
                                            <option value="DONE">DONE</option>
                                        </select>
                                    </div><br />
                                    <div className='flex gap-3 items-center'>
                                        <label htmlFor="UserID" className="block text-sm font-bold text-gray-700 md:w-1/3 text-right">ไอดี :</label>
                                        <input type="text" id="UserID" className="input w-full md:w-3/4 border border-gray-300 rounded-md p-2" placeholder="ไอดีผู้ใช้งาน" name="UserID" required defaultValue={value.UserID} disabled />
                                    </div>
                                </div>
                            </div>

                            <div className='flex gap-3 justify-start'>
                                <Link to="/rentbookAdmin" className="btn btn-outline">ยกเลิก</Link>
                                <button type="submit" className="btn btn-outline btn-warning">บันทึกข้อมูล</button>
                            </div>
                        </form>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminRentBookEdit;
