"use strict";
var _a, _b, _c;
async function Registrar() {
    const name = document.getElementById('name').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const user = document.getElementById('user').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    if (!name || !lastName || !email || !user || !password || !role) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    const userData = { name, lastName, email, user, role };
    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.assign(Object.assign({}, userData), { password })),
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Usuario creado:', jsonResponse);
            localStorage.setItem('userData', JSON.stringify(userData));
            alert('Usuario registrado exitosamente.');
            window.location.href = 'blog-inicio-sesion.html';
        }
        else {
            const errorResponse = await response.json();
            console.error('Error al registrar el usuario:', errorResponse);
            alert('Error al registrar el usuario.');
        }
    }
    catch (error) {
        console.error('Error de red:', error);
        alert('Error de red al registrar el usuario.');
    }
}
async function Login() {
    const user = document.getElementById('LoginUser').value;
    const password = document.getElementById('LoginPassword').value;
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, password }),
        });
        if (response.ok) {
            const data = await response.json();
            if (data.isBanned) {
                alert('Tu cuenta está baneada, no puedes iniciar sesión.');
                return;
            }
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            alert('Inicio de sesión exitoso');
            window.location.href = 'blog-user.html';
        }
        else {
            const error = await response.json();
            alert('Error: ' + error.message);
        }
    }
    catch (error) {
        console.error('Error al iniciar sesión:', error);
    }
}
async function cargarInformacionUsuario() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No estás autenticado");
        window.location.href = "blog-inicio-sesion.html";
        return;
    }
    try {
        const response = await fetch("http://localhost:3000/users/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const user = await response.json();
            const nameElement = document.getElementById("user-name");
            const lastNameElement = document.getElementById("user-lastname");
            const emailElement = document.getElementById("user-email");
            const roleElement = document.getElementById("user-role");
            const adminSection = document.getElementById("admin-section");
            if (nameElement)
                nameElement.textContent = user.name;
            if (lastNameElement)
                lastNameElement.textContent = user.lastName;
            if (emailElement)
                emailElement.textContent = user.email;
            if (roleElement)
                roleElement.textContent = user.role;
            if (user.role === "admin" && adminSection) {
                adminSection.style.display = "block";
            }
        }
        else {
            console.error("Error al cargar los datos del usuario");
            alert("Error al cargar los datos del usuario");
        }
    }
    catch (error) {
        console.error("Error de red:", error);
        alert("Hubo un error al cargar los datos del usuario.");
    }
}
window.addEventListener("load", cargarInformacionUsuario);
(_a = document.getElementById('edit-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const user = document.getElementById('edit-user').value;
    const password = document.getElementById('edit-password').value;
    if (!token) {
        alert('No estás autenticado');
        return;
    }
    const data = { user, password };
    try {
        const response = await fetch('http://localhost:3000/users/me', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            alert('Datos actualizados correctamente');
            window.location.reload();
        }
        else {
            const error = await response.json();
            alert('Error al actualizar los datos: ' + error.message);
        }
    }
    catch (error) {
        console.error('Error de red:', error);
        alert('Hubo un error al actualizar los datos.');
    }
});
async function publicacion() {
    const text = document.getElementById("textoPublicacion").value.trim();
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No estás autenticado');
        return;
    }
    if (!text) {
        alert('El texto de la publicación no puede estar vacío.');
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/publicacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ text }),
        });
        const data = await response.json();
        if (response.ok) {
            alert('Publicación creada con éxito');
            cargarPublicaciones();
        }
        else {
            alert('Error: ' + data.message);
        }
    }
    catch (error) {
        console.error('Error al crear la publicación:', error);
        alert('Hubo un error al crear la publicación.');
    }
}
let debounceTimer = null;
let currentSearchQuery = "";
let currentOrder = "asc";
async function cargarPublicaciones(searchQuery = "", order = "asc") {
    try {
        const response = await fetch(`http://localhost:3000/publicacion?search=${encodeURIComponent(searchQuery)}&order=${encodeURIComponent(order)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            const posts = await response.json();
            const publicacionesContainer = document.getElementById('publicaciones-container');
            publicacionesContainer.innerHTML = '';
            const userRole = localStorage.getItem('role');
            posts.forEach((post) => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                const fechaPublicacion = new Date(post.createdAt).toLocaleString();
                const deleteButton = (post.userId === post.user.id || userRole === 'admin') ?
                    `<button class="enviar" onclick="eliminarPublicacion(${post.id})">Eliminar</button>` : "";
                const likeButton = !post.hasLiked ? `<button class="enviar" onclick="darLike(${post.id})">Like</button>` : '';
                const dislikeButton = !post.hasDisliked ? `<button class="enviar" onclick="darDislike(${post.id})">Dislike</button>` : '';
                postElement.innerHTML = `
          <div class="post-header">
            <strong>${post.user.user}</strong>
            <span>${fechaPublicacion}</span>
          </div>
          <div class="post-body">
            <p>${post.text || 'Esta publicación no tiene contenido de texto.'}</p>
            ${post.image ? `<img src="${post.image}" alt="Imagen de la publicación" />` : ''}
            ${post.audio ? `<audio controls><source src="${post.audio}" type="audio/mp3"></audio>` : ''}
          </div>
          <div class="post-footer">
            <span>Likes: ${post.likes || 0}</span> | <span>Dislikes: ${post.dislikes || 0}</span>
            ${likeButton} ${dislikeButton}
            ${deleteButton}
          </div>
        `;
                publicacionesContainer.appendChild(postElement);
            });
        }
        else {
            console.error('Error al obtener las publicaciones');
            alert('Hubo un error al cargar las publicaciones');
        }
    }
    catch (error) {
        console.error('Error de red al cargar las publicaciones:', error);
    }
}
(_b = document.getElementById("search-input")) === null || _b === void 0 ? void 0 : _b.addEventListener("input", (event) => {
    const query = event.target.value;
    currentSearchQuery = query;
    if (debounceTimer)
        clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        cargarPublicaciones(currentSearchQuery, currentOrder);
    }, 300);
});
(_c = document.getElementById("sort-order")) === null || _c === void 0 ? void 0 : _c.addEventListener("change", (event) => {
    currentOrder = event.target.value;
    cargarPublicaciones(currentSearchQuery, currentOrder);
});
window.addEventListener('load', () => {
    cargarPublicaciones();
});
async function eliminarPublicacion(postId) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No estás autenticado.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/publicacion/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (response.ok) {
            alert("Publicación eliminada exitosamente.");
            cargarPublicaciones();
        }
        else {
            const error = await response.json();
            alert("Error: " + error.message);
        }
    }
    catch (error) {
        alert("Hubo un error en la red.");
        console.error(error);
    }
}
async function darLike(postId) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No estás autenticado.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/publicacion/${postId}/like`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (response.ok) {
            alert("Has dado like a la publicación.");
            cargarPublicaciones();
        }
        else {
            const error = await response.json();
            alert("Error: " + error.message);
        }
    }
    catch (error) {
        alert("Hubo un error en la red.");
        console.error(error);
    }
}
async function darDislike(postId) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No estás autenticado.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/publicacion/${postId}/dislike`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (response.ok) {
            alert("Has dado dislike a la publicación.");
            cargarPublicaciones();
        }
        else {
            const error = await response.json();
            alert("Error: " + error.message);
        }
    }
    catch (error) {
        alert("Hubo un error en la red.");
        console.error(error);
    }
}
async function obtenerUsuarios() {
    const response = await fetch("http://localhost:3000/users", {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
    if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
    }
    return response.json();
}
async function mostrarListaUsuarios() {
    try {
        const users = await obtenerUsuarios();
        const userListContainer = document.getElementById("user-list");
        userListContainer.innerHTML = '';
        users.forEach((User) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${User.name}</td>
              <td>${User.lastName}</td>
              <td>${User.email}</td>
              <td>${User.user}</td>
              <td>${User.role}</td>
              <td>${User.isBanned ? "Baneado" : "Activo"}</td>
              <td>
                  <button class="ban-btn" data-user-id="${User.id}">${User.isBanned ? "Desbanear" : "Banear"}</button>
              </td>
          `;
            userListContainer.appendChild(row);
        });
        agregarEventosBanear();
    }
    catch (error) {
        console.error("Error al cargar los usuarios:", error);
    }
}
function agregarEventosBanear() {
    document.querySelectorAll(".ban-btn").forEach((button) => {
        button.addEventListener("click", async (event) => {
            const userId = event.target.getAttribute("data-user-id");
            if (!userId)
                return;
            const action = event.target.textContent === "Banear" ? "ban" : "unban";
            try {
                await toggleBan(Number(userId), action);
                alert(`Usuario ${action === "ban" ? "baneado" : "desbaneado"} correctamente.`);
                mostrarListaUsuarios();
            }
            catch (error) {
                console.error("Error al actualizar el estado del usuario:", error);
                alert("Error al actualizar el estado del usuario.");
            }
        });
    });
}
async function toggleBan(userId, action) {
    const response = await fetch(`http://localhost:3000/users/${userId}/${action}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    });
    if (!response.ok) {
        throw new Error("No se pudo actualizar el estado del usuario");
    }
}
mostrarListaUsuarios();
