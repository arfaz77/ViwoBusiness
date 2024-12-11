document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const toggleSidebarMobileHamburger = document.getElementById('hamburgerButton');
    const toggleSidebarMobileClose = document.getElementById('closeButton');
  
    const toggleSidebar = (): void => {
      if (sidebar && sidebarBackdrop) {
        sidebar.classList.toggle('hidden');
        sidebarBackdrop.classList.toggle('hidden');
      }
    };
  
    if (toggleSidebarMobileHamburger) {
      toggleSidebarMobileHamburger.addEventListener('click', toggleSidebar);
    }
  
    if (toggleSidebarMobileClose) {
      toggleSidebarMobileClose.addEventListener('click', toggleSidebar);
    }
  
    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', toggleSidebar);
    }
  });
  