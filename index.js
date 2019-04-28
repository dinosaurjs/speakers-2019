const fs = require('fs');
const path = require('path');

const mjml = require('mjml');

const createTemplate = require('./lib/create-template');
const createDirectory = require('./lib/create-directory');
const getFiles = require('./lib/get-files');

const includesPath = path.join(__dirname, 'mjml-includes');
const output = path.join(__dirname, 'output');
const mjmlOptions = {
  beautify: true,
  filePath: includesPath
};

createDirectory(output).then(async directory => {
  try {
    const generateSpeakerMarkup = await createTemplate(
      './templates/speaker-template.hbs'
    );
    const generateSponsorMarkup = await createTemplate(
      './templates/sponsor-template.hbs'
    );
    const generateEmailMarkup = await createTemplate(
      './templates/email-template.hbs'
    );

    const speakers = await getFiles('./speakers');
    const sponsors = await getFiles('./sponsors');
    const emails = await getFiles('./emails');

    for (const email of Object.values(emails)) {
      const { name } = path.parse(email.file);
      const file = path.format({ name, ext: '.html' });

      const destination = path.join(directory, file);

      email.sponsor = generateSponsorMarkup(sponsors[email.sponsor]);
      email.speakers = email.speakers.map(speaker => {
        return generateSpeakerMarkup(speakers[speaker]);
      });

      const markup = generateEmailMarkup(email);

      const { html, errors } = mjml(markup, mjmlOptions);

      for (const error of errors) {
        console.error(error);
      }

      fs.writeFile(destination, html, error => {
        console.log(`Wrote HTML email fragement for ${name} in ${file}.`);
      });
    }
  } catch (error) {
    console.error(error);
  }
});
