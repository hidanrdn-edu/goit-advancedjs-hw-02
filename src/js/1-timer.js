import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('button[data-start]');
let userSelectedDate;
const selectDate = document.querySelector('#datetime-picker');
const dateSet = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    const now = new Date();

    if (selectedDates.length === 0) {
      startBtn.disabled = true;
      iziToast.warning({
        title: 'Caution',
        message: 'You forgot to enter a date',
      });
    } else if (selectedDates[0] > now) {
      userSelectedDate = selectedDates[0];
      startBtn.disabled = false;
    } else {
      startBtn.disabled = true;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    }
  },
};

flatpickr(selectDate, options);

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  selectDate.disabled = true;

  let intervalId;
  function updateTimer() {
    const remainingTime = userSelectedDate.getTime() - Date.now();

    if (remainingTime <= 0) {
      clearInterval(intervalId);

      for (const element of Object.values(dateSet)) {
        element.textContent = '00';
      }

      selectDate.disabled = false;
      return;
    }

    const time = convertMs(remainingTime);

    for (const [key, element] of Object.entries(dateSet)) {
      element.textContent = pad(time[key]);
    }
  }

  updateTimer();

  intervalId = setInterval(updateTimer, 1000);
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
