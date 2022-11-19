// function to add comment
async function commentFormHandler(event) {
    event.preventDefault();
  
    const content_com = document
      .querySelector('input[name="comment-body"]')
      .value.trim();
  
    const post_id = window.location.toString().split("/")[
      window.location.toString().split("/").length - 1
    ];
  
    if (content_com) {
      const response = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          post_id,
          content_com,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
        document.querySelector("#comment-form").style.display = "block";
      }
    }
  }
  
  document.querySelector(".comment-form").addEventListener("submit", commentFormHandler);