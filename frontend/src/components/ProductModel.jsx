import React from 'react'

const ProductModel = ({setShowModal, setShowAddProductModal, setShowCsvModal }) => {
	return (
		<div className='modal-overlay' onClick={() => setShowModal(false)}>
			<div className='modal-content' onClick={(e) => e.stopPropagation()}>
				<button
					className='modal-btn'
					onClick={() => {
						setShowAddProductModal(true)
						setShowModal(false)
					}}
				>
					Individual Product
				</button>
				<button
					className='modal-btn'
					onClick={() => {
						setShowCsvModal(true)
						setShowModal(false)
					}}
				>
					Multiple Product
				</button>
			</div>
		</div>
	)
}

export default ProductModel
