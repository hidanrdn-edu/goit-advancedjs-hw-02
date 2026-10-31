// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const delay = Number(form.elements.delay.value);
  const valueState = form.elements.state.value;

  console.log(`delay: ${delay}, valueState: ${valueState}`);

    const makePromise = ({ delay, valueState }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (valueState === 'fulfilled') {
          resolve(delay);
        } else {
          reject(delay);
        }
      }, delay);
    });
  };

  makePromise({ delay, valueState })
    .then(value =>
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled promise in ${value}ms`,
      })
    )
    .catch(error =>
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${error}ms`,
      })
    );

  form.reset();
}
