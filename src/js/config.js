((PLUGIN_ID) => {
  'use strict';

  const client = new KintoneRestAPIClient({});

  // Get the elements
  const fieldSelection = document.getElementById('field-selection');
  const allowedExtensions = document.getElementById('allowed-extensions');
  const submitForm = document.getElementById('submit');
  const cancelButton = document.getElementById('cancel');

  // Escape HTML
  const escapeHtml = (htmlStr) => {
    return htmlStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // Set the saved data if it exists
  const setDefault = () => {
    const conf = kintone.plugin.app.getConfig(PLUGIN_ID);
    if (!conf.fieldSelection === undefined || conf.fieldSelection !== 'undefined') {
      fieldSelection.value = conf.fieldSelection;
    }
    if (conf.allowedExtensions !== 'undefined') {
      allowedExtensions.value = conf.allowedExtensions;
    }
  };

  // Set the attachment fields
  const setAttachmentFields = () => {
    const APP_ID = kintone.app.getId();
    const params = {
      app: APP_ID,
      preview: true
    };

    return client.app.getFormFields(params).then((resp) => {
      console.log(resp, '===============resp==================');

      for (const key of Object.keys(resp.properties)) {
        if (!resp.properties[key]) {
          continue;
        }
        const prop = resp.properties[key];
        if (prop.type === 'FILE') {
          const option = document.createElement('option');
          option.setAttribute('value', escapeHtml(prop.code));
          option.innerText = escapeHtml(prop.label);
          fieldSelection.appendChild(option);
        }
      }
    }).catch((error) => {
      console.log(error);
      alert('Error occurred.');
    });
  };

  // Set the input data if the save button is clicked
  submitForm.onsubmit = (e) => {
    e.preventDefault();
    const config = {};
    if (!fieldSelection.value || fieldSelection.value === 'null') {
      alert('The attachment field has not been selected.');
      return false;
    }
    config.fieldSelection = fieldSelection.value;
    config.allowedExtensions = allowedExtensions.value;
    kintone.plugin.app.setConfig(config);
    return true;
  };

  // Cancel the process if the cancel button is clicked
  cancelButton.onclick = (e) => {
    e.preventDefault();
    history.back();
  };

  setAttachmentFields().then(() => {
    setDefault();
  });

})(kintone.$PLUGIN_ID);
