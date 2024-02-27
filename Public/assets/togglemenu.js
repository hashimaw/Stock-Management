
    var menuButton = document.querySelector('#menuButton');
    var menu = document.querySelector('#menu');

    menuButton.addEventListener('click', function() {
      menu.classList.toggle('hidden');
    });

    window.addEventListener('click', function(event) {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
        menu.classList.add('hidden');
      }
    });