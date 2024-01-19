import Layout from '@/components/Layout'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Category } from '@/models/Categories';
import { withSwal } from 'react-sweetalert2';

const SettingsPage = ({ swal }) => {

    return (
        <Layout>
            <h1>Settings</h1>
            <form>
                <div className='block gap-1 mb-2'>
                    <label className='text-gray-500 font-bold capitalize'>
                        featured product
                    </label>
                    <select
                        className='mb-0 capitalize'
                        type='text'
                        placeholder={'product'}
                        value="product"
                    >
                        <option>Nothing</option>
                        <option>Macbook</option>
                    </select>
                </div>
                <div className='block gap-1 mb-2'>
                    <label className='text-gray-500 font-bold capitalize'>
                        shipping price (usd)
                    </label>
                    <select
                        className='mb-0 capitalize'
                        type='text'
                        placeholder={'product'}
                        value="product"
                    >
                        <option>5</option>
                        <option>10</option>
                    </select>
                </div>
                <button className='btn-primary'>Save settings</button>
            </form>
        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <SettingsPage swal={swal} />
))
