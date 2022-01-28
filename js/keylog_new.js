// Author: Taylor Arnold (tarnold2@richmond.edu)
// Date: 2022-01-28

// Create a global variable that stores all of the output data; initialize it
// with the header row fror a CSV file
var startRecord = {
  'event': 'start',
  'language': navigator.language,
  'useragent': navigator.userAgent
};
var dset = [startRecord];
var delay = 1000;
var next_saved = delay;
ibox = document.getElementById('lname');
ibox.value = '';

// Add a record when a key is pressed when focused on the textbox element.
ibox.addEventListener('keydown', (res) => {
  var nline = {
    'time': res.timeStamp,
    'event': 'keydown',
    'key': res.key,
    'code': res.code,
    'start': res.target.selectionStart,
    'end': res.target.selectionEnd
  };

  if (res.altKey) { nline.altkey = true; }
  if (res.ctrlKey) { nline.ctrlkey = true; }
  if (res.metaKey) { nline.metakey = true; }
  if (res.shiftKey) { nline.shiftkey = true; }
  if (res.repeat) { nline.repeat = true; }

  dset.push(nline);
});

// Add a record when a key is released when focused on the textbox element.
ibox.addEventListener('keyup', (res) => {
  var nline = {
    'time': res.timeStamp,
    'event': 'keyup',
    'key': res.key,
    'code': res.code,
    'start': res.target.selectionStart,
    'end': res.target.selectionEnd
  };

  if (res.altKey) { nline.altkey = true; }
  if (res.ctrlKey) { nline.ctrlkey = true; }
  if (res.metaKey) { nline.metakey = true; }
  if (res.shiftKey) { nline.shiftkey = true; }
  if (res.repeat) { nline.repeat = true; }

  dset.push(nline);
});

// Add a record when the mouse is clicked in the textbox element.
ibox.addEventListener('click', (res) => {
  var nline = {
    'time': res.timeStamp,
    'event': 'click',
    'start': res.target.selectionStart,
    'end': res.target.selectionEnd
  };

  if (res.altKey) { nline.altkey = true; }
  if (res.ctrlKey) { nline.ctrlkey = true; }
  if (res.metaKey) { nline.metakey = true; }
  if (res.shiftKey) { nline.shiftkey = true; }
  if (res.repeat) { nline.repeat = true; }

  dset.push(nline);
});


// Add a record when the mouse is clicked in the textbox element.
ibox.addEventListener('paste', (res) => {
  var nline = {
    'time': res.timeStamp,
    'event': 'paste',
    'content': res.clipboardData.getData('text'),
    'start': res.target.selectionStart,
    'end': res.target.selectionEnd
  };

  dset.push(nline);
});

// Add a record when there is an input.
ibox.addEventListener('input', (res) => {
  var nline = {
    'time': res.timeStamp,
    'event': 'input',
    'content':  ( res.data || "" ),
    'start': res.target.selectionStart,
    'end': res.target.selectionEnd
  };

  // If it has been a while, store the current text as well:
  if (res.timeStamp > next_saved)
  {
    next_saved = res.timeStamp + delay;
    nline.current = ibox.value;
  }

  dset.push(nline);
});

// Download the current dataset from the DOM as a JSON file
downloadLink = document.getElementById("downloadAnchorElem");
downloadLink.addEventListener('click', (res) => {
  // add one last record of the full final text
  dset.push({
    'time': res.timeStamp,
    'event': 'final',
    'current': ibox.value
  });

  // collapse records to a string
  var dataStr = "data:application/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(dset));
  var dlAnchorElem = document.getElementById('downloadAnchorElem');

  // Copy the records into the DOM
  let today = Date.now();
  ibox.disabled = true;
  downloadLink.setAttribute("href", dataStr);
  downloadLink.setAttribute("download", "keylogs-" + today + ".json");
});

// Clear the textbox and reset the dataset
clearLink = document.getElementById("resetTexbox");
clearLink.addEventListener('click', () => {
  ibox.disabled = false;
  ibox.value = '';
  dset = [startRecord];
});
