async function createPost() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const author = document.getElementById("author").value;
    const imageInput = document.getElementById("image");
    const image = imageInput.files[0]; // Pegando a imagem selecionada

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    if (image) {
        formData.append("image", image);
    }

    const response = await fetch("https://fikc.onrender.com/api/posts", {
        method: "POST",
        body: formData // Não precisa de headers aqui, o navegador adiciona automaticamente
    });

    const result = await response.json();

    if (response.ok) {
        alert("Post criado com sucesso!");
        document.getElementById("title").value = '';
        document.getElementById("content").value = '';
        document.getElementById("author").value = '';
        document.getElementById("image").value = '';
        fetchPosts();
    } else {
        alert(result.error || "Erro ao criar post");
    }
}

// Função para pegar todos os posts
async function fetchPosts() {
    const response = await fetch("https://fikc.onrender.com/api/posts");
    const posts = await response.json();
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = posts.map(post => `
        <div class="post">
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <small>Por ${post.author} em ${new Date(post.created_at).toLocaleDateString()}</small>
            ${post.image_url ? `<img src="https://fikc.onrender.com${post.image_url}" style="max-width:100%">` : ""}
            <br>
            <button onclick="deletePost(${post.id})">Excluir</button>
        </div>
    `).join("");
}
// Função para excluir um post
async function deletePost(id) {
    const response = await fetch(`https://fikc.onrender.com/api/posts/${id}`, { method: "DELETE" });
    const result = await response.json();
    alert(result.message);
    fetchPosts();  // Atualiza a lista de posts
}

// Carregar os posts quando a página for carregada
fetchPosts();
