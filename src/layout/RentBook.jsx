import axios from "axios";
import { useEffect, useState } from "react";

export default function RentBook() {
    const [rentbook, setRentBook] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/rentbook", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRentBook(response.data);
            } catch (error) {
                console.error("Error fetching RentBook:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-500">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                <p>รูปภาพ</p>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <p>ชื่อหนังสือ</p>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <p>วันที่ยืม</p>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <p>ต้องส่งคืน</p>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <p>สถานะ</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody  >
                        {rentbook.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <p className="text-center italic">ไม่มีข้อมูลในรายการ</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rentbook.map(rentbook => (
                                <tr key={rentbook.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">
                                        <img src={rentbook.img} alt="image description" className="flex h-auto max-w-xs" width={70} />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <p className="flex">{rentbook.Title}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <p className="flex">{new Date(rentbook.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <p className="flex text-red-500 font-bold">{new Date(rentbook.Duedate).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <p className="flex text-red -500 font-bold">{rentbook.Status}</p>
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
