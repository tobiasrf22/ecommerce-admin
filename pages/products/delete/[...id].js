import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeleteProductPage = () => {
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();
    const { id } = router.query;
    const goBack = () => {
        router.push('/products');
    }
    const deleteProduct = () => {
        axios.delete(`/api/products?id=${id}`).then(response => {
            setProductInfo(response.data);
            goBack();
        }).catch(error => {
            console.error('Error fetching product data:', error);
        });
    }

    useEffect(() => {

        if (!id) return;

        axios.get(`/api/products?id=${id}`).then(response => {
            setProductInfo(response.data);
        }).catch(error => {
            console.error('Error fetching product data:', error);
        });
    }, [router.query]);


    return (
        <Layout >
            <h1 className="text-center">Do you really want to delete the product &nbsp;{productInfo?.title}</h1> {/*ERR: No muestra el titulo*/}
            <div className='flex gap-2 justify-center'>
                <button className='btn-red' onClick={deleteProduct}>Yes</button>
                <button className='btn-default' onClick={goBack}>No</button>
            </div>
        </Layout>
    );
}

export default DeleteProductPage;

