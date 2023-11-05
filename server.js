const express = require('express');
const OpenAI = require('openai');
const yup = require('yup');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3001;
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAIAPIKEY });


app.use(express.json());
app.post('/generate-portfolio', async (request, response)=>{
    try {

        const {
            name,
            templateSelection,
            headerPosition,
            includePhoto,
            professionalSummary,
            experienceDetails,
            educationDetails,
            skillsList,
            contactDetails,
            primaryColor,
            secondaryColor,
            backgroundColor,
            fontSelection,
            fontSize,
            responsive
          } = request.body;

        const nameContent = `Name: ${name}`; 
        const experienceContent = experienceDetails.map(exp => 
        `Job Title: ${exp.jobTitle || exp.job_Title}\nCompany Name: ${exp.companyName}`).join('\n\n');

        console.log(educationDetails)
        const educationContent = educationDetails.map(edu => 
        `Institution Name: ${edu.institution}\nGraduation Year: ${edu.graduationYear}\n`);

        const skillsContent = skillsList.map(skill => `Skill: ${skill}`).join('\n');

        const contactContent = `Contact Details:\nGitHub: ${contactDetails.github}\nLinkedIn: ${contactDetails.linkedin}\nTwitter: ${contactDetails.twitter}`;

        // const professionalSummaryContent = `Professional Summary: ${professionalSummary}`;
        // const templateContent = `Template Selection: ${templateSelection}\nHeader Position: ${headerPosition}\nInclude Photo: ${includePhoto}`;
        // const styleContent = `Primary Color: ${primaryColor}\nSecondary Color: ${secondaryColor}\nBackground Color: ${backgroundColor}\nFont: ${fontSelection}\nFont Size: ${fontSize}`;
        // const responsiveContent = `Responsive Design: ${responsive}`;
        // const gptUserPrompt = ``;

        const systemPrompt = `
        You are a helpful assistant skilled in creating portfolio websites using frontend technologies like HTML, Tailwind CSS, and JavaScript. You have received a request to generate the code for ${nameContent} portfolio website.
        
        The portfolio should have a ${templateSelection} theme with a ${headerPosition} header. ${includePhoto === 'yes' ? "The header should include a photo using the provided image URL." : "The header should not include a photo."}
        
        The professional summary of the user is as follows:
        ${professionalSummary}
        
        The user's professional experience is listed below:
        ${experienceContent}
        
        The education details are as follows:
        ${educationContent}
        
        List of skills include:
        ${skillsContent}
        
        The contact details to be included are:
        ${contactContent}
        
        The style preferences for the portfolio are:
        Primary Color: ${primaryColor}
        Secondary Color: ${secondaryColor}
        Background Color: ${backgroundColor}
        Font: ${fontSelection}
        Font Size: ${fontSize}
        
        The website should also be fully ${responsive === 'yes' ? 'responsive' : 'layout'} on mobile devices.
        
        Please generate the HTML, CSS, and optionally JavaScript code that meets these specifications.
        `;
        

        const completionResponse = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt},
            //{ role: 'user', content: systemPrompt},
        ],
        model: 'gpt-3.5-turbo',
        });

        const completion = completionResponse.choices[0].message.content;
        console.log(completion)
        response.json({ completion });
        } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
        }
}); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

