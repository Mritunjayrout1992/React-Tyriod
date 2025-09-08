import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';
import { useApi } from "../contexts/ApiContext";

const CataloguePreview = () => {
  const { id } = useParams();
  const { getRequest } = useApi();
  const { Api: { BaseUrl, Endpoints } } = useConfig();
  const { postRequest } = useApi();

  const [catalogue, setCatalogue] = useState(null);
  const [loading, setLoading] = useState(true);

  const colorStyleMap = {
    BLACK: { border: 'border-black', text: 'text-black' },
    BUTTER: { border: 'border-yellow-300', text: 'text-yellow-800' },
    SKY: { border: 'border-sky-300', text: 'text-sky-700' },
    'LT. PEACH': { border: 'border-orange-300', text: 'text-orange-800' },
    YELLOW: { border: 'border-yellow-400', text: 'text-yellow-800' },
    LIME: { border: 'border-lime-400', text: 'text-lime-800' },
    WHITE: { border: 'border-gray-300', text: 'text-gray-700' },
};

  useEffect(() => {
    const fetchCatalogue = async () => {
      try {
       const requestApiUrl = `${BaseUrl}${Endpoints.CatalogueListWithID}`;
       const response = await postRequest(requestApiUrl, { id }, {
				headers: { 'access-key': localStorage.getItem("authToken") }
			});
        if (response.data.status === 200) {
			const catalogueData = response.data.data;
			setCatalogue(catalogueData);
        }
      } catch (err) {
        console.error('Failed to fetch catalogue:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogue();
  }, [id, getRequest, BaseUrl, Endpoints]);

  if (loading) return <div>Loading...</div>;
  if (!catalogue) return <div>No catalogue data found.</div>;

    
const HeaderSection = ({ catalogue }) => (
  <div className="border-b-2 pb-6 mb-6">
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-6">
        <h2 className="text-4xl font-bold tracking-wide leading-relaxed mb-2">
          {catalogue.category}
        </h2>
        <h3 className="text-2xl text-gray-900 uppercase tracking-wider leading-loose mb-6">
          {catalogue.series_code} Series
        </h3>
      </div>
      <div className="col-span-12 md:col-span-6 flex flex-wrap gap-4">
        {catalogue.sizes.map((sz, index) => (
          <div key={index} className="w-44 border-2 border-black p-4 text-center bg-white shadow-sm">
            <div className="text-sm font-semibold uppercase mb-1">SIZE {index + 1}</div>
            <div className="text-sm mb-2">{sz.type}</div>
            <div className="bg-black text-white py-1 text-sm font-bold">₹{sz.price}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ImageSection = ({ items }) => {
  const colorStyleMap = {
    BLACK: { border: 'border-black', text: 'text-black' },
    BUTTER: { border: 'border-yellow-300', text: 'text-yellow-800' },
    SKY: { border: 'border-sky-300', text: 'text-sky-700' },
    'LT. PEACH': { border: 'border-orange-300', text: 'text-orange-800' },
    YELLOW: { border: 'border-yellow-400', text: 'text-yellow-800' },
    LIME: { border: 'border-lime-400', text: 'text-lime-800' },
    WHITE: { border: 'border-gray-300', text: 'text-gray-700' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item, idx) => {
        const { border, text } = colorStyleMap[item.type?.toUpperCase()] || {
          border: 'border-gray-400',
          text: 'text-gray-700',
        };

        return (
          <div key={idx} className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex flex-col items-right w-full md:w-1/4 pt-[5%]">
              <div className={`w-40 h-28 rounded-t-3xl border-4 ${border} bg-[rgba(206,206,206,0.32)] flex flex-col justify-center items-center`}>
                <div className={`text-xl font-bold ${text}`}>{item.colour}</div>
                <div className={`text-sm ${text}`}>{item.type}</div>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src={item.image_url}
                alt={item.name}
                className="max-w-xs rounded-md shadow-md border border-gray-200"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FooterSection = ({ catalogue }) => (
  <div className="w-full bg-[#f4d3b5] rounded-t-[50px] px-6 py-10 mt-10 overflow-hidden">


    {/* Content grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black mt-8">
      <div className="space-y-2 text-left pl-4">
        <div className="text-xl font-bold uppercase tracking-wide">{catalogue.design}</div>
        <div className="text-base font-semibold uppercase">{catalogue.fabric_type}</div>
      </div>
      <div className="flex items-end justify-end pr-4">
        <div className="bg-[rgba(232,168,168,0.74)] text-black font-bold text-sm px-4 py-2 rounded-full inline-block">
          {catalogue.remarks}
        </div>
      </div>
    </div>
  </div>
);

return (
<div className="catalogue-preview relative flex flex-col justify-between min-h-[90vh] border-2 border-gray-300 rounded-2xl p-6 mx-4 my-6 shadow-md bg-white">
        <HeaderSection catalogue={catalogue} />
        <ImageSection items={catalogue.items} />
        <FooterSection catalogue={catalogue} />
    </div>
  );
};

export default CataloguePreview;
