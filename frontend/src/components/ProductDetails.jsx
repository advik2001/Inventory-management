import React from 'react'

const ProductDetails = ({
	selectedProductId,
	setShowProductDetails,
	products,
}) => {
	const selectedProduct = products.find(
		(prod) => prod.productId === selectedProductId
	)

	return (
		<div className='modal-overlay' onClick={() => setShowProductDetails(false)}>
			<div
				className='modal-content'
				onClick={(e) => e.stopPropagation()}
				style={{
					color: 'black',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
          gap: '1rem',
				}}
			>
				<h4>Product Details</h4>
				<div>
					<p>{selectedProduct.name}</p>
				</div>
				<div
					style={{
						color: 'black',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
            gap: '1rem',
					}}
				>
					<h4>Price</h4>
					<p>{selectedProduct.price}</p>
				</div>
				<div
					style={{
						color: 'black',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: '1rem',
					}}
				>
					<h4>Quantity</h4>
					<p>
						{selectedProduct.stock} {selectedProduct.unit}
					</p>
				</div>
				<div
					style={{
						color: 'black',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
            gap: '1rem',
					}}
				>
					<h4>Threshold Value</h4>
					<p>{selectedProduct.thresholdValue}</p>
				</div>
				<div
					style={{
						color: 'black',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
            gap: '1rem',
					}}
				>
					<h4>Expiry Date</h4>
					<p>
						{new Date(selectedProduct.expiryDate).toLocaleDateString('en-GB')}
					</p>
				</div>
			</div>
		</div>
	)
}

export default ProductDetails
