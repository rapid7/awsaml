import React from 'react';
import PropTypes from 'prop-types';

const clipboard = `
const clipboard = new ClipboardJS('.copy-to-clipboard-button');
clipboard.on('success', (e) => {
  console.log(e);
});
clipboard.on('error', (e) => {
  console.log(e);
});
`;

const DefaultLayout = function render(props) {
  return (
    <html lang="en">
      <head>
        <title>{props.title}</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link
          crossOrigin="anonymous"
          href="https://use.fontawesome.com/releases/v5.0.13/css/all.css"
          integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp"
          rel="stylesheet"
        />
        <link
          crossOrigin="anonymous"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"
          integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB"
          rel="stylesheet"
        />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.14.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
        <link href="/css/app.css" rel="stylesheet" />
      </head>
      <body>
        <div className="container">
          {props.children}
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.1/clipboard.min.js" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.14.0/prism.min.js" />
        <script dangerouslySetInnerHTML={{__html: clipboard}} type="text/javascript" />
      </body>

    </html>
  );
};

DefaultLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired
};
DefaultLayout.displayName = 'DefaultLayout';

module.exports = DefaultLayout;
