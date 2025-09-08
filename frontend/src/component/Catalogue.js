// Full cleaned-up and corrected version with Size block included
import { useEffect, useState, useRef  } from "react";
import { FaPlus,FaTrash } from 'react-icons/fa';
import Config from "../settings/config";
import Panel from "../Common/Panel";
import Input from "../Common/Input";
import Dropdown from "../Common/dropdown";
import Button from "../Common/button";
import { useConfig } from '../contexts/ConfigContext';
import { useApi } from "../contexts/ApiContext";
import { toast } from 'react-toastify';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const sizeOptions = ["18", "20", "22", "24", "26", "28", "30", "32", "34", "36"];

const Catalogue = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    category: '', series_code: '',
    design: '', fabric_type: '', remarks: ''
  });
  const [errors, setErrors] = useState({});
  const { postRequest } = useApi();
  const { Api: { BaseUrl, Endpoints } } = useConfig();
  const { id } = useParams();
  const location = useLocation();
  const isEditMode = location.pathname.includes('/edit');
  const [colorFields, setColorFields] = useState([]);
  const [sizeFields, setSizeFields] = useState([]);
  const navigate = useNavigate(); // React Router navigation hook
  const formRef = useRef();

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    setFormData(prev => ({
	...prev,
	[name]: type === 'file' ? Array.from(files) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verifyFormField()) return;
	const realFormData = buildCatalogueFormData(formData, colorFields, sizeFields, isEditMode);
    const requestApiUrl = isEditMode
	? `${BaseUrl}${Endpoints.Catalogue}/${id}`
	: `${BaseUrl}${Endpoints.Catalogue}`;
	console.log(requestApiUrl)
    try {
      const response = await postRequest(requestApiUrl, realFormData, {
        headers: { 'access-key': localStorage.getItem("authToken") }
      });
      if (response.data.status === 200) {
        const item = response.data.data;
        setFormData({
          type: item.type || '', category: item.category || '',
          series_code: item.series_code || '', color: item.color || '',
          design: item.design || '', fabric_type: item.fabric_type || '',
          image: null, remarks: item.remarks || ''
        });
        toast.success(`Successfully ${isEditMode ? 'Updated' : 'Created'} catalogue ${item.series_code}`, {
			onClose: () => {
				resetForm(); // Your form reset logic here
				navigate('/catalogue');
			},
			autoClose: 2000 // Optional: Adjust timing as needed
		});	
      }
    } catch (err) {
      toast.error(err?.data?.message || `Something went wrong while ${isEditMode ? 'updating' : 'creating'} the catalogue.`);
    }
  };

  	const resetForm = () => {
		if (formRef.current) {
			formRef.current.reset();
		}
 };

  const verifyFormField = () => {
	const newErrors = {};

	// Validate text fields
	['category', 'series_code', 'design', 'fabric_type'].forEach((key) => {
		if (!formData[key] || formData[key].trim() === '') {
		newErrors[key] = `${key.toUpperCase()} is required.`;
		}
	});

	// Validate color fields
	colorFields.forEach((field, index) => {
		if (!field.colourID || !field.colourID.trim())
		newErrors[`color-id-${index}`] = `Color ID ${index + 1} is required.`;
		if (!field.colourName || !field.colourName.trim())
		newErrors[`color-name-${index}`] = `Color Name ${index + 1} is required.`;
		if (!field.image)
		newErrors[`color-image-${index}`] = `Image ${index + 1} is required.`;
	});

	// Validate size fields
	sizeFields.forEach((field, index) => {
		if (!field.sizeType || field.sizeType.trim() === '') {
		newErrors[`size-type-${index}`] = `Size type ${index + 1} is required.`;
		}
		if (!field.sizePrice || isNaN(field.sizePrice)) {
		newErrors[`size-price-${index}`] = `Price ${index + 1} is empty or invalid.`;
		}
	});

	setErrors(newErrors);
	return Object.keys(newErrors).length === 0;
};

const buildCatalogueFormData = (formState, colorFields, sizeFields, isEditMode = false) => {
	const fd = new FormData();
	if (isEditMode) fd.append('_method', 'PUT');
	// Basic fields
	fd.append('category', formState.category);
	fd.append('series_code', formState.series_code);
	fd.append('design', formState.design);
	fd.append('fabric_type', formState.fabric_type);
	fd.append('remarks', formState.remarks || '');
	// Dynamic color fields
	colorFields.forEach((field, index) => {
		fd.append(`color[${index}][colourID]`, field.colourID.trim());
		fd.append(`color[${index}][colourName]`, field.colourName.trim());
		fd.append(`color[${index}][image]`, field.image);
	});

	// Dynamic size fields
	sizeFields.forEach((field, index) => {
		fd.append(`size[${index}][sizeType]`, field.sizeType.trim());
		fd.append(`size[${index}][sizePrice]`, field.sizePrice);
	});

	return fd;
};

  const handleAddMoreColorFields = () => {
    const sizeStock = {};
    sizeOptions.forEach(size => sizeStock[size] = "");
    setColorFields([...colorFields, { colourID: "", colourName: "", image: null, sizes: sizeStock }]);
  };

  const handleAddMoreSizeFields = () => {
    setSizeFields([...sizeFields, { sizeType: '', sizePrice: '' }]);
  };

  const handleSizeChange = (index, field, value) => {
    const updated = [...sizeFields];
    updated[index][field] = value;
    setSizeFields(updated);
  };

  const handleDynamicChange = (index, field, value) => {
    const updated = [...colorFields];
    updated[index][field] = value;
    setColorFields(updated);
  };

 const handleDeleteColorField = (index) => {
  const updated = [...colorFields];
  updated.splice(index, 1);
  setColorFields(updated); // ← this is the correct state to update
};

const handleDeleteSizeField = (index) => {
 const updated = [...sizeFields];
  updated.splice(index, 1);
  setSizeFields(updated); // ← this is the correct state to update
}

  useEffect(() => {
    if (!isEditMode) return;
    const getCatalogueList = async () => {
		const requestApiUrl = `${BaseUrl}${Endpoints.CatalogueListWithID}`;
		try {
			const response = await postRequest(requestApiUrl, { id }, {
				headers: { 'access-key': localStorage.getItem("authToken") }
			});
			if (response.data.status === 200) {
				const catalogueData = response.data.data;
				setFormData({
					category: catalogueData.category,
					series_code: catalogueData.series_code,
					design: catalogueData.design,
					fabric_type: catalogueData.fabric_type,
					remarks: catalogueData.remarks || ''
          		});

				// Populate colorFields
				setColorFields(catalogueData.items.map(item => ({
					colourID: item.colour,
					colourName: item.type,
					image: item.image_path
				})));

				// Populate sizeFields
				setSizeFields(catalogueData.sizes.map(size => ({
					sizeType: size.type,
					sizePrice: size.price
				})));
			} else {
				toast.warn("No records found.");
			}
		} catch (err) {
			toast.error("Failed to fetch catalogue details.");
		}
    };
    getCatalogueList();
  }, [isEditMode, id]);

  return (
    <Panel title={isEditMode ? "Edit Catalogue" : "Create Catalogue"}>
	  <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
	    <Input label="Category" name="category" value={formData.category} onChange={handleChange} />
	    {errors.category && <p className="text-red-500 text-sm px-[9rem] py-0 text-left">{errors.category}</p>}
	    <Input label="Series Code" name="series_code" value={formData.series_code} onChange={handleChange} />
	    {errors.series_code && <p className="text-red-500 text-sm px-[9rem] py-0 text-left">{errors.series_code}</p>}
	    <div className="mb-6">
		{/* Header Row: Label + Add Button */}
		<div className="flex items-center gap-4 mb-2">
		  <label className="block text-sm font-medium text-gray-700 pt-2 w-32">Sizes</label>
		  <Button type="button" icon={<FaPlus />} onClick={handleAddMoreSizeFields} className="!m-0">
		    Add More
		  </Button>
		</div>

		{/* Size Input Rows */}
		<div className="w-[34rem]">
		  {sizeFields.map((field, index) => (
		    <div key={index} className="grid items-start mb-2">
			<Input
			  label="Type"
			  value={field.sizeType}
			  onChange={(e) => handleSizeChange(index, 'sizeType', e.target.value)}
			  inputWidth="w-[150px]"               
			/>
			<Input
			  label="Price"
			  value={field.sizePrice}
			  onChange={(e) => handleSizeChange(index, 'sizePrice', e.target.value)}
			  inputWidth="w-[150px]" className = "px-[2rem] py-0"
			/>
			<div className="flex items-end px-[1rem] py-0">
			  <Button
			    type="button"
			    variant="danger"
			    icon={<FaTrash />}
			    onClick={() => handleDeleteSizeField(index)}
			  />
			</div>

			{/* Error messages */}
			<div className="col-span-3 flex gap-4 text-sm text-red-500 px-[10rem] py-0">
			  {errors[`size-type-${index}`] && <p>{errors[`size-type-${index}`]}</p>}
			  {errors[`size-price-${index}`] && <p>{errors[`size-price-${index}`]}</p>}
			</div>
		    </div>
		  ))}
		</div>
	    </div>

	  <div className="mb-4 flex items-center">
  			<label className="block text-sm font-medium text-gray-700 mr-4 pt-2 w-32">Colours</label>
  			<Button type="button" icon={<FaPlus />} onClick={handleAddMoreColorFields} className="!m-0">Add More</Button>
		</div>

		{colorFields.map((field, index) => (
		<div key={index} className="ml-[6.25rem] space-y-2"> {/* aligns under 'Add More' */}
			<div className="grid grid-cols-4 gap-4">
			<Input
				label="ID"
				value={field.colourID}
				onChange={(e) => handleDynamicChange(index, "colourID", e.target.value)}
				inputWidth="w-[130px]" className = "px-[2rem] py-0"
			/>
			<Input
				label="Name"
				value={field.colourName}
				onChange={(e) => handleDynamicChange(index, "colourName", e.target.value)}
				inputWidth="w-[130px]" className = "px-[2rem] py-0"
			/>
			<Input
				label="Image"
				type="file"
				accept="image/*"
				onChange={(e) => handleDynamicChange(index, "image", e.target.files[0])}
				inputWidth="w-[100px]"
			/>
			<div className="flex px-[10rem] py-0">
				<button
				type="button"
				onClick={() => handleDeleteColorField(index)}
				className="px-[1rem] py-[1rem] w-30 h-10 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
				>
				<FaTrash size={16} />
				</button>
			</div>
			</div>

			<div className="grid grid-cols-3 text-sm text-red-500">
			<p>{errors[`color-id-${index}`] || ''}</p>
			<p>{errors[`color-name-${index}`] || ''}</p>
			<p>{errors[`color-image-${index}`] || ''}</p>
			<p /> {/* empty to align with delete button */}
			</div>
		</div>
		))}

	    <Input label="Design" name="design" value={formData.design} onChange={handleChange}  />
	    {errors.design && <p className="text-red-500 text-sm px-[9rem] py-0 text-left">{errors.design}</p>}
	    <Input label="Fabric Type" name="fabric_type" value={formData.fabric_type} onChange={handleChange} />
	    {errors.fabric_type && <p className="text-red-500 text-sm px-[9rem] py-0 text-left">{errors.fabric_type}</p>}
	    <Input label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} multiline />
		<div className="flex justify-start px-[8rem] py-0">
			<Button type="submit">{isEditMode ? 'Edit' : 'Submit'}</Button>
		</div>
	  </form>
	</Panel>
  );
};

export default Catalogue;
