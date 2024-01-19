import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images,
    category: existingCategory,
    properties: assignedProperties
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [image, setImages] = useState(images || '');
    const [category, setCategory] = useState(existingCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || null);
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    const [categories, setCategories] = useState([]);

    const goBack = () => {
        router.push('/products');
    }

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, []);

    async function saveProduct(event) {
        try {
            event.preventDefault();
            const data = {
                title, description, price, category,
                properties: productProperties
            };
            if (_id) {
                await axios.put('/api/products', { ...data, _id });  // Corregir la ruta aquí
                setGoToProducts(true);
            } else {
                await axios.post('/api/products', data);
                setGoToProducts(true);
            }
        } catch (error) {
            console.error('Error creating/editing product:', error);
        }
    }
    if (goToProducts) {
        router.push('/products');
    }
    async function uploadImages(ev) {
        /*const files = ev.target?.files;
        if (files && files.length > 0) {
            const data = new FormData();
            for (const file of files) {
                data.append('files', file); // Asegúrate de que la clave sea 'files'
            }
    
            try {
                const response = await axios.post('/api/upload', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
    
                console.log('Images uploaded successfully:', response.data);
            } catch (error) {
                console.error('Error uploading images:', error);
            }
        }*/
        const files = ev.target?.files;
        if (files && files.length > 0) {
            const data = new FormData();

            for (const file of files) {
                data.append('files', file);
            }

            try {
                const response = await axios.post('/api/upload', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log(response);

                // Verifica si la respuesta es un array y tiene al menos un elemento
                if (Array.isArray(response) && response.length > 0) {
                    const pathImages = response.map(image => image.path);
                    setImages(pathImages);
                } else {
                    console.error('Invalid response format:', response);
                }
            } catch (error) {
                console.error('Error uploading images:', error);
            }


        }

    }

    const propertiesToFill = [];
    if (category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        if (catInfo && catInfo.properties) {
            propertiesToFill.push(...catInfo.properties);
        }
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
            if (parentCat) {
                propertiesToFill.push(...parentCat.properties);
                catInfo = parentCat;
            } else {
                break;  // Exit the loop if parentCat is undefined
            }
        }


    }

    const setProductProp = (propName, value) => {
        setProductProperties(prev => {
            const newProductProp = { ...prev };
            newProductProp[propName] = value;
            return newProductProp;
        })
    }

    return (

        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input className="capitalize" type="text" placeholder="product name" value={title} onChange={ev => setTitle(ev.target.value)}></input>
            <label>Category</label>
            <select className="capitalize" value={category}
                onChange={ev => setCategory(ev.target.value)}>
                <option value="">Uncategorized</option>
                {
                    categories.length > 0 && categories.map(categorie => (
                        <option value={categorie._id}>{categorie.name}</option>
                    ))
                }
            </select>
            {categories && propertiesToFill.map(p => (
                <div className="flex gap-1">
                    <div>{p.name}</div>
                    <select value={productProperties?.[p]} onChange={ev => setProductProp(p.name, ev.target.value)}>

                        {p.values.map(v => (
                            <option value={v}>{v}</option>
                        ))}
                    </select>
                </div>
            ))}
            <label className="capitalize">
                Photos
            </label>
            <div>
                <label className="w-24 h-24 border flex text-sm gap-1 text-gray-500 rounded-lg items-center justify-center cursor-pointer">
                    {images && images.length > 0 && images.map(image => (
                        <img key={image} src={image} alt="Product Image" />
                    ))}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                    </svg>
                    <div>Upload</div>
                    <input type="file" className="hidden" onChange={uploadImages}></input>
                </label>
                {!images?.lenght && (
                    <div className="mb-2">No photos in this product</div>
                )}
            </div>
            <label className="capitalize">description</label>
            <textarea className="capitalize" placeholder="description" value={description} onChange={ev => setDescription(ev.target.value)}></textarea>
            <label className="capitalize">price (USD)</label>
            <input className="capitalize" type="text" placeholder="price" value={price} onChange={ev => setPrice(ev.target.value)}></input>
            <div className="flex">
                <button type="submit" className="btn-primary">Save</button>
                <button type="submit" className="btn-red ml-2" onClick={goBack}>Cancel</button>
            </div>

        </form>

    )
}