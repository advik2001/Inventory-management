// import React, { useState } from 'react'
// import axios from 'axios'
// import { handleError, handleSuccess } from '../../utils'

// const AddProductForm = ({ setShowAddProductModal, onRefresh }) => {
// 	const [name, setName] = useState('')
// 	const [productId, setProductId] = useState('')
// 	const [category, setCategory] = useState('')
// 	const [price, setPrice] = useState('')
// 	const [stock, setStock] = useState('')
// 	const [unit, setUnit] = useState('')
// 	const [expiryDate, setExpiryDate] = useState('')
// 	const [thresholdValue, setThresholdValue] = useState('')
// 	const [imageUrl, setImageUrl] = useState('')

// 	const handleAddProduct = async (e) => {
// 		e.preventDefault()

// 		if (!name.trim()) {
// 			handleError('Product name is required')
// 			return
// 		}
// 		if (!productId.trim()) {
// 			handleError('Product ID is required')
// 			return
// 		}
// 		if (!category.trim()) {
// 			handleError('Category is required')
// 			return
// 		}
// 		if (!price || isNaN(price) || Number(price) <= 0) {
// 			handleError('Valid price is required')
// 			return
// 		}
// 		if (!stock || isNaN(stock) || Number(stock) < 0) {
// 			handleError('Stock must be 0 or greater')
// 			return
// 		}
// 		if (
// 			!thresholdValue ||
// 			isNaN(thresholdValue) ||
// 			Number(thresholdValue) < 0
// 		) {
// 			handleError('Threshold value must be 0 or greater')
// 			return
// 		}
// 		try {

// 			const productData = {
// 				name,
// 				productId,
// 				category,
// 				price: Number(price), // ensure number
// 				stock: Number(stock), // backend expects a number
// 				unit,
// 				expiryDate,
// 				thresholdValue: Number(thresholdValue),
// 				imageUrl,
// 			}

// 			const jwtToken = localStorage.getItem('token')

// 			const response = await axios.post(
// 				`${import.meta.env.VITE_API_URL}/api/products`,
// 				productData,
// 				{
// 					headers: {
// 						Authorization: `${jwtToken}`
// 					},
// 				}
// 			)

// 			handleSuccess('Product added successfully')

// 			// reset form
// 			setName('')
// 			setProductId('')
// 			setCategory('')
// 			setPrice('')
// 			setStock('')
// 			setUnit('')
// 			setExpiryDate('')
// 			setThresholdValue('')
// 			setImageUrl('')

// 			setShowAddProductModal(false)

// 			if (onRefresh) {
// 				onRefresh()
// 			}
// 		} catch (error) {
// 			if (error.response.data.message) {
// 				handleError(error.response.data.message)
// 			}
// 			console.error('Error adding product:', error)
// 		}
// 	}

// 	const handleFileChange = (e) => {
// 		const file = e.target.files[0]
// 		if (file && file.type.startsWith('image/')) {
// 			setImageUrl(URL.createObjectURL(file))
// 		} else {
// 			alert('Only image files are allowed!')
// 		}
// 	}

// 	const handleDrop = (e) => {
// 		e.preventDefault()
// 		const file = e.dataTransfer.files[0]
// 		if (file && file.type.startsWith('image/')) {
// 			setImageUrl(URL.createObjectURL(file))
// 		} else {
// 			alert('Only image files are allowed!')
// 		}
// 	}

// 	const handleDragOver = (e) => {
// 		e.preventDefault()
// 	}

// 	return (
// 		<div className='add-product-container'>
// 			<h4>
// 				Add Product <span>&gt;</span> Individual Product
// 			</h4>
// 			<div className='add-product'>
// 				<h3>New Product</h3>

// 				{/* <div className='img-box'>
// 					<div className='rectangle' />

// 					<span
// 						style={{
// 							position: 'absolute',
// 							width: 110,
// 							height: 20,
// 							left: 101,
// 							top: 14,
// 							fontFamily: 'Inter, sans-serif',
// 							fontStyle: 'normal',
// 							fontWeight: 400,
// 							fontSize: 14,
// 							lineHeight: '20px',
// 							color: '#858D9D',
// 						}}
// 					>
// 						Drag image here
// 					</span>

