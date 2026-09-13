import { create } from "zustand";

const useUiStore = create((set) => ({
  /*
   * Sidebar
   */
  isSidebarOpen: true,

  /*
   * Mobile sidebar
   */
  isMobileSidebarOpen: false,

  /*
   * Global loading
   */
  isGlobalLoading: false,

  /*
   * Toast / notification
   */
  notification: null,

  /*
   * Active modal
   */
  activeModal: null,

  /*
   * Sidebar actions
   */
  toggleSidebar: () => {
    set((state) => ({
      isSidebarOpen:
        !state.isSidebarOpen,
    }));
  },

  openSidebar: () => {
    set({
      isSidebarOpen: true,
    });
  },

  closeSidebar: () => {
    set({
      isSidebarOpen: false,
    });
  },

  /*
   * Mobile sidebar
   */
  openMobileSidebar: () => {
    set({
      isMobileSidebarOpen: true,
    });
  },

  closeMobileSidebar: () => {
    set({
      isMobileSidebarOpen: false,
    });
  },

  toggleMobileSidebar: () => {
    set((state) => ({
      isMobileSidebarOpen:
        !state.isMobileSidebarOpen,
    }));
  },

  /*
   * Global loading
   */
  setGlobalLoading: (value) => {
    set({
      isGlobalLoading: value,
    });
  },

  /*
   * Notification
   */
  showNotification: ({
    type = "info",
    message,
    duration = 3000,
  }) => {
    set({
      notification: {
        type,
        message,
      },
    });

    if (duration > 0) {
      setTimeout(() => {
        set({
          notification: null,
        });
      }, duration);
    }
  },

  clearNotification: () => {
    set({
      notification: null,
    });
  },

  /*
   * Modal
   */
  openModal: (modalName) => {
    set({
      activeModal: modalName,
    });
  },

  closeModal: () => {
    set({
      activeModal: null,
    });
  },
}));

export default useUiStore;