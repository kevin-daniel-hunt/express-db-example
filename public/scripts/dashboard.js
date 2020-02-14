const form = document.getElementById('group-email-form');
const select = document.getElementById('group-email-select');
form.onsubmit = (e) => {
  form.action = `groups/${select.value}/users`;
}