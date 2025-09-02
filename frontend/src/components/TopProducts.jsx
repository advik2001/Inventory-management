import React from 'react'
import './TopProducts.css'

const TopProducts = ({ sales }) => {

	// Function to group and find top 6 products by quantity sold
	const getTopProductsByQuantity = (topN = 6) => {
		// Group by productId
		const grouped = sales.reduce((acc, item) => {
			const pid = item.productId
			if (!acc[pid]) {
				acc[pid] = {
					name: item.name,
					productId: pid,
					productImage: item.productImage,
					category: item.category,
					price: item.price,
					totalQuantity: 0,
					totalAmount: 0,
					rating: 0,
				}
			}
			acc[pid].totalQuantity += item.quantity
			acc[pid].totalAmount += item.totalAmount
			acc[pid].rating += acc[pid].totalQuantity / 10

			return acc
		}, {})

		// Convert to array and sort by totalQuantity
		const products = Object.values(grouped).sort(
			(a, b) => b.totalQuantity - a.totalQuantity
		)

		// Return top N products
		return products.slice(0, topN)
	}

	const topProducts = getTopProductsByQuantity()

	return (
		<>
			<h3>Top Products</h3>

			<div className='top-products-content'>
				{topProducts.map((product, i) => (
					<div className='top-product' key={i}>
						<div className='product-details'>
							<p>{product.name}</p>
							{product.productImage ? (
								<img
									src={`${import.meta.env.VITE_API_URL}${product.productImage}`}
									alt='image'
									className='product-image'
								/>
							) : (
								<div className='product-image'></div>
							)}
						</div>
						<div className='product-rating'>
							{Array.from({ length: Math.min(product.rating, 10) }, (_, i) => (
								<div key={i} className='rating'></div>
							))}
						</div>
					</div>
				))}
			</div>
		</>
	)
}

export default TopProducts
