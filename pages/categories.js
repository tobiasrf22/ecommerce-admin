import Layout from '@/components/Layout'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Category } from '@/models/Categories';
import { withSwal } from 'react-sweetalert2';

const CategoriesPage = ({ swal }) => {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [properties, setProperties] = useState([]);
    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }

    async function saveCategorie(ev) {
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(','),
            }))
        };
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        } else {
            ev.preventDefault();
            await axios.post('/api/categories', data);
        }
        setName('');
        fetchCategories();
        setProperties([]);
        fetchCategories(); 

    }

    const editCategory = (category) => {
        setEditedCategory(category);
        
        setName(category.name);
        setParentCategory(category.parent?._id);
        console.log(category.properties);
        setProperties(category?.properties.map(({ name, values }) => ({
            name: name,
            values: values.join(',')
        })));
        
    }
    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                await axios.delete('/api/categories?_id=' + category._id);
                fetchCategories();
            }
            // when confirmed and promise resolved...
        }).catch(error => {
            // when promise rejected...
        });
    }

    const addProperty = () => {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }]
        });
    }

    const handlePropertyNameChange = (index, property, newName) => {
        setProperties(prev => {
            const props = [...prev];
            props[index].name = newName;
            return props;
        });
    }
    const handlePropertyValuesChange = (index, property, newValues) => {
        setProperties(prev => {
            const props = [...prev];
            props[index].values = newValues;
            return props;
        });
    }

    const removeProperty= (indexToRemove)=>{
        setProperties(prev=>{
            return  [...prev].filter((prop,propIndex)=>{
                return propIndex !== indexToRemove;
            })
            
        })
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label className='text-gray-500 font-bold'>
                {editedCategory ? `Edit category ${editedCategory.name}` : 'New category'}
            </label>
            <form onSubmit={saveCategorie}>
                <div className='flex gap-1 mb-2'>
                    <input
                        className='mb-0 capitalize'
                        type='text'
                        placeholder={'Category name'}
                        onChange={ev => setName(ev.target.value)}
                        value={name}
                    />
                    <select className='mb-0 capitalize'
                        onChange={ev => setParentCategory(ev.target.value)}
                        value={parentCategory}>
                        <option className='capitalize' value=''>No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option className='capitalize' value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className='mb-2 '>
                    <div className='mb-2'>
                        <label className='block'>Properties</label>
                        <button type='button' onClick={addProperty} className='btn-default text-sm'>Add new property</button>
                    </div>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className='flex gap-1 mb-2'>
                            <input
                                className='mb-0 '
                                type='text'
                                value={property.name}
                                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                placeholder='property name (example:color)'>
                            </input>
                            <input
                            className='mb-0'
                                type='text'
                                onChange={ev=>handlePropertyValuesChange(index,property	,ev.target.value)}
                                value={property.values}
                                placeholder='values, comma separated'>
                            </input>
                            <button 
                                typeof='button'
                                onClick={()=>removeProperty(index)} 
                                className='btn-red'>
                                    Remove
                            </button>
                        </div>
                    ))}

                </div>
                <div className='flex gap-1'>
                <button type='submit' className='btn-primary'>Save</button>
                {editedCategory&&(
                    <button type='button' 
                            onClick={()=>{
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                                }} 
                            className='btn-red py-1'>Cancel</button>
                )}
                </div>
            </form>
            {!editedCategory&&(
                <table className='basic mt-4'>
                <thead>
                    <tr>
                        <td>Category name</td>
                        <td>Parent category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td className='flex-row justify-center items-center'>
                                <button onClick={() => editCategory(category) }
                                    className='btn-default'
                                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteCategory(category)}
                                    className='btn-red'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                    Delete
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            )}
            
        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <CategoriesPage swal={swal} />
))

