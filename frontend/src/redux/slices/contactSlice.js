import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Contact form submission
  isSubmitting: false,
  submitSuccess: false,
  submitError: null,
  
  // Admin contact management
  contacts: [],
  currentContact: null,
  contactStats: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalContacts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isLoading: false,
  error: null,
  
  // Filters
  filters: {
    status: '',
    priority: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    // Contact form submission
    submitContactStart: (state) => {
      state.isSubmitting = true;
      state.submitError = null;
      state.submitSuccess = false;
    },
    submitContactSuccess: (state, action) => {
      state.isSubmitting = false;
      state.submitSuccess = true;
      state.submitError = null;
    },
    submitContactFailure: (state, action) => {
      state.isSubmitting = false;
      state.submitError = action.payload;
      state.submitSuccess = false;
    },
    clearSubmitStatus: (state) => {
      state.submitSuccess = false;
      state.submitError = null;
    },

    // Admin contact management
    fetchContactsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchContactsSuccess: (state, action) => {
      state.isLoading = false;
      state.contacts = action.payload.contacts;
      state.pagination = action.payload.pagination;
    },
    fetchContactsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchContactByIdStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchContactByIdSuccess: (state, action) => {
      state.isLoading = false;
      state.currentContact = action.payload;
    },
    fetchContactByIdFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateContactStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateContactSuccess: (state, action) => {
      state.isLoading = false;
      state.currentContact = action.payload.contact;
      // Update contact in the list if it exists
      const index = state.contacts.findIndex(c => c._id === action.payload.contact._id);
      if (index !== -1) {
        state.contacts[index] = action.payload.contact;
      }
    },
    updateContactFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteContactStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteContactSuccess: (state, action) => {
      state.isLoading = false;
      state.contacts = state.contacts.filter(c => c._id !== action.payload);
      if (state.currentContact?._id === action.payload) {
        state.currentContact = null;
      }
    },
    deleteContactFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchContactStatsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchContactStatsSuccess: (state, action) => {
      state.isLoading = false;
      state.contactStats = action.payload;
    },
    fetchContactStatsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        status: '',
        priority: '',
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    },

    clearError: (state) => {
      state.error = null;
    },
    clearCurrentContact: (state) => {
      state.currentContact = null;
    },
  },
});

export const {
  submitContactStart,
  submitContactSuccess,
  submitContactFailure,
  clearSubmitStatus,
  fetchContactsStart,
  fetchContactsSuccess,
  fetchContactsFailure,
  fetchContactByIdStart,
  fetchContactByIdSuccess,
  fetchContactByIdFailure,
  updateContactStart,
  updateContactSuccess,
  updateContactFailure,
  deleteContactStart,
  deleteContactSuccess,
  deleteContactFailure,
  fetchContactStatsStart,
  fetchContactStatsSuccess,
  fetchContactStatsFailure,
  setFilters,
  resetFilters,
  clearError,
  clearCurrentContact,
} = contactSlice.actions;

export default contactSlice.reducer;