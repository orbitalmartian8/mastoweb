const instanceUrl = 'https://linuxrocks.online';

// Fetch the public timeline from the Mastodon API
fetch(`${instanceUrl}/api/v1/timelines/public/local`)
  .then(response => response.json())
  .then(posts => {
    // Create an array of HTML elements representing the posts
    const postElements = posts.map(post => {
      return `
        <div>
          <p><strong>${post.account.display_name}</strong> (@${post.account.username})</p>
          <p>${post.content}</p>
        </div>
      `;
    });

    // Insert the post elements into the DOM
    const rootElement = document.getElementById('root');
    rootElement.innerHTML = postElements.join('');
  })
  .catch(error => {
    console.error(error);
  });
