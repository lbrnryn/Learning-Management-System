function home() {
  // Toast Notification
  const remove2s = document.querySelector('.remove2s');
  document.addEventListener("DOMContentLoaded", () => {
    // Remove toast notification after 2 seconds
    if (remove2s) {
      setTimeout(() => {
        remove2s.remove()
      }, 2000)
    }
  })
}


export {
  home
}
