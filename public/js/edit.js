const formTitle = document.getElementById("form-title");
const postForm = document.getElementById("post-form");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const message = document.getElementById("message");

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

async function loadPostForEdit() {
  if (!id) {
    return;
  }

  formTitle.textContent = "Edit Post";

  const response = await fetch(`/api/posts/${id}`);
  if (!response.ok) {
    message.textContent = "Could not load post to edit.";
    return;
  }

  const post = await response.json();
  titleInput.value = post.title;
  contentInput.value = post.content;
}

loadPostForEdit();

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    message.textContent = "Please enter both title and content.";
    return;
  }

  const payload = {
    title,
    content,
  };

  if (id) {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      message.textContent = "Could not update post.";
      return;
    }

    message.textContent = "Post updated.";
    window.location.href = `/post.html?id=${id}`;
    return;
  }

  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    message.textContent = "Could not create post.";
    return;
  }

  const newPost = await response.json();
  message.textContent = "Post created.";
  window.location.href = `/post.html?id=${newPost.id}`;
});
