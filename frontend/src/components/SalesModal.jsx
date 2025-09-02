import React,{useState} from 'react'
import axios from 'axios'
import { handleError, handleSuccess } from '../utils';

const SalesModal = ({setShowSalesModal, selectedProductId, onRefresh}) => {

  const [quantity, setQuantity ] = useState('')

  const handleOrder = async() => {

    const productId = selectedProductId;
    const jwtToken = localStorage.getItem('token')

    try{
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/sales`, {
        productId,
        quantity,
      }, {headers: {
          Authorization: `${jwtToken}`
        }});

      handleSuccess("Order placed successfully!")
      setShowSalesModal(false)

      if(onRefresh){
        onRefresh()
      }

    }catch(error){

      console.error("Error placing order:", error.response?.data || error.message);
      handleError(error.response?.data?.message);
    }
  }

	return (
		<div className='modal-overlay' onClick={() => setShowSalesModal(false)}>
			<div className='modal-content' onClick={(e) => e.stopPropagation()}>
      <h3>Sales Modal</h3>
				<input
					type='number'
          name='sale'
          value={quantity}
          onChange = {(e) => setQuantity(e.target.value)}
          placeholder='Enter Product quantity'
          className='sales-input'
				/>
				<button
					className='modal-btn'
          style={{width: '30%'}}
					onClick={handleOrder}
				>
					Order
				</button>
			</div>
		</div>
	)
}

export default SalesModal
