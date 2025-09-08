import Card from "../Common/card";
import Button from "../Common/button";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";  
const AdminHome = () => {
    
    const navigate = useNavigate(); // React Router navigation hoo
    const createNewOrder = () => {
        navigate('/catalogue');
    }
    return (
        <div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Orders" value="1,250" />
                <Card title="Products" value="320" />
                <Card title="Revenue" value="$12,480" />
                <Card title="Customers" value="980" />
            </div>
            <div className="px-6 py-4">
                <h2 className="text-xl font-semibold mb-4">Latest Orders</h2>
                <div className="bg-white p-4 rounded shadow">
                <p>No recent orders yet.</p>
                <Button icon = {<FaPlus/>} onClick={() => createNewOrder()}>Create New Orders</Button>
            </div>
        </div>
    </div>
    )
};

export default AdminHome;