// 					<span
// 						style={{
// 							position: 'absolute',
// 							width: 14,
// 							height: 20,
// 							left: 149,
// 							top: 35,
// 							fontFamily: 'Inter, sans-serif',
// 							fontStyle: 'normal',
// 							fontWeight: 400,
// 							fontSize: 14,
// 							lineHeight: '20px',
// 							color: '#858D9D',
// 						}}
// 					>
// 						or
// 					</span>

// 					<span
// 						style={{
// 							position: 'absolute',
// 							width: 94,
// 							height: 20,
// 							left: 109,
// 							top: 57,
// 							fontFamily: 'Inter, sans-serif',
// 							fontStyle: 'normal',
// 							fontWeight: 400,
// 							fontSize: 14,
// 							lineHeight: '20px',
// 							color: '#448DF2',
// 							cursor: 'pointer',
// 							textDecoration: 'underline',
// 						}}
// 					>
// 						Browse image
// 					</span>
// 				</div>  */}
// 				<div
// 					className='img-box'
// 					onDrop={handleDrop}
// 					onDragOver={handleDragOver}
// 					style={{
// 						position: 'relative',
// 						width: 300,
// 						height: 150,
// 						border: '2px dashed #448DF2',
// 						borderRadius: '8px',
// 						display: 'flex',
// 						alignItems: 'center',
// 						justifyContent: 'center',
// 						flexDirection: 'column',
// 						cursor: 'pointer',
// 					}}
// 				>
// 					{imageUrl ? (
// 						<img
// 							src={imageUrl}
// 							alt='Uploaded preview'
// 							style={{
// 								maxWidth: '100%',
// 								maxHeight: '100%',
// 								borderRadius: '8px',
// 							}}
// 						/>
// 					) : (
// 						<>
// 							{/* Drag image here */}
// 							<span
// 								style={{
// 									fontFamily: 'Inter, sans-serif',
// 									fontSize: 14,
// 									color: '#858D9D',
// 									marginBottom: '6px',
// 								}}
// 							>
// 								Drag image here
// 							</span>
// 							{/* or */}
// 							<span
// 								style={{
// 									fontFamily: 'Inter, sans-serif',
// 									fontSize: 14,
// 									color: '#858D9D',
// 								}}
// 							>
// 								or
// 							</span>
// 							{/* Browse image */}
// 							<label
// 								style={{
// 									fontFamily: 'Inter, sans-serif',
// 									fontSize: 14,
// 									color: '#448DF2',
// 									cursor: 'pointer',
// 									textDecoration: 'underline',
// 									marginTop: '6px',
// 								}}
// 							>
// 								Browse image
// 								<input
// 									type='file'
// 									accept='image/*'
// 									onChange={handleFileChange}
// 									style={{ display: 'none' }}
// 								/>
// 							</label>
// 						</>
// 					)}
// 				</div>

