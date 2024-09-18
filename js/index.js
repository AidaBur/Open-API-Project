// Get references to HTML elements
const imagesSection = document.querySelector('.images');
const breedsSection = document.querySelector('.breeds');
const radios = document.querySelector('.header__switch-model');

// Map models to their respective sections
const modelToSectionMap = new Map();
modelToSectionMap.set('images', imagesSection);
modelToSectionMap.set('breeds', breedsSection);

// Map models to their respective API endpoints
const modelToEndpointMap = new Map();
modelToEndpointMap.set('images', '/images/search?limit=30&');
modelToEndpointMap.set('breeds', '/breeds?');

// API configuration
const apiUrl = 'https://api.thedogapi.com/v1';
const apiKey = 'live_v17ilxbRIfyshBmjfI9cWNTKKCOMhmaJqx7TPuBZfDN8Xk7Sl0MGfth4bftySHfS';

// Initialize current model and data array
let currentModel = 'images';
const currentDataArray = [];

// Event listener for model switch
radios.addEventListener('click', (event) => {
  const target = event.target;

  // Check if the clicked element is a radio button
  if (target.tagName === 'INPUT' && target.type === 'radio') {
    switch (target.id) {
      case 'images':
        currentModel = 'images';
        imagesSection.style.display = 'flex';
        breedsSection.style.display = 'none';
        break;
      case 'breeds':
        currentModel = 'breeds';
        imagesSection.style.display = 'none';
        breedsSection.style.display = 'flex';
        break;
    }
    generatePageElements(currentModel);
  }
});

// Function to generate page elements based on the current model
const generatePageElements = (model) => {
  const container = modelToSectionMap.get(model).querySelector('.section__container');
  currentDataArray.length = 0; // Clear current data array
  showLoadingSpinner(container); // Show loading spinner
  const requestUrl = `${apiUrl}${modelToEndpointMap.get(model)}api_key=${apiKey}`;
  fetchData(requestUrl, model, container); // Fetch data from API
}

// Function to fetch data from API
async function fetchData(url, model, container) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed'); // Handle request errors
      }
      return response.json(); // Parse JSON response
    })
    .then(data => {
      data.forEach(el => appendDataToArray(el, model)); // Process data

      container.innerHTML = ''; // Clear existing content
      currentDataArray.forEach(el => container.appendChild(createDataCard(el, model))); // Append new data
    })
    .catch(error => {
      console.error('An error occurred:', error); // Log errors
    });
}

// Function to show loading spinner while fetching data
const showLoadingSpinner = (container) => {
  container.innerHTML = ''; // Clear existing content
  const spinnerDiv = document.createElement('div');
  spinnerDiv.classList.add('loading-spinner');
  
  // Create spinner circles
  for (let i = 0; i < 12; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    spinnerDiv.appendChild(circle);
  }
  
  container.appendChild(spinnerDiv); // Append spinner to container
}

// Function to add data to array based on the model
const appendDataToArray = (data, model) => {
  switch (model) {
    case 'images':
      const breed = data.breeds[0] ? data.breeds[0].name : '';
      const imageUrl = data.url;
      if (!imageUrl.endsWith('.gif')) { // Exclude GIF images
        currentDataArray.push({ 'breed': breed, 'imageUrl': imageUrl });
      }
      break;
    case 'breeds':
      const name = data.name;
      const bredFor = data.bred_for;
      const breedGroup = data.breed_group;
      const lifeSpan = data.life_span;
      const temperament = data.temperament;
      const origin = data.origin;
      const image = data.image.url;
      const weight = data.weight.imperial;
      const height = data.height.imperial;
      currentDataArray.push({
        'breed': name,
        'imageUrl': image,
        'bredFor': bredFor,
        'breedGroup': breedGroup,
        'lifeSpan': lifeSpan,
        'temperament': temperament,
        'origin': origin,
        'weight': weight,
        'height': height
      });
  }
}

// Function to create a data card element
const createDataCard = (data, model) => {
  const card = document.createElement('div');
  switch (model) {
    case 'images':
      card.classList.add('images__card');
      const img = document.createElement('img');
      img.src = data.imageUrl;
      img.alt = `Picture of ${data.breed ? data.breed : 'a dog'}`;
      card.appendChild(img);
      const text = document.createElement('h3');
      text.innerText = `Breed: ${data.breed ? data.breed : 'no breed information'}`;
      card.appendChild(text);
      break;
    case 'breeds':
      card.classList.add('breeds__card');
      const breedImg = document.createElement('img');
      breedImg.src = data.imageUrl;
      breedImg.alt = `Picture of ${data.breed}`;
      card.appendChild(breedImg);
      const breed = document.createElement('h4');
      breed.innerText = data.breed;
      card.appendChild(breed);
      if (data.bredFor) {
        const bredFor = document.createElement('p');
        bredFor.innerHTML = `<span>Bred for:</span> ${data.bredFor}`;
        card.appendChild(bredFor);
      }
      if (data.breedGroup) {
        const breedGroup = document.createElement('p');
        breedGroup.innerHTML = `<span>Breed group:</span> ${data.breedGroup}`;
        card.appendChild(breedGroup);
      }
      if (data.weight) {
        const weight = document.createElement('p');
        weight.innerHTML = `<span>Weight(lb):</span> ${data.weight}`;
        card.appendChild(weight);
      }
      if (data.height) {
        const height = document.createElement('p');
        height.innerHTML = `<span>Height(in):</span> ${data.height}`;
        card.appendChild(height);
      }
      if (data.lifeSpan) {
        const lifeSpan = document.createElement('p');
        lifeSpan.innerHTML = `<span>Life span:</span> ${data.lifeSpan}`;
        card.appendChild(lifeSpan);
      }
      if (data.temperament) {
        const temperament = document.createElement('p');
        temperament.innerHTML = `<span>Temperament:</span> ${data.temperament}`;
        card.appendChild(temperament);
      }
      if (data.origin) {
        const origin = document.createElement('p');
        origin.innerHTML = `<span>Origin:</span> ${data.origin}`;
        card.appendChild(origin);
      }
  }
  return card; // Return the created card element
}

// Generate initial page elements for the current model
generatePageElements(currentModel);
