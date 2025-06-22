// assets/js/modules/localStorage-helpers.js
const TRAMITES_STORAGE_KEY = 'tramitesSubmissions';

export const getTramiteSubmissions = () => {
    try {
        const storedSubmissions = localStorage.getItem(TRAMITES_STORAGE_KEY);
        return storedSubmissions ? JSON.parse(storedSubmissions) : [];
    } catch (e) {
        console.error('Error leyendo submissions de localStorage:', e);
        return [];
    }
};

export const saveTramiteSubmission = (formData) => {
    try {
        const submissions = getTramiteSubmissions();
        submissions.push(formData);
        localStorage.setItem(TRAMITES_STORAGE_KEY, JSON.stringify(submissions));
        return true;
    } catch (e) {
        console.error('Error guardando en localStorage:', e);
        return false;
    }
};