// 				<form className='product-form' onSubmit={handleAddProduct}>
// 					<div className='form-field'>
// 						<label>Product Name</label>
// 						<input
// 							type='text'
// 							name='name'
// 							value={name}
// 							onChange={(e) => setName(e.target.value)}
// 							placeholder='Enter product name'
// 						/>
// 					</div>
// 					<div className='form-field'>
// 						<label>Product ID</label>
// 						<input
// 							type='text'
// 							name='productID'
// 							value={productId}
// 							onChange={(e) => setProductId(e.target.value)}
// 							placeholder='Enter product ID'
// 						/>
// 					</div>
// 					<div className='form-field'>
// 						<label>Category</label>
// 						<input
// 							type='text'
// 							name='category'
// 							value={category}
// 							onChange={(e) => setCategory(e.target.value)}
// 							placeholder='Enter product category'
// 						/>
// 					</div>
// 					<div className='form-field'>
// 						<label>Price</label>
// 						<input
// 							type='text'
// 							name='price'
// 							value={price}
// 							onChange={(e) => setPrice(e.target.value)}
// 							placeholder='Enter price'
// 						/>
// 					</div>
// 					<div className='form-field'>
// 						<label>Quantity</label>
// 						<input
// 							type='text'
// 							name='stock'
// 							value={stock}
// 							onChange={(e) => setStock(e.target.value)}
// 							placeholder='Enter product quantity'
// 						/>
// 					</div>
// 					<div className='form-field'>
// 						<label>Unit</label>
// 						<input
// 							type='text'
// 							name='Unit'
// 							value={unit}
// 							onChange={(e) => setUnit(e.target.value)}
// 							placeholder='Enter unit'
// 						/>
// 					</div>
// 					<div className='form-field'>
// 						<label>Expiry Date</label>
// 						<input
// 							type='date'
// 							name='Expiry-date'
// 							value={expiryDate}
// 							onChange={(e) => setExpiryDate(e.target.value)}
// 							placeholder='Enter expiry date'
// 						/>
// 					</div>
// 					<div className='form-field'>
// 						<label>Threshold Value</label>
// 						<input
// 							type='text'
// 							name='Threshold-value'
// 							value={thresholdValue}
// 							onChange={(e) => setThresholdValue(e.target.value)}
// 							placeholder='Enter threshold value'
// 						/>
// 					</div>
// 					<button
// 						className='discard-btn'
// 						onClick={() => setShowAddProductModal(false)}
// 					>
// 						Discard
// 					</button>
// 					<button className='add-product-btn' type='submit'>
// 						Add Product
// 					</button>
// 				</form>
// 			</div>
// 		</div>
// 	)
// }

// export default AddProductForm

import React, { useState } from 'react'
import axios from 'axios'
import { handleError, handleSuccess } from '../../utils'

