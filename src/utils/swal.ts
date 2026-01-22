import Swal, { SweetAlertIcon } from 'sweetalert2'

interface AlertOptions {
  title?: string
  text?: string
  html?: string
  icon?: SweetAlertIcon
  confirmButtonText?: string
  cancelButtonText?: string
  showCancelButton?: boolean
}
// show alert
export const showAlert = ({
  title = 'Alert',
  text,
  html,
  icon = 'info',
  confirmButtonText = 'OK',
}: AlertOptions) => {
  return Swal.fire({
    title,
    text,
    html,
    icon,
    confirmButtonText,
  })
}

//Success alert

export const showSuccess = (title = 'Success', text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonText: 'OK',
  })
}

// Error alert

export const showError = (title = 'Error', text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'OK',
  })
}

//Warning alert

export const showWarning = (title = 'Warning', text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonText: 'OK',
  })
}

// Confirmation dialog

export const showConfirm = ({
  title = 'Are you sure?',
  text = 'You won’t be able to revert this!',
  confirmButtonText = 'Yes',
  cancelButtonText = 'Cancel',
}: AlertOptions) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  })
}

// Toast notification

export const showToast = (title: string, icon: SweetAlertIcon = 'success') => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 3000,
  })
}
