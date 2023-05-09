let instanceUrl;
const clientId = 'IYxFEpA9-8xiKEsdkHg7A-Cd-_srC5v1q3LNur6lQ8';
const clientSecret = 'NcpS3rtYXdT6QE9RYvj_UPBg_KIiZiGBmd_3dLka-5M';
const redirectPath = '/redirect.html';

const loginButton = document.getElementById('login-button');
const rootElement = document.getElementById('root');
const instanceUrlInput = document.getElementById('instance-url');

// Add a click event listener to the login button
loginButton.addEventListener('click', () => {
  // Get the value of the instance URL input field
  instanceUrl = instanceUrlInput.value;

  // Create a URL for the Mastodon instance's authorization endpoint
  const redirectUri = `${window.location.origin}${redirectPath}`;
  const authUrl = `${instanceUrl}/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;

  // Redirect the user to the authorization URL
  window.location.href = authUrl;
});

// Check if the URL includes an authorization code
if (window.location.pathname === redirectPath && window.location.search.includes('code=')) {
  // Extract the authorization code from the URL
  const code = new URLSearchParams(window.location.search).get('code');

  // Send a request to the Mastodon instance's token endpoint to exchange the authorization code for an access token
  fetch(`${instanceUrl}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: `${window.location.origin}${redirectPath}`,
      code: code
    })
  })
  .then(response => response.json())
  .then(data => {
    // Use the access token to fetch the user's timeline
    return fetch(`${instanceUrl}/api/v1/timelines/home`, {
      headers: {
        'Authorization': `Bearer ${data.access_token}`
      }
    });
  })
  .then(response => response.json())
  .then(posts => {
    // Create an array of HTML elements representing the posts
    const postElements = posts.map(post => {
      return `
        <div>
          <strong>${post.account.display_name}</strong> (@${post.account.acct})<br>
          ${post.content}
        </div>
      `;
    });

    // Render the post elements in the root element
    rootElement.innerHTML = postElements.join('');
  })
  .catch(error => {
    console.error(error);
  });
}
