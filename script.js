document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('satisfactionForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const starRatings = document.querySelectorAll('.star-rating');
    const mostLikedTextarea = document.getElementById('mostLiked');

    // Inicializar y manejar las calificaciones de estrellas
    starRatings.forEach(starRating => {
        const stars = starRating.querySelectorAll('i');
        const hiddenInput = starRating.nextElementSibling; // El input hidden es el siguiente hermano

        // Función para aplicar el estilo de estrellas basado en un valor
        const applyStarRating = (value) => {
            stars.forEach(star => {
                if (parseInt(star.dataset.value) <= value) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
            hiddenInput.value = value;
        };

        // Evento click en cada estrella
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = parseInt(star.dataset.value);
                applyStarRating(value);
            });

            // Efecto hover (opcional, para visualización antes del click)
            star.addEventListener('mouseover', () => {
                const value = parseInt(star.dataset.value);
                stars.forEach(s => {
                    if (parseInt(s.dataset.value) <= value) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });

            star.addEventListener('mouseout', () => {
                const currentValue = hiddenInput.value ? parseInt(hiddenInput.value) : 0;
                applyStarRating(currentValue); // Vuelve al valor seleccionado si lo hay
            });
        });

        // Asegurarse de que las estrellas se inicialicen correctamente si ya hay un valor (ej. si se recarga la página con valores guardados)
        if (hiddenInput.value) {
            applyStarRating(parseInt(hiddenInput.value));
        }
    });

    // Validar el formulario antes de enviar
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Previene el envío por defecto

        let isValid = true;

        // Validar todas las preguntas con estrellas
        starRatings.forEach(starRating => {
            const hiddenInput = starRating.nextElementSibling;
            if (hiddenInput.type === 'hidden' && hiddenInput.hasAttribute('required') && !hiddenInput.value) {
                isValid = false;
                starRating.style.borderColor = 'var(--error-color)'; // Resaltar el contenedor de estrellas
                starRating.classList.add('invalid');
            } else {
                starRating.style.borderColor = '';
                starRating.classList.remove('invalid');
            }
        });

        // Validar el campo de texto "más gustó" (mínimo 50 caracteres)
        if (mostLikedTextarea.hasAttribute('minlength') && mostLikedTextarea.value.length < parseInt(mostLikedTextarea.getAttribute('minlength'))) {
            isValid = false;
            mostLikedTextarea.classList.add('invalid');
            // Podrías añadir un mensaje de error específico si lo deseas
            if (!mostLikedTextarea.nextElementSibling || !mostLikedTextarea.nextElementSibling.classList.contains('error-message')) {
                const errorMessage = document.createElement('span');
                errorMessage.classList.add('error-message');
                errorMessage.textContent = `Por favor, ingresa al menos ${mostLikedTextarea.getAttribute('minlength')} caracteres.`;
                mostLikedTextarea.parentNode.insertBefore(errorMessage, mostLikedTextarea.nextSibling);
            }
        } else {
            mostLikedTextarea.classList.remove('invalid');
            // Eliminar mensaje de error si existe
            const existingError = mostLikedTextarea.nextElementSibling;
            if (existingError && existingError.classList.contains('error-message')) {
                existingError.remove();
            }
        }

        // Validar campos select requeridos
        form.querySelectorAll('select[required]').forEach(select => {
            if (!select.value) {
                isValid = false;
                select.classList.add('invalid');
            } else {
                select.classList.remove('invalid');
            }
        });

        // Validar otros campos de texto requeridos (si los hubiera)
        form.querySelectorAll('input[type="text"][required], textarea[required]:not(#mostLiked)').forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });

        // Manejar los campos "Otra (especifica)"
        form.querySelectorAll('.other-option input[type="checkbox"]').forEach(checkbox => {
            const inlineInput = checkbox.nextElementSibling;
            if (checkbox.checked && inlineInput && inlineInput.value.trim() === '') {
                isValid = false;
                inlineInput.classList.add('invalid');
            } else if (inlineInput) {
                inlineInput.classList.remove('invalid');
            }
        });

        if (isValid) {
            // Si el formulario es válido, recopilar los datos (simulación)
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                // Manejar checkboxes que pueden tener múltiples valores
                if (data[key]) {
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            }

            console.log('Datos de la encuesta:', data);

            // Simular el envío del formulario y mostrar mensaje de agradecimiento
            form.style.display = 'none';
            thankYouMessage.style.display = 'block';

            // Opcional: Podrías enviar 'data' a un servidor aquí usando fetch() o XMLHttpRequest
            // fetch('/api/submit-survey', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data),
            // })
            // .then(response => response.json())
            // .then(result => console.log('Éxito:', result))
            // .catch(error => console.error('Error:', error));

        } else {
            alert('Por favor, completa todos los campos requeridos y asegúrate de que el comentario positivo tenga al menos 50 caracteres.');
        }
    });

    // Listener para eliminar el estado de inválido cuando se corrige un campo
    form.addEventListener('input', (event) => {
        if (event.target.classList.contains('invalid')) {
            event.target.classList.remove('invalid');
            // Si es un campo de texto con mensaje de error específico, eliminarlo
            if (event.target === mostLikedTextarea) {
                const existingError = mostLikedTextarea.nextElementSibling;
                if (existingError && existingError.classList.contains('error-message')) {
                    existingError.remove();
                }
            }
        }
    });

    // Opcional: Resetear formulario al hacer clic en el enlace de volver a la página principal
    const backHomeLink = document.querySelector('.back-home-link');
    if (backHomeLink) {
        backHomeLink.addEventListener('click', (e) => {
            e.preventDefault();
            form.reset(); // Reinicia el formulario
            thankYouMessage.style.display = 'none';
            form.style.display = 'block';
            // Resetear las estrellas visualmente
            starRatings.forEach(starRating => {
                const hiddenInput = starRating.nextElementSibling;
                hiddenInput.value = ''; // Limpiar el valor oculto
                starRating.querySelectorAll('i').forEach(star => {
                    star.classList.remove('fas');
                    star.classList.add('far');
                });
            });
            // Remover todas las clases 'invalid' y mensajes de error
            form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
            form.querySelectorAll('.error-message').forEach(el => el.remove());
        });
    }

});