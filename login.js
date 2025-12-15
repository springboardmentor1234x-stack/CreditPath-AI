// login.js
//const API = "http://127.0.0.1:8000";
const API = "https://credit-path-ai-5i5a.onrender.com";


document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById('btnLogin');
  const btnRegOpen = document.getElementById('btnRegOpen');
  const btnRegister = document.getElementById('btnRegister');

  if(btnLogin) btnLogin.addEventListener('click', onLogin);
  if(btnRegOpen) btnRegOpen.addEventListener('click', toggleReg);
  if(btnRegister) btnRegister.addEventListener('click', onRegister);

  // If already logged in -> go to index
  if(localStorage.getItem('cpai_token')){
    window.location.href = 'index.html';
  }
});

function toggleReg(){
  const area = document.getElementById('regArea');
  if(area.style.display === 'none' || !area.style.display) area.style.display = 'block';
  else area.style.display = 'none';
}

async function onLogin(){
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  if(!email || !password){ alert('Enter email and password'); return; }
  try{
    const res = await fetch(`${API}/login/`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const j = await res.json();
    if(res.ok && j.ok){
      localStorage.setItem('cpai_token', j.token || '');
      localStorage.setItem('cpai_name', j.name || '');
      window.location.href = 'index.html';
    } else {
      alert(j.detail || 'Login failed');
    }
  }catch(e){
    alert('Backend unreachable');
  }
}

async function onRegister(){
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  if(!name || !email || !password){ alert('Please fill all'); return; }
  try {
    const res = await fetch(`${API}/register/`, {
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, password })
    });
    const j = await res.json();
    if(res.ok && j.ok){
      alert('Registered successfully. Please login.');
      toggleReg();
    } else {
      alert(j.detail || 'Registration failed');
    }
  }catch(e){
    alert('Backend unreachable');
  }
}


