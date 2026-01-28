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

/**
 * Common button colors
 */
const CONFIRM_COLOR = '#14b8a6' // teal
const CANCEL_COLOR = '#6b7280'  // gray

// --------------------
// Basic alert
// --------------------
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
    confirmButtonColor: CONFIRM_COLOR,
  })
}

// --------------------
// Success alert
// --------------------
export const showSuccess = (title = 'Success', text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: CONFIRM_COLOR,
  })
}

// --------------------
// Error alert
// --------------------
export const showError = (title = 'Error', text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: CONFIRM_COLOR,
  })
}

// --------------------
// Warning alert
// --------------------
export const showWarning = (title = 'Warning', text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonText: 'OK',
    confirmButtonColor: CONFIRM_COLOR,
  })
}

// --------------------
// Confirmation dialog (Delete / Confirm)
// --------------------
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
    confirmButtonColor: CONFIRM_COLOR,
    cancelButtonColor: CANCEL_COLOR,
  })
}

// --------------------
// Toast notification
// --------------------
export const showToast = (
  title: string,
  icon: SweetAlertIcon = 'success'
) => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 3000,
    // timerProgressBar: true,
  })
}
