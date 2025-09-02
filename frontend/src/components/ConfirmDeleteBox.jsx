import React from 'react'
import axios from 'axios'
import './ConfirmDeleteBox.css'
import { handleError, handleSuccess } from '../utils'

const ConfirmDeleteBox = ({ pos, setDeleteModal, selectedInvoiceId, onRefresh }) => {

	const handleDelete = async () => {

		const jwtToken = localStorage.getItem('token')

		try {
			const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/invoices/${selectedInvoiceId}/delete`, { headers: {
          Authorization: `${jwtToken}`
        }})

			handleSuccess(response.data.message)
			setDeleteModal(false)

			// refresh page
			if (onRefresh) {
        onRefresh()
      }

		}catch(error){
			console.log(error.message)
			handleError(error.message)
		}
	}

	return (
		<div
			className='delete-box'
			style={{
				position: 'absolute',
				left: `${pos.x - 500}px`,
				top: `${pos.y - 100}px`,
			}}
		>
			<span>this invoice will be deleted</span>
			<div className='modal-buttons'>
				<button className='btn-cancel' onClick={() => setDeleteModal(false)}>
					Cancel
				</button>
				<button className='btn-confirm' onClick={handleDelete}>Confirm</button>
			</div>
		</div>
	)
}

export default ConfirmDeleteBox
