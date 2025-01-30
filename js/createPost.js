async function createPost() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const author = document.getElementById("author").value;

    // Validar se os campos não estão vazios
    if (!title || !content || !author) {
        alert("Todos os campos devem ser preenchidos.");
        return;
    }

    const response = await fetch("https://fikc.onrender.com/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, author })
    });

    const result = await response.json();

    // Exibe mensagem de sucesso ou erro
    if (response.ok) {
        alert("Post criado com sucesso!");
        document.getElementById("title").value = '';
        document.getElementById("content").value = '';
        document.getElementById("author").value = '';
    } else {
        alert(result.error || "Erro ao criar post");
    }
}