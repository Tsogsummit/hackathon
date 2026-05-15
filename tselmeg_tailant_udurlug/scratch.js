const officeParser = require('officeparser');
officeParser.parseOffice('uploads/docx/7b.docx', function(data, err) {
  if (err) return console.log('ERR:', err);
  console.log(data.toText());
});
