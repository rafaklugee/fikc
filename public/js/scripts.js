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
      if (window.innerWidth > 576) {
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
            logo.src = '../assets/img/logos/logo1.png';
	    logo.style.width = '210px';
            logo.style.height = '110px'; 
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
            logo.src = '../assets/img/logos/logo2.png';
	    logo.style.width = '210px';
            logo.style.height = '110px';
        }
      } else {
	  logo.src = '../assets/img/logos/logo1.png';
          logo.style.width = '210px';
          logo.style.height = '110px';
	} 
    };

    // Encolher a barra de navegação 
    navbarShrink();

    // Encolher a barra de navegação quando a página é scrolada
    document.addEventListener('scroll', navbarShrink);

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const submitButton = document.getElementById('submitButton');
    const status = document.getElementById('status');

    function validateForm() {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        
        // Verificar se todos os campos foram preenchidos
        if (name && email && phone) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    // Adicionar ouvintes de eventos para inputs
    nameInput.addEventListener('input', validateForm);
    emailInput.addEventListener('input', validateForm);
    phoneInput.addEventListener('input', validateForm);

    // Inicializar botão de enviar como desabilitado
    submitButton.disabled = true;
    
    // Enviar formulário para e-mail
    var form = document.getElementById("contactForm");
  
    async function handleSubmit(event) {
    event.preventDefault();
    var data = new FormData(event.target);
    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
          'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        status.innerHTML = "Obrigado por enviar!";
        form.reset();
	validateForm();
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
          } else {
            status.innerHTML = "Oops! Houve um problema ao enviar seu formulário!"
          }
        });
      }
    }).catch(error => {
      status.innerHTML = "Oops! Houve um problema ao enviar seu formulário!"
    });
  }
  form.addEventListener("submit", handleSubmit)


   // Redirecionando para agenda em nova aba
   //document.getElementById("submitButton").addEventListener("click", function() {
   //window.open("https://calendly.com/fikcsecretarias/reuniaovirtual", "_blank");
//});

   // Redirecionando para agenda em pop-up
       document.getElementById("submitButton").addEventListener("click", function() {
           // Inicializa o widget de pop-up do Calendly
           Calendly.initPopupWidget({url: 'https://calendly.com/fikcsolutions'});
       });

});