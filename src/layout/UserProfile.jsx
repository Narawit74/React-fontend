import axios from "axios";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

function UserProfile() {
    const [formData, setFormData] = useState({
        email: '',
        displayname: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        profilepicture: ''
    });

    const handleClear = () => {
        setFormData({
            email: '',
            displayname: '',
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            profilepicture: ''
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const jsonData = JSON.stringify(formData);
        axios.patch('http://localhost:3000/auth/update', jsonData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: JSON.stringify(response.data.message),
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.reload();
                });
            })
            .catch(error => {
                console.error(error);
            });
    };

    const [user, setUser] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/user", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching User:", error);
            }
        };
        fetchData();
    }, []);

    const handleEditProfile = () => {
        setFormData({
            email: user.Email,
            displayname: user.display,
            profilepicture: user.avatar,
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-2 justify-center bg-gray-800 p-10">
            <div className="rounded-md p-10 bg-white">
                <div className="photo-wrapper p-2">
                    <h1 className="flex justify-center text-xl font-bold">แก้ไขโปรไฟล์</h1><br />
                    <img className="rounded-full mx-auto" src={user.avatar} alt="avatar" width="180px" height="140px" />
                </div>
                <div className="p-2">
                    <h3 className="text-center text-xl text-gray-900 font-medium leading-8">{user.Username}</h3>
                    <div className="text-center text-gray-400 text-xs font-semibold">
                        <p>ชื่อที่แสดง : {user.display}</p>
                    </div>
                    <table className="text-xs my-3 flex justify-center">
                        <tbody>
                            <tr>
                                <td className="px-2 py-2 text-gray-500 font-semibold">ไอดี :</td>
                                <td className="px-2 py-2">{user.id}</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-2 text-gray-500 font-semibold">อีเมล :</td>
                                <td className="px-2 py-2">{user.Email}</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-2 text-gray-500 font-semibold">รหัสผ่าน :</td>
                                <td className="px-2 py-2">##########</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-2 text-gray-500 font-semibold">บทบาท :</td>
                                <td className="px-2 py-2">{user.role}</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-2 text-gray-500 font-semibold">วันที่สร้างบัญชี :</td>
                                <td className="px-2 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex gap-1 justify-center">
                        <button className="btn" onClick={handleEditProfile}>
                            แก้ไขข้อมูล<i className="fa-regular fa-pen-to-square"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className='rounded-md p-10 bg-white'>
                <p className='font-bold'>การนำเข้าข้อมูล รูปภาพ หรือ สื่อต่างๆ</p>
                <label className='text-red-500 font-bold'>ที่นำเสนอแนวทางยั่วยุในกามอารมณ์ ลามกอนาจาร
                    <p>สร้างความเดือดร้อนให้แก่ผู้อื่น สังคม ประเทศ ละเมิดลิขสิทธ์ของผู้อื่น</p>
                    <p>หรือสิ่งหนึ่งสิ่งใดก็แล้วแต่ในลักษณะเดียวกัน</p></label>
                <p>มีความผิดตามกฏหมาย <label className='font-bold'>ทีมงานจะระงับใช้ ID ของท่านโดยไม่มีการแจ้งให้ทราบล่วงหน้า</label></p>
                <hr /><br />
                <div className="flex justify-center">
                    <form onSubmit={handleSubmit} className="">
                        <div className="flex gap-2">
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">อีเมล :</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="displayname" className="block text-gray-700 text-sm font-bold mb-2">ชื่อที่แสดง :</label>
                                <input type="text" id="displayname" name="displayname" value={formData.displayname} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-bold mb-2">รหัสผ่านเก่า :</label>
                            <input type="password" id="oldPassword" name="oldPassword" value={formData.oldPassword} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="flex gap-2">
                            <div className="mb-4">
                                <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">รหัสผ่านใหม่ :</label>
                                <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-bold mb-2">ยืนยันรหัสผ่านใหม่ :</label>
                                <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="profilepicture" className="block text-gray-700 text-sm font-bold mb-2">รูปโปรไฟล์ URL :</label>
                            <input type="url" id="profilepicture" name="profilepicture" value={formData.profilepicture} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="flex justify-between">
                            <button type="button" onClick={handleClear} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">ล้างข้อมูลในฟอร์ม</button>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">บันทึกข้อมูล</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
