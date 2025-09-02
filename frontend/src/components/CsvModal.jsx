import React, {useState} from 'react'
import axios from "axios";
import './CsvModal.css'

const CsvModal = ({setShowCsvModal, onRefresh}) => {


  const [csvFile, setCsvFile] = useState(null)
	const [dragActive, setDragActive] = useState(false)
	const [fileName, setFileName] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleCSVUpload = async () => {
		if (!csvFile) return
		setUploading(true)

		const formData = new FormData()
		formData.append('file', csvFile)

		try {
			await axios.post(
				`${import.meta.env.VITE_API_URL}/api/products/upload`,
				formData
			)
			setCsvFile(null)
			setShowCsvModal(false)

			if(onRefresh){
				onRefresh()
			}
		} catch (err) {
			console.error('Upload failed:', err)
		} finally {
			setUploading(false)
		}
	}

	const handleDrag = (e) => {
		e.preventDefault()
		e.stopPropagation()
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true)
		} else if (e.type === 'dragleave') {
			setDragActive(false)
		}
	}

	const handleDrop = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0]
			if (file.name.endsWith('.csv')) {
				setFileName(file.name)
				setCsvFile(file)
			}
		}
	}

	const handleBrowse = (e) => {
		e.stopPropagation()
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			if (file.name.endsWith('.csv')) {
				setFileName(file.name)
				setCsvFile(file)
			}
		}
	}

	return (
		<div className='csv-overlay' onClick={() => setShowCsvModal(false)}>
			<div className='csv' onClick={(e) => e.stopPropagation()}>

        {/* Modal Header */}
				<div className='csv-header'>
					<div className='csv-title'>
						<h3>CSV Upload</h3>
						<p className='subtext'>Add your documents here</p>
					</div>
					<button className='close-btn' onClick={() => setShowCsvModal(false)}>
						&times;
					</button>
				</div>

				{/* Modal Drop Box */}
        <div
					// className={`csv-drop-box`}
					className={`csv-drop-box ${dragActive ? 'active' : ''}`}
					onDragEnter={handleDrag}
					onDragLeave={handleDrag}
					onDragOver={handleDrag}
					onDrop={handleDrop}
				>
          <img src="/assets/upload.svg" alt="upload" className="upload-icon" />

					<p className='instruction'>Drag your file(s) to start uploading</p>
					<p className='or-text'>OR</p>

					<label className='browse-btn'>
						Browse files
						<input
							type='file'
							accept='.csv'
							onChange={(e) => handleBrowse(e)}
							style={{ display: 'none' }}
						/>
					</label>

					{fileName && (
						<div className='csv-file-preview'>
							<span>{fileName}</span>
						</div>
					)}
				</div>

				{/* Modal Buttons */}
        <div className='csv-actions'>
					<button
						className='csv-cancel-btn'
						onClick={() => setShowCsvModal(false)}
					>
						Cancel
					</button>
					<button
						className='csv-primary-btn'
						disabled={uploading}
						onClick={handleCSVUpload}
					>
						{uploading ? 'Uploading...' : 'Next →'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default CsvModal
