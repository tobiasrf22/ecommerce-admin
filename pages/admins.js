import Layout from '@/components/Layout'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Category } from '@/models/Categories';
import { withSwal } from 'react-sweetalert2';

const AdminPage = ({ swal }) => {

    function addAdmin(event) {
        event.preventDefault();
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to add these admin?`,
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Yes!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            
            // when confirmed and promise resolved...
        }).catch(error => {
            // when promise rejected...
        });
    }
    
    return (
        <Layout>
            <h1>Admins</h1>
            <label className='text-gray-500 font-bold'>
                Add new admin
            </label>
            <form>
                <div className='flex gap-1 mb-2'>
                    <input
                        className='mb-0 capitalize'
                        type='text'
                        placeholder={'google email'}
                        value=""
                    />
                    <button onClick={addAdmin} className='btn-primary capitalize'>add</button>
                </div>
            </form>

                <table className='basic mt-4'>
                <thead>
                    <tr>
                        <td>admin google email</td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                        <tr>
                            <td className='normal-case'>test4@example.com</td>
                            <td>2023-04-06 15:55:54</td>
                            <td>
                                <button className='btn-red'>Delete</button>
                            </td>
                        </tr>
                </tbody>
            </table>

            
        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <AdminPage swal={swal} />
))
