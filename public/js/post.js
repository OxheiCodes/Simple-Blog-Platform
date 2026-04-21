const detailElement = document.getElementById("post-detail");
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

async function loadPost() {
  if (!id) {
    detailElement.innerHTML = "<p>Post not found.</p>";
    return;
  }

  const response = await fetch(`/api/posts/${id}`);

  if (!response.ok) {
    detailElement.innerHTML = "<p>Post not found.</p>";
    return;
  }

  const post = await response.json();
  detailElement.innerHTML = `
    <h3>${post.title}</h3>
    <p>${post.content}</p>
    <p>
      <a href="/edit.html?id=${post.id}">Edit This Post</a>
      |
      <button id="delete-post-button">Delete This Post</button>
    </p>
  `;

  const deleteButton = document.getElementById("delete-post-button");
  deleteButton.addEventListener("click", async () => {
    const confirmed = window.confirm("Delete this post?");
    if (!confirmed) {
      return;
    }

    const deleteResponse = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    if (!deleteResponse.ok) {
      detailElement.insertAdjacentHTML("beforeend", "<p>Could not delete post.</p>");
      return;
    }

    window.location.href = "/index.html";
  });
}

loadPost();
