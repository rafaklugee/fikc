const Handlebars = require('handlebars');

Handlebars.registerHelper('formatDate', function(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
});