import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Product.css'
import AddProductForm from './AddProductForm'
import CsvModal from '../../components/CsvModal'
import SalesModal from '../../components/SalesModal'
import ProductModel from '../../components/ProductModel'
import { useSearch } from '../../context/SearchContext'
import { handleError } from '../../utils'
import ProductOverview from './ProductOverview'
import ProductDetails from '../../components/ProductDetails'

const Product = () => {
	const [products, setProducts] = useState([])
	const [selectedProductId, setSelectedProductId] = useState('')
	const { searchQuery } = useSearch()
	const [mobile, setMobile] = useState(window.innerWidth <= 768)

	// Modal States
	const [showModal, setShowModal] = useState(false)
	const [showAddProductModal, setShowAddProductModal] = useState(false)
	const [showSalesModal, setShowSalesModal] = useState(false)
	const [showCsvModal, setShowCsvModal] = useState(false)
	const [showProductDetails, setShowProductDetails] = useState(false)

	// Pagination states
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 9
	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage

	const fetchProducts = async () => {
		const jwtToken = localStorage.getItem('token')
		try {
			const res = await axios.get(
				`${import.meta.env.VITE_API_URL}/api/products`,
				{
					headers: {
						Authorization: `${jwtToken}`,
					},
				}
			)
			setProducts(res.data)
		} catch (err) {
			handleError(err.message || 'Error fetching products')
		}
	}

	// search functionality
	const filteredProducts = products.filter((p) => {
		const query = searchQuery.toLowerCase()
		return p.name?.toLowerCase().includes(query)
	})

	useEffect(() => {
		fetchProducts()
	}, [])

	const getAvailability = (p) => {
		if (p.expired === true) {
			return 'Expired'
		}
		if (p.stock > p.thresholdValue) {
			return 'In Stock'
		} else if (p.stock === 0) {
			return 'Out of Stock'
		} else if (p.stock <= p.thresholdValue) {
			return 'Low Stock'
		}
	}

	const handleSalesModal = (productId) => {
		setShowSalesModal(true)
		setSelectedProductId(productId)
	}

	const currentProducts = filteredProducts.slice(
		indexOfFirstItem,
		indexOfLastItem
	)
	const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

	if (mobile) {
		return (
			<div className='product-mobile'>

				{/* Product Overview  */}
				{!showAddProductModal && (
					<ProductOverview
						products={products}
						showAddProductModal={showAddProductModal}
						getAvailability={getAvailability}
					/>
				)}

				{/* product Table  */}
				{!showAddProductModal && <div className='mobile-product-table '>
					<h3>Products</h3>
					<div className={`product-table ${showAddProductModal ? 'none' : ''}`}>
						<div className='products-container'>
							{/* Header Row */}
							<div className='grid-table header'>
								<div className='header-item'>Products</div>
								<div className='header-item'>Availability</div>
							</div>

							{/* Data Rows */}
							{products.map((p, i) => (
								<div
									key={i}
									className='grid-table row'
									onClick={() => handleSalesModal(p.productId)}
								>
									<div className='table-item'>{p.name}</div>
									<div
									onClick={() => setShowProductDetails(true)}
										className={`table-item status ${getAvailability(p)
											.replace(/\s/g, '')
											.toLowerCase()}`}
									>
										{getAvailability(p)}
										<img src="/assets/info.svg" alt="" style={{marginLeft: '1rem'}} />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>}
				

				{/* Add Product button  */}
				<div className='mobile-btn' onClick={() => setShowModal(true)}>
					Add Product
				</div>

				{/* Add Product Modal */}
				{showModal && (
					<ProductModel
						setShowModal={setShowModal}
						setShowAddProductModal={setShowAddProductModal}
						setShowCsvModal={setShowCsvModal}
					/>
				)}

				{/* Sales Modal */}
				{showSalesModal && (
					<SalesModal
						setShowSalesModal={setShowSalesModal}
						selectedProductId={selectedProductId}
						onRefresh={fetchProducts}
					/>
				)}

				{/* Add Product Form */}
				{showAddProductModal && (
					<AddProductForm
						setShowAddProductModal={setShowAddProductModal}
						onRefresh={fetchProducts}
					/>
				)}

				{/* CSV Uploader Modal */}
				{showCsvModal && (
					<CsvModal
						setShowCsvModal={setShowCsvModal}
						onRefresh={fetchProducts}
					/>
				)}

				{/* Product Details Modal */}
				{showProductDetails && (
					<ProductDetails selectedProductId={selectedProductId} setShowProductDetails={setShowProductDetails} products={products}  />
				)}


			</div>
		)
	}

	return (
		<div className='product-page'>
			{/* Product Overview */}
			<ProductOverview
				products={products}
				showAddProductModal={showAddProductModal}
				getAvailability={getAvailability}
			/>

			<div className={`product-table ${showAddProductModal ? 'none' : ''}`}>
				<div className='products-container'>
					<div className='products-header'>
						<h2>Products</h2>
						<button className='add-btn' onClick={() => setShowModal(true)}>
							Add Product
						</button>
					</div>

					{/* Header Row */}
					<div className='grid-table header'>
						<div className='header-item'>Products</div>
						<div className='header-item'>Price</div>
						<div className='header-item'>Quantity</div>
						<div className='header-item'>Threshold Value</div>
						<div className='header-item'>Expiry Date</div>
						<div className='header-item'>Availability</div>
					</div>

					{/* Data Rows */}
					{currentProducts.map((p, i) => (
						<div
							key={i}
							className='grid-table row'
							onClick={() => handleSalesModal(p.productId)}
						>
							<div className='table-item'>{p.name}</div>
							<div className='table-item'>₹{p.price}</div>
							<div className='table-item'>
								{p.stock} {p.unit}
							</div>
							<div className='table-item'>
								{p.thresholdValue} {p.unit}
							</div>
							<div className='table-item'>
								{new Date(p.expiryDate).toLocaleDateString('en-GB')}
							</div>
							<div
								className={`table-item status ${getAvailability(p)
									.replace(/\s/g, '')
									.toLowerCase()}`}
							>
								{getAvailability(p)}
							</div>
						</div>
					))}

					{/* Footer */}
					<div className='table-footer'>
						<button
							className='page-btn'
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
						>
							Previous
						</button>
						<span>
							Page {currentPage} of {totalPages}
						</span>
						<button
							className='page-btn'
							onClick={() =>
								setCurrentPage((prev) => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages}
						>
							Next
						</button>
					</div>
				</div>
			</div>

			{/* Add Product Modal */}
			{showModal && (
				<ProductModel
					setShowModal={setShowModal}
					setShowAddProductModal={setShowAddProductModal}
					setShowCsvModal={setShowCsvModal}
				/>
			)}

			{/* Sales Modal */}
			{showSalesModal && (
				<SalesModal
					setShowSalesModal={setShowSalesModal}
					selectedProductId={selectedProductId}
					onRefresh={fetchProducts}
				/>
			)}

			{/* Add Product Form */}
			{showAddProductModal && (
				<AddProductForm
					setShowAddProductModal={setShowAddProductModal}
					onRefresh={fetchProducts}
				/>
			)}

			{/* CSV Uploader Modal */}
			{showCsvModal && (
				<CsvModal setShowCsvModal={setShowCsvModal} onRefresh={fetchProducts} />
			)}
		</div>
	)
}

export default Product
