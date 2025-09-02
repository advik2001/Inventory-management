import { toast } from 'react-toastify';

export const handleSuccess = (msg) => {
  toast.success(msg, {
    position: 'top-right',
  });
}

export const handleError = (msg) => {
    console.log('Error Triggered:', msg); // Debugging log
  toast.error(msg, {
    position: 'top-right',
  });
}