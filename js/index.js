// Make a request to the GitHub API to get user repositories
fetch('https://api.github.com/users/AidaBur/repos')
  .then(response => {
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Return the response as JSON
    return response.json();
  })
  .then(data => {
    // Check if the data array is empty
    if (data.length === 0) {
      console.log('No repositories found');
      // Update the DOM to inform the user
      document.getElementById('projects').innerHTML = 'No projects available.';
    } else {
      // Process the data and update the DOM
      const projectList = document.querySelector('#projects');
      projectList.innerHTML = ''; // Clear existing content

      data.forEach(repo => {
        // Create a list item for each repository
        const listItem = document.createElement('div');
        listItem.innerHTML = `
          <h3><strong>${repo.name}</strong></h3>
          <p>Created on: ${new Date(repo.created_at).toLocaleDateString()}</p>
          <a href="${repo.html_url}" target="_blank">View Repository</a>
        `;
        projectList.appendChild(listItem);
      });
    }
  })
  .catch(error => {
    // Handle errors that occurred during the fetch
    console.error('There has been a problem with your fetch operation:', error);
    // Update the DOM to inform the user about the error
    document.getElementById('projects').innerHTML = 'An error occurred while fetching the projects.';
  });
