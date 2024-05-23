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
    
// Calendário

// Após o envio do formulário
document.getElementById('submitButton').addEventListener('click', function() {
    // Aqui você pode adicionar a lógica para enviar os dados do formulário
    // Exemplo de envio do formulário:
    
    // enviarFormulario();

    // Agora, exiba o modal com o calendário
    exibirModalCalendario();
});
    // Função para exibir a tabela de horários em outro modal
    function exibirTabelaHorarios(dataSelecionada) {
    // Fechando o modal do calendário quando o modal de horário é aberto
    const modalCalendario = document.getElementById('modal');
    modalCalendario.style.display = 'none';

    // Lista de botões com horas de 8h às 17h
    let tabelaHTML = '<div class="modal-content">';
    tabelaHTML += '<span class="close">&times;</span>'; // Adicionando o ícone "x" para fechar
    tabelaHTML += '<div id="tabelaHorarios">';
    for (let i = 8; i <= 17; i++) {
    	tabelaHTML += '<button class="horario-btn">' + i + ':00</button>'; // Um botão para cada hora
    }
     
    // Exiba a tabela de horários dentro do modal de horários
    const modalHorarios = document.getElementById('modalHorarios');
    modalHorarios.getElementsByClassName('modal-content')[0].innerHTML = tabelaHTML;

    // Exiba o modal de horários completo
    modalHorarios.style.display = 'block';
    
    // Botão de fechar do modal de horários completo
    const closeButton = modalHorarios.querySelector('.close');
    closeButton.addEventListener('click', fecharModalHorarios);
}

    // Função para fechar o modal de horários
    function fecharModalHorarios() {
    const modalHorarios = document.getElementById('modalHorarios');
    modalHorarios.style.display = 'none';
    }

    // Fechar o modal de horários quando o botão de fechar é clicado
    document.getElementById('modalHorarios').getElementsByClassName('close')[0].addEventListener('click', function() {
    fecharModalHorarios();
});

    // Abrindo o modal de horários quando o usuário clica em um dia no calendário
    document.getElementById('modal').getElementsByClassName('modal-content')[0].addEventListener('click', function() {
    // Verificando se o elemento clicado é um botão de horário
    if (event.target.classList.contains('horario-btn')) {
    
        // Aqui eu posso adicionar a lógica para lidar com o clique em um botão de horário
        // Por exemplo, posso chamar uma função para agendar o horário selecionado
        console.log('Horário selecionado:', event.target.textContent);
        
        // Fechando o modal de horários
        fecharModalHorarios();
    }
});

    // Função para fechar o modal do calendário
    function fecharModalCalendario() {
    const modalCalendario = document.getElementById('modal');
    modalCalendario.style.display = 'none';
}

    // Função para exibir o modal com o calendário
    function exibirModalCalendario() {
    // Selecionando o modal do calendário
    const modal = document.getElementById('modal');

    // Exibindo o modal do calendário
    modal.style.display = 'block';

    // Selecionando o elemento onde o calendário será renderizado
    const calendarioContainer = document.getElementById('calendario');

    // Inicializando o FullCalendar no contêiner
    const calendar = new FullCalendar.Calendar(calendarioContainer, {
        // Aqui, é para adicionar as opções necessárias para o calendário
        locale: 'pt-br',
        // Capturando o clique em um dia
        dateClick: function(info) {
            // Quando o usuário clicar em um dia, chama a função para exibir a tabela de horários
            exibirTabelaHorarios(info.date);
        }
    });

    // Renderizando o calendário
    calendar.render();
}

    // Função para o usuário clicar no "x" do modal de horários
document.getElementById('modalHorarios').getElementsByClassName('close')[0].addEventListener('click', function() {
    // Fechando o modal de horários
    fecharModalHorarios();
});

    // Função para o usuário clicar no "x" do modal do calendário
document.getElementById('modal').getElementsByClassName('close')[0].addEventListener('click', function() {
    // Fechando o modal do calendário
    fecharModalCalendario();
});

});
