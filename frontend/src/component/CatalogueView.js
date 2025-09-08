import React, {useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import { FaEdit,FaEye,FaPlus } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";  
import Table from '../Common/table';
import Button from "../Common/button";
import {useApi} from "../contexts/ApiContext";
import { useConfig } from '../contexts/ConfigContext';


function CatalogueListView() {
    const {postRequest} = useApi();
    const { Api: { BaseUrl, Endpoints }, type } = useConfig();
    const [catalogues, setCatalogues] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // React Router navigation hoo
    const columns = [
        // { header: 'Type', accessor: 'type' ,cell: (row) => {
        //   const match = type.find(t => t.id === parseInt(row.type, 10));
        //   return match ? match.label : '-';
        // }},
        { header: 'Category', accessor: 'category' },
        { header: 'Series Code', accessor: 'series_code' },
        { header: 'Design', accessor: 'design' },
        { header: 'Fabric Type', accessor: 'fabric_type' },
        {
          header: 'Actions',
          accessor: 'actions',
          cell: (row) => (
            <div className="flex space-x-2">
              <Button onClick={() => handleCatalogueView(row.id)}><FaEye /></Button>
              <Button onClick={() => handleCatolgueEdit(row.id)}><FaEdit /></Button>
            </div>
          )
        }
      ];
    useEffect(() => {
        const getCatalogueList = async() => {
            const requestApiUrl = `${BaseUrl}${Endpoints.CatalogueList}`;
            try {
                const response = await postRequest(requestApiUrl,null,{headers: { 
                'access-key': localStorage.getItem("authToken")
                }
                });
                console.log(response);
                if (response.data.status === 200) {
                    setCatalogues(response.data.data);
                } else {
                    setCatalogues('No records Found');
                }
            } catch (err) {
                if (err.data?.code === 401) {
                    toast.error("Something went wrong while fetching the catalogue list.");
                    setCatalogues([]);
                }
            } finally {
                setLoading(false);
            }
        }
        getCatalogueList();
    }, []);

    const createCatalogue = () => {
      navigate('/catalogue/create')
    }

    const handleCatolgueEdit = (id) => {
      navigate(`/catalogue/edit/${id}`);
    }

    const handleCatalogueView = (id) => {
      navigate(`/catalogue/preview/${id}`);
    }

    if (loading) return <div>Loading catalogues...</div>;

    return (
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight text-center" style={{ color: 'rgb(145 137 137)' }}> Catalogue List</h1>
        <Button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 flex items-center gap-2' onClick={() => createCatalogue()}><FaPlus />Create Catalogue</Button>
        <Table columns={columns} data={catalogues} />
      </div>
    );
  }
  
  export default CatalogueListView;