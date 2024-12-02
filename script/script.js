async function renderPlanCards() {
  const planContainer = document.querySelector('.plan-card-container');
  planContainer.innerHTML = ''; // Clear any existing content

  try {
    // Fetch Data from json file
    const dataResponse = await fetch("data.json");
    const { data } = await dataResponse.json();

    // Fetch the HTML template from the plan-card.html file
    const planCardTemplateResponse = await fetch('./view/planCard.html');
    const planCardTemplate = await planCardTemplateResponse.text();

    const planCardInputsTemplateResponse = await fetch('./view/planCardInput.html');
    const planCardInputTemplate = await planCardInputsTemplateResponse.text();

    data.forEach(plan => {
      const planCardId = `planCard${plan.id}`
      // Replace placeholders with actual data
      let cardHTML = planCardTemplate
        .replace(/{name}/g, plan.name)
        .replace(/{tag}/g, plan.tag)
        .replace(/{discount}/g, plan.discount)
        .replace(/{description}/g, plan.description)
        .replace(/{newPrice}/g, plan.newPrice)
        .replace(/{oldPrice}/g, plan.oldPrice)
        .replace(/{planCardInputs}/g, planCardInputTemplate);

      // Create a new div for the card and insert the rendered HTML
      const card = document.createElement('div');
      card.classList.add('plan-card');
      card.innerHTML = cardHTML;
      card.id = planCardId;

      // Check if the description is empty, null or undefined, and add the 'inactive' class
      const descriptionElement = card.querySelector('.plan-card-info-details-description');
      if (!plan.description) {
        descriptionElement.classList.add('inactive');
      }

      // Check if the tag is empty, null or undefined, and add the 'inactive' class
      const tagElement = card.querySelector('.plan-card-tag');
      if (!plan.tag) {
        tagElement.classList.add('inactive');
      }

      // Hide the input options initially
      const planCardInputElement = card.querySelector('.plan-card-input');
      planCardInputElement.style.display = 'none';

      // Add an event listener to the card for click behavior
      card.addEventListener('click', () => {
        document.querySelectorAll('.plan-card').forEach(planCard => {
          planCard.classList.remove('active'); // Remove active class from all cards
          const radioButton = planCard.querySelector('input[type="radio"]');
          radioButton.checked = false; // Uncheck all radio buttons

          // Hide input options for all other cards
          const otherInputOptions = planCard.querySelector('.plan-card-input');
          if (otherInputOptions) {
            otherInputOptions.style.display = 'none';
          }
        });

        // Add active class to the selected   
        card.classList.add('active');

        // Check the radio button inside the clicked card
        const radioButton = card.querySelector('input[type="radio"]');
        radioButton.checked = true;

        // Show input options for the active card
        planCardInputElement.style.display = 'block';

        // Update the planSummaryPrice paragraph
        planSummaryPrice.textContent = `Total: ${plan.newPrice}`;
      });

      // Append the card to the plan container
      planContainer.appendChild(card);

      if (plan.tag.toLocaleUpperCase() === "MOST POPULAR") {
        const radioButton = card.querySelector('input[type="radio"]');
        radioButton.checked = true;
        planSummaryPrice.textContent = `Total: ${plan.newPrice}`;
        document.getElementById(planCardId).classList.add('active');        
        planCardInputElement.style.display = 'block';
      }
    });
  } catch (error) {
    console.error('Error loading the plan card template:', error);
  }
}

// Initialize the rendering when the document is ready
document.addEventListener('DOMContentLoaded', renderPlanCards);