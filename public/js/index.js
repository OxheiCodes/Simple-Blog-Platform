const postList = document.getElementById("post-list");

async function getPosts() {
  const response = await fetch("/api/posts");
  if (!response.ok) {
    throw new Error("Could not load posts.");
  }

  return response.json();
}

function renderPosts(posts) {
  if (posts.length === 0) {
    postList.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  const html = posts
    .map((post) => {
      return `
        <article class="post-row">
          <h3 class="post-title">${post.title}</h3>
          <p class="post-content">${post.content}</p>
          <div class="post-actions">
            <a href="/post.html?id=${post.id}">View</a>
            <a href="/edit.html?id=${post.id}">Edit</a>
            <button class="delete-post-button" data-id="${post.id}">Delete</button>
          </div>
        </article>
      `;
    })
    .join("");

  postList.innerHTML = html;

  const deleteButtons = document.querySelectorAll(".delete-post-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDeletePost);
  });
}

async function handleDeletePost(event) {
  const id = Number(event.target.dataset.id);
  const confirmed = window.confirm("Delete this post?");

  if (!confirmed) {
    return;
  }

  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    postList.insertAdjacentHTML("afterbegin", "<p>Could not delete post.</p>");
    return;
  }

  loadPosts();
}

async function loadPosts() {
  try {
    const posts = await getPosts();
    renderPosts(posts);
  } catch (error) {
    postList.innerHTML = `<p>${error.message}</p>`;
  }
}

loadPosts();
