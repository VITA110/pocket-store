// 1. Registro del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado con éxito:', registration.scope);
            })
            .catch(error => {
                console.log('Fallo en el registro del ServiceWorker:', error);
            });
    });
}

// 2. Consumo de API (Usando /users como si fueran vendedores o clientes del catálogo)
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(data => {
            const catalog = document.getElementById('catalog');
            catalog.innerHTML = ''; // Limpiamos el texto de "Cargando..."
            
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>📧 ${item.email}</p>
                    <p>🏢 ${item.company.name}</p>
                `;
                catalog.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            document.getElementById('catalog').innerHTML = '<p>Error al cargar el catálogo. Verifica tu conexión si es la primera vez que entras.</p>';
        });
});