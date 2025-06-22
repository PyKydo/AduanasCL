// assets/js/modules/dom-utils.js
export const displayFieldError = (fieldElement, message) => {
    if (!fieldElement) return;
    fieldElement.classList.add('error');
    fieldElement.classList.remove('valid');
    const formGroup = fieldElement.closest('.form-group');
    if (formGroup) {
        const errorDiv = formGroup.querySelector('.error-message') || formGroup.querySelector('.validation-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }
};

export const clearFieldError = (fieldElement) => {
    if (!fieldElement) return;
    fieldElement.classList.remove('error');
    const formGroup = fieldElement.closest('.form-group');
    if (formGroup) {
        const errorDiv = formGroup.querySelector('.error-message') || formGroup.querySelector('.validation-message');
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
    }
};

export const markFieldAsValid = (fieldElement) => {
    if (!fieldElement) return;
    clearFieldError(fieldElement);
    fieldElement.classList.remove('error');
    fieldElement.classList.add('valid');
};