const AddProductForm = ({ setShowAddProductModal, onRefresh }) => {
	const [name, setName] = useState('')
	const [productId, setProductId] = useState('')
	const [category, setCategory] = useState('')
	const [price, setPrice] = useState('')
	const [stock, setStock] = useState('')
	const [unit, setUnit] = useState('')
	const [expiryDate, setExpiryDate] = useState('')
	const [thresholdValue, setThresholdValue] = useState('')
	const [preview, setPreview] = useState(null) // 👈 for UI preview
	const [imageFile, setImageFile] = useState(null) // 👈 actual file

	const handleAddProduct = async (e) => {
		e.preventDefault()

		if (!name.trim()) return handleError('Product name is required')
		if (!productId.trim()) return handleError('Product ID is required')
		if (!category.trim()) return handleError('Category is required')
		if (!price || isNaN(price) || Number(price) <= 0)
			return handleError('Valid price is required')
		if (!stock || isNaN(stock) || Number(stock) < 0)
			return handleError('Stock must be 0 or greater')
		if (!thresholdValue || isNaN(thresholdValue) || Number(thresholdValue) < 0)
			return handleError('Threshold value must be 0 or greater')

		try {
			// 👇 create FormData instead of JSON
			const formData = new FormData()
			formData.append('name', name)
			formData.append('productId', productId)
			formData.append('category', category)
			formData.append('price', Number(price))
			formData.append('stock', Number(stock))
			formData.append('unit', unit)
			formData.append('expiryDate', expiryDate)
			formData.append('thresholdValue', Number(thresholdValue))
			if (imageFile) formData.append('image', imageFile) // 👈 must match backend key

			const jwtToken = localStorage.getItem('token')

			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/products`,
				formData,
				{
					headers: {
						Authorization: `${jwtToken}`,
						'Content-Type': 'multipart/form-data', // 👈 important
					},
				}
			)

			handleSuccess('Product added successfully')

			// reset form
			setName('')
			setProductId('')
			setCategory('')
			setPrice('')
			setStock('')
			setUnit('')
			setExpiryDate('')
			setThresholdValue('')
			setPreview(null)
			setImageFile(null)

			setShowAddProductModal(false)
			if (onRefresh) onRefresh()
		} catch (error) {
			if (error.response?.data?.message) {
				handleError(error.response.data.message)
			}
			console.error('Error adding product:', error)
		}
	}

	const handleFileChange = (e) => {
		const file = e.target.files[0]
		if (file && file.type.startsWith('image/')) {
			setPreview(URL.createObjectURL(file)) // for showing preview
			setImageFile(file) // actual file to send
		} else {
			alert('Only image files are allowed!')
		}
	}

	const handleDrop = (e) => {
		e.preventDefault()
		const file = e.dataTransfer.files[0]
		if (file && file.type.startsWith('image/')) {
			setPreview(URL.createObjectURL(file))
			setImageFile(file)
		} else {
			alert('Only image files are allowed!')
		}
	}

	const handleDragOver = (e) => e.preventDefault()

	return (
		<div className='add-product-container'>
			<h4>
				Add Product <span>&gt;</span> Individual Product
			</h4>
			<div className='add-product'>
				<h3>New Product</h3>

				{/* Image uploader */}
				<div
					className='img-box'
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					style={{
						position: 'relative',
						width: 300,
						height: 150,
						border: '2px dashed #448DF2',
						borderRadius: '8px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						cursor: 'pointer',
					}}
				>
					{preview ? (
						<img
							src={preview}
							alt='Uploaded preview'
							style={{
								maxWidth: '100%',
								maxHeight: '100%',
								borderRadius: '8px',
							}}
						/>
					) : (
						<>
							<span
								style={{ fontSize: 14, color: '#858D9D', marginBottom: '6px' }}
							>
								Drag image here
							</span>
							<span style={{ fontSize: 14, color: '#858D9D' }}>or</span>
							<label
								style={{
									fontSize: 14,
									color: '#448DF2',
									cursor: 'pointer',
									textDecoration: 'underline',
									marginTop: '6px',
								}}
							>
								Browse image
								<input
									type='file'
									accept='image/*'
									onChange={handleFileChange}
									style={{ display: 'none' }}
								/>
							</label>
						</>
					)}
				</div>

				{/* Product form */}
				<form className='product-form' onSubmit={handleAddProduct}>
					<div className='form-field'>
						<label>Product Name</label>
						<input
							type='text'
							name='name'
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder='Enter product name'
						/>
					</div>
					<div className='form-field'>
						<label>Product ID</label>
						<input
							type='text'
							name='productID'
							value={productId}
							onChange={(e) => setProductId(e.target.value)}
							placeholder='Enter product ID'
						/>
					</div>
					<div className='form-field'>
						<label>Category</label>
						<input
							type='text'
							name='category'
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							placeholder='Enter product category'
						/>
					</div>
					<div className='form-field'>
						<label>Price</label>
						<input
							type='text'
							name='price'
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							placeholder='Enter price'
						/>
					</div>
					<div className='form-field'>
						<label>Quantity</label>
						<input
							type='text'
							name='stock'
							value={stock}
							onChange={(e) => setStock(e.target.value)}
							placeholder='Enter product quantity'
						/>
					</div>
					<div className='form-field'>
						<label>Unit</label>
						<input
							type='text'
							name='Unit'
							value={unit}
							onChange={(e) => setUnit(e.target.value)}
							placeholder='Enter unit'
						/>
					</div>
					<div className='form-field'>
						<label>Expiry Date</label>
						<input
							type='date'
							name='Expiry-date'
							value={expiryDate}
							onChange={(e) => setExpiryDate(e.target.value)}
							placeholder='Enter expiry date'
						/>
					</div>
					<div className='form-field'>
						<label>Threshold Value</label>
						<input
							type='text'
							name='Threshold-value'
							value={thresholdValue}
							onChange={(e) => setThresholdValue(e.target.value)}
							placeholder='Enter threshold value'
						/>
					</div>
					<button
						className='discard-btn'
						onClick={() => setShowAddProductModal(false)}
					>
						Discard
					</button>
					<button className='add-product-btn' type='submit'>
						Add Product
					</button>
				</form>
			</div>
		</div>
	)
}

export default AddProductForm
