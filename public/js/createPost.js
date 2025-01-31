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
        body: formData // Envia os dados corretamente
    });

    const result = await response.json();

    // Exibe mensagem de sucesso ou erro
    if (response.ok) {
        alert("Post criado com sucesso!");
        document.getElementById("title").value = '';
        document.getElementById("content").value = '';
        document.getElementById("author").value = '';
        document.getElementById("image").value = ''; // Limpa o campo de imagem
        fetchPosts(); // Atualiza a lista de posts
    } else {
        alert(result.error || "Erro ao criar post");
    }
}
