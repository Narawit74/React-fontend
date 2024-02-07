import axios from "axios";
import { useEffect, useState } from "react";

export default function UserHome() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/todos", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTodos(response.data);
            } catch (error) {
                console.error("Error fetching todos:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mx-auto mt-10">
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-100 text-gray-800">รูปภาพ</th>
                            <th className="px-6 py-3 bg-gray-100 text-gray-800">ชื่อหนังสือ</th>
                            <th className="px-6 py-3 bg-gray-100 text-gray-800">วันที่ยืม</th>
                            <th className="px-6 py-3 bg-gray-100 text-gray-800">ส่งคืน</th>
                            <th className="px-6 py-3 bg-gray-100 text-gray-800">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todos.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center italic">ไม่มีข้อมูลในรายการ</td>
                            </tr>
                        ) : (
                            todos.map(todo => (
                                <tr key={todo.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={todo.img} alt="Todo Image" className="h-10 w-10 rounded-full" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{todo.Title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(todo.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-red-500">{new Date(todo.Duedate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{todo.Status}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}