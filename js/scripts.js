/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Função de encolher da barra de navegação
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        const logo = document.getElementById('logo');
        if (!navbarCollapsible || !logo) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
            logo.src = 'assets/img/logos/logo2.png';
            logo.style.width = '170px';
            logo.style.height = '122.4px'; 
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
            logo.src = 'assets/img/logos/logo1.png';
            logo.style.width = '170px';
            logo.style.height = '122.4px'; 
        }

    };

    // Encolher a barra de navegação 
    navbarShrink();

    // Encolher a barra de navegação quando a página é scrolada
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
   // Redirecionando para agenda
   document.getElementById("submitButton").addEventListener("click", function() {
   window.open("https://calendly.com/rafaelkluge2010/reuniaofikc", "_blank");
});

});
