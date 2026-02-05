const STRAPI_URL = 'https://cms.vigotskyreynosa.edu.mx';

const service = {
  number: "01.",
  title: "Plan de Estudios Integral",
  description: "Nuestro Plan de Estudios Integral está diseñado para nutrir mentes jóvenes.",
  shortDescription: "Un plan educativo completo.",
  imagePosition: "left",
  order: 1
};

async function testOne() {
  console.log('Testing single service creation...\n');
  console.log('Data:', JSON.stringify(service, null, 2));

  try {
    const response = await fetch(`${STRAPI_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(service)
    });

    console.log('\nResponse status:', response.status);
    const text = await response.text();
    console.log('Response:', text);

  } catch (error) {
    console.error('Error:', error);
  }
}

testOne();